<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import Swal from "sweetalert2"; // 引入 SweetAlert2

// 接收從父組件傳遞的 orderId
const props = defineProps({
    orderId: {
        type: String,
        required: true,
    },
});

// 訂單詳細資料
const orderDetail = ref({});
const errorMessage = ref(""); // 錯誤訊息，用於顯示錯誤

// 格式化時間函數
const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return isNaN(date.getTime()) ? "" : date.toLocaleString("zh-TW");
};

// SweetAlert2 更新警告
const showUpdateAlert = () => {
    Swal.fire({
        title: "確定要修改此訂單嗎？",
        text: "確認後將保存更改！",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6", // 確認按鈕顏色
        cancelButtonColor: "#6c757d", // 取消按鈕顏色
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        buttonsStyling: false, // 停用 SweetAlert2 預設樣式
        customClass: {
            confirmButton: "btn btn-primary text-white me-2", // 自定義確認按鈕
            cancelButton: "btn btn-secondary text-white", // 自定義取消按鈕
        },
    }).then((result) => {
        if (result.isConfirmed) {
            updateOrder(); // 執行更新操作
        }
    });
};

// 更新訂單的邏輯
const updateOrder = async () => {
    try {
        // 整理數據，避免空值
        prepareOrderData();

        // 發送更新請求
        await axios.put(
            `/api/Order/update/${orderDetail.value.orderId}`,
            orderDetail.value, // 傳遞整理後的訂單數據
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        // 更新成功的提示
        Swal.fire({
            icon: "success",
            title: "修改成功！",
            text: "訂單已成功更新！",
            confirmButtonText: "確認",
            allowOutsideClick: false, // 禁止點擊外部關閉
            customClass: {
                confirmButton: "btn btn-primary text-white",
            },
        }).then(() => {
            // 確認後導回查詢單筆畫面
            window.location.href = `/order/orderdetail?orderId=${orderDetail.value.orderId}`;
        });
    } catch (error) {
        console.error("訂單更新失敗：", error);

        // 更新失敗的提示
        Swal.fire({
            icon: "error",
            title: "修改失敗！",
            text: "請稍後再試！",
            confirmButtonText: "確認",
            customClass: {
                confirmButton: "btn btn-danger text-white",
            },
        });
    }
};

// 整理訂單數據，避免空值
const prepareOrderData = () => {
    // 確保訂單細項的折扣和數量欄位有預設值
    orderDetail.value.orderItemsBeans.forEach((item) => {
        item.discount = item.discount || 0; // 如果折扣為空，設為 0
        item.quantity = item.quantity || 1; // 如果數量為空，設為 1
    });

    // 確保只讀欄位的數據不變
    orderDetail.value.orderId = orderDetail.value.orderId; // 訂單 ID
    orderDetail.value.userId = orderDetail.value.userId; // 使用者 ID
    orderDetail.value.orderDate = orderDetail.value.orderDate; // 建立日期
    orderDetail.value.updatedAt = new Date().toISOString(); // 自動更新更新日期

    // 確保其他欄位有合理預設值
    orderDetail.value.pointsDiscount = orderDetail.value.pointsDiscount || 0; // 點數折扣
    orderDetail.value.discountAmount = orderDetail.value.discountAmount || 0; // 折扣金額
    orderDetail.value.finalAmount = orderDetail.value.finalAmount || 0; // 最終金額
};


// 根據傳遞的 orderId 拉取訂單資料
const fetchOrderDetail = async () => {
    if (!props.orderId) {
        errorMessage.value = "缺少訂單 ID，無法獲取訂單資料。";
        return;
    }
    try {
        errorMessage.value = ""; // 清除之前的錯誤訊息
        const response = await axios.get(`/api/Order/getUpdateOrderById/${props.orderId}`);
        // 按細項編號排序 orderItemsBeans
        response.data.orderItemsBeans.sort((a, b) => a.orderitemId - b.orderitemId);
        orderDetail.value = response.data;

        // 初始化 subtotal
        orderDetail.value.orderItemsBeans.forEach((item) => {
            updateSubtotal(item); // 初始化小計
        });
    } catch (error) {
        console.error("無法取得訂單資料：", error);
        errorMessage.value = "無法取得訂單資料，請稍後再試。";
    }
};

// 計算小計的方法
const updateSubtotal = (item) => {
    const discount = item.discount || 0; // 如果折扣為空，預設為 0
    const unitPrice = item.products.price; // 確保單價來自產品資料
    item.subtotal = item.quantity * unitPrice - discount; // 計算小計

    // 更新總金額與最終金額
    calculateTotalAmount();
};

// 計算總金額
const calculateTotalAmount = () => {
    let total = 0;
    orderDetail.value.orderItemsBeans.forEach(item => {
        total += item.subtotal;
    });
    orderDetail.value.totalAmount = total; // 更新總金額
    calculateFinalAmount(); // 總金額變化後，計算最終金額
};

// 計算最終金額
const calculateFinalAmount = () => {
    const pointsDiscount = orderDetail.value.pointsDiscount || 0;
    const discountAmount = orderDetail.value.discountAmount || 0;
    orderDetail.value.finalAmount = orderDetail.value.totalAmount - pointsDiscount - discountAmount;
};

// 初始化時拉取資料
onMounted(() => {
    fetchOrderDetail();
});

// 監控 orderId 的變化，確保組件重新加載資料
watch(() => props.orderId, (newOrderId) => {
    if (newOrderId) {
        fetchOrderDetail();
    }
});
</script>


<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">訂單修改表單</h2>

        <!-- 錯誤訊息 -->
        <div v-if="errorMessage" class="alert alert-danger text-center">
            {{ errorMessage }}
        </div>

        <!-- 訂單基本資訊 -->
        <div class="mb-4">
            <h4 class="mb-3">訂單基本資訊</h4>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="orderId" class="form-label">訂單ID</label>
                    <input type="text" class="form-control" id="orderId" :value="orderDetail.orderId" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="userId" class="form-label">使用者ID</label>
                    <input type="text" class="form-control" id="userId" :value="orderDetail.userId" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="orderStatus" class="form-label">訂單狀態</label>
                    <select class="form-select" id="orderStatus" v-model="orderDetail.orderStatus">
                        <option value="處理中">處理中</option>
                        <option value="已出貨">已出貨</option>
                        <option value="已取消">已取消</option>
                    </select>
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="paymentMethod" class="form-label">付款方式</label>
                    <input type="text" class="form-control" id="paymentMethod" :value="orderDetail.paymentMethod"
                        disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="totalAmount" class="form-label">總金額</label>
                    <input type="text" class="form-control" id="totalAmount" :value="orderDetail.totalAmount"
                        disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="pointsDiscount" class="form-label">點數折抵</label>
                    <input type="text" class="form-control" id="pointsDiscount" v-model="orderDetail.pointsDiscount" />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="discountAmount" class="form-label">折扣金額</label>
                    <input type="text" class="form-control" id="discountAmount" v-model="orderDetail.discountAmount" />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="finalAmount" class="form-label">最終金額</label>
                    <input type="text" class="form-control" id="finalAmount" :value="orderDetail.finalAmount"
                        disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="orderDate" class="form-label">訂單創建日期</label>
                    <input type="text" class="form-control" id="orderDate"
                        :value="formatDateTime(orderDetail.orderDate)" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="updatedAt" class="form-label">訂單更新日期</label>
                    <input type="text" class="form-control" id="updatedAt"
                        :value="formatDateTime(orderDetail.updatedAt)" disabled />
                </div>
            </div>
        </div>
        <!-- 收件人資訊 -->
        <div class="mb-4">
            <h4 class="mb-3">收件人資訊</h4>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="receiveName" class="form-label">收件人</label>
                    <input type="text" class="form-control" id="receiveName" v-model="orderDetail.receiveName" />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" v-model="orderDetail.email" />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="phoneNumber" class="form-label">電話號碼</label>
                    <input type="text" class="form-control" id="phoneNumber" v-model="orderDetail.phoneNumber" />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="address" class="form-label">收貨地址</label>
                    <input type="text" class="form-control" id="address" v-model="orderDetail.address" />
                </div>
            </div>
        </div>
        <!-- 商品明細 -->
        <div class="mb-4">
            <h4 class="mb-3">訂單明細</h4>
            <table class="table table-hover table-bordered">
                <thead class="table-light text-center">
                    <tr>
                        <th class="column-width">細項編號</th>
                        <th class="column-width">產品名稱</th>
                        <th class="column-width">數量</th>
                        <th class="column-width">單價</th>
                        <th class="column-width">折扣</th>
                        <th class="column-width">小計</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in orderDetail.orderItemsBeans" :key="item.orderitemId"
                        class="text-center align-middle">
                        <!-- 細項編號 -->
                        <td>{{ item.orderitemId }}</td>
                        <input type="hidden" :name="'order_item_id_' + item.orderitemId" :value="item.orderitemId" />
                        <!-- 產品名稱 -->
                        <td>{{ item.products.name }}</td>
                        <input type="hidden" :name="'product_id_' + item.orderitemId"
                            :value="item.products.productId" />
                        <!-- 數量 -->
                        <td>
                            <input type="number" class="form-control" v-model.number="item.quantity"
                                @input="updateSubtotal(item)" />
                        </td>
                        <!-- 單價 -->
                        <td>{{ item.products.price }}</td> <!-- 使用 products.price 來顯示單價 -->
                        <input type="hidden" :name="'unit_price_' + item.orderitemId" :value="item.products.price" />
                        <!-- 折扣 -->
                        <td>
                            <input type="number" class="form-control" v-model.number="item.discount"
                                @input="updateSubtotal(item)" @blur="item.discount = item.discount || 0" />
                            <!-- @blur="item.discount = item.discount || 0" =>當欄位為空時自動填上 0 -->
                        </td>
                        <!-- 小計 -->
                        <td>{{ item.subtotal.toFixed(2) }}</td> <!-- 顯示小計 -->
                    </tr>
                </tbody>
            </table>
            <!-- 按鈕區 -->
            <div class="d-flex justify-content-between align-items-center mt-5 mb-4 py-3 border-top">
                <!-- 返回按鈕 -->
                <RouterLink :to="{ name: 'orderList' }" class="btn btn-secondary">
                    <i class="bi bi-arrow-left"></i> 返回
                </RouterLink>
                <div>
                    <!-- 編輯按鈕 -->
                    <button class="btn btn-warning" @click="showUpdateAlert">
                        <i class="bi bi-pencil-square"></i> 編輯確認
                    </button>
                    <!-- 刪除按鈕 -->
                    <!-- <button class="btn btn-danger" @click="showDeleteAlert">
                    <i class="bi bi-trash"></i> 刪除
                </button> -->
                </div>
            </div>
        </div>

    </div>
</template>


<style lang="css" scoped>
.column-width {
    width: 12%;
    /* 或者根據需求設定適合的百分比 */
    text-align: center;
}

input[type="number"] {
    text-align: center;
    /* 數字置中 */
}

/* 控制按鈕容器與內容之間的間距 */
.d-flex {
    padding-top: 15px;
    padding-bottom: 15px;
    margin-top: 30px;
    margin-bottom: 20px;
}

/* 讓邊界更清晰 */
.border-top {
    border-top: 1px solid #ddd;
    /* 添加一條淡灰色的頂部邊框 */
}
</style>