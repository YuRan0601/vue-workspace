<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { Modal } from "bootstrap"; // 顯式導入 Modal

// 儲存查詢到的訂單資料
const orders = ref([]);

// 儲存目前選中的訂單資料，用於模態框顯示
const selectedOrder = ref(null);

// 綁定輸入框的值，用於查詢單筆訂單
const searchOrderId = ref("");

// 格式化時間函數 (24 小時制)
const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false // **新增：使用 24 小時制**
    };
    return date.toLocaleDateString("zh-TW", options); // **保留台灣地區語言格式**
};

const fetchOrders = async () => {
    try {
        const response = await axios.get("/api/Order/findAllOrders");
        console.log("返回的完整資料：", response.data);

        // 強制檢查類型，防止意外轉換
        let data = response.data;
        if (typeof data === "string") {
            data = JSON.parse(data); // 如果是字符串，強制解析
        }

        // 判斷是否為數組
        if (Array.isArray(data)) {
            orders.value = data.map(order => {
                const { orderItemsBeans, ...filteredOrder } = order;
                return filteredOrder;
            });
        } else {
            console.error("API 返回的不是數組：", data);
        }
    } catch (error) {
        console.error("API 請求失敗：", error);
    }
};

// 查詢單筆訂單是否存在
const validateOrderId = async () => {
    if (!searchOrderId.value) return;

    try {
        const response = await axios.get(`/api/Order/findOrderById/${searchOrderId.value}`);
        if (response.data) {
            // 如果找到訂單，跳轉到詳細頁面
            window.location.href = `/order/orderdetail?orderId=${searchOrderId.value}`;
        } else {
            // 如果沒有找到，顯示錯誤訊息
            showModal("查無此訂單", "請確認訂單編號是否正確！");
        }
    } catch (error) {
        // 如果後端報錯（例如 404），也顯示錯誤訊息
        showModal("查無此訂單", "請確認訂單編號是否正確！");
    }
};

// 顯示彈窗
const showModal = (title, body) => {
    const modalElement = document.getElementById("errorModal");
    const modalInstance = new Modal(modalElement);
    document.getElementById("errorModalTitle").innerText = title;
    document.getElementById("errorModalBody").innerText = body;
    modalInstance.show();
};

// 開啟模態框並設定選中的訂單
const openDeleteModal = (order) => {
    selectedOrder.value = order; // 設定選中的訂單
    const modal = new Modal(document.getElementById("exampleModal"));
    modal.show();
};

// 確認刪除
const confirmDelete = async () => {
    if (!selectedOrder.value) return;

    try {
        await axios.delete(`/api/Order/delete/${selectedOrder.value.orderId}`);
        console.log(`訂單 ${selectedOrder.value.orderId} 已刪除`);
        fetchOrders(); // 刪除成功後重新載入訂單列表
        const modal = Modal.getInstance(document.getElementById("exampleModal"));
        modal.hide(); // 關閉模態框
    } catch (error) {
        console.error("刪除失敗：", error);
    }
};

// 頁面載入時自動查詢資料_初始化頁面
onMounted(fetchOrders);
</script>

<template>
    <div class="container mt-5">
        <h2 class="text-center">訂單總表</h2>
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <!-- 新增訂單編號查詢輸入框 -->
            <div class="input-group mb-4">
                <input type="text" class="form-control" placeholder="請輸入訂單編號" v-model="searchOrderId" />
                <button class="btn btn-primary" :disabled="!searchOrderId" @click="validateOrderId">
                    查詢
                </button>
            </div>
            <!-- 新增訂單按鈕 -->
            <RouterLink :to="{ name: 'orderadd' }" class="button-48" role="button">
                <span class="text">新增訂單</span>
            </RouterLink>
        </div>

        <table class="table table-hover table-bordered mt-3">
            <thead class="table-light text-center">
                <tr>
                    <th>OrderID</th>
                    <th>訂單狀態</th>
                    <th>付款方式</th>
                    <th>折扣金額</th>
                    <th>最終金額</th>
                    <th>訂單日期</th>
                    <th>更新日期</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order.orderId" class="text-center align-middle">
                    <td>{{ order.orderId }}</td>
                    <td>{{ order.orderStatus }}</td>
                    <td>{{ order.paymentMethod }}</td>
                    <td>{{ order.discountAmount }}</td> <!-- 修改為正確的字段名稱 -->
                    <td>{{ order.finalAmount }}</td>
                    <td>{{ formatDateTime(order.orderDate) }}</td>
                    <td>{{ formatDateTime(order.updatedAt) }}</td>
                    <td>
                        <!-- 操作按鈕 -->
                        <RouterLink :to="{ name: 'orderdetail', query: { orderId: order.orderId } }"
                            class="btn btn-primary btn-sm me-1">
                            <i class="bi bi-eye"></i>
                        </RouterLink>
                        <RouterLink :to="{ name: 'orderedit', query: { orderId: order.orderId } }"
                            class="btn btn-warning btn-sm me-1">
                            <i class="bi bi-pencil-square"></i>
                        </RouterLink>
                        <button class="btn btn-danger btn-sm" @click="openDeleteModal(order)">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
                <tr v-if="orders.length === 0">
                    <td colspan="8" class="text-center">目前沒有訂單資料</td>
                </tr>
            </tbody>

        </table>
        <!-- 錯誤訊息的彈窗 -->
        <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="errorModalTitle">錯誤訊息</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="errorModalBody">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            確定
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 刪除確認模態框 -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">訂單刪除</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        確定要刪除OrderID為 "<strong>{{ selectedOrder?.orderId }}</strong> "的訂單嗎？
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click="confirmDelete">確定刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 如果需要，這裡可以加上自定義樣式 */
.input-group {
    max-width: 400px;
    margin: 0 auto;
}

.button-48 {
    appearance: none;
    background-color: #FFFFFF;
    border-width: 0;
    box-sizing: border-box;
    color: #000000;
    cursor: pointer;
    display: inline-block;
    font-family: Clarkson, Helvetica, sans-serif;
    font-size: 18px;
    /* 調整字體大小 */
    font-weight: 600;
    /* 增加字體粗細 */
    letter-spacing: 0;
    line-height: 1.5em;
    margin: 0;
    opacity: 1;
    outline: 0;
    padding: 1em 2em;
    /* 調整內邊距 */
    position: relative;
    text-align: center;
    text-decoration: none;
    text-rendering: geometricprecision;
    text-transform: uppercase;
    transition: opacity 300ms cubic-bezier(.694, 0, 0.335, 1),
        background-color 100ms cubic-bezier(.694, 0, 0.335, 1),
        color 100ms cubic-bezier(.694, 0, 0.335, 1);
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: baseline;
    white-space: nowrap;
}

.button-48:before {
    animation: opacityFallbackOut 0.5s step-end forwards;
    backface-visibility: hidden;
    background-color: #ebebeb;
    clip-path: polygon(-1% 0, 0 0, -25% 100%, -1% 100%);
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transform: translateZ(0);
    transition: clip-path 0.5s cubic-bezier(.165, 0.84, 0.44, 1),
        -webkit-clip-path 0.5s cubic-bezier(.165, 0.84, 0.44, 1);
    width: 100%;
}

.button-48:hover:before {
    animation: opacityFallbackIn 0s step-start forwards;
    clip-path: polygon(0 0, 101% 0, 101% 101%, 0 101%);
}

.button-48:after {
    background-color: #ffffff;
}

.button-48 span {
    z-index: 1;
    position: relative;
}
</style>
