<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap"; // 顯式導入 Bootstrap 的 Modal 功能

// ===== Axios 攔截器：針對 404 錯誤攔截並靜默處理 =====
axios.interceptors.response.use(
    (response) => response, // 正常回應直接返回
    (error) => {
        if (error.response && error.response.status === 404) {
            console.warn(`404 錯誤攔截：${error.response.config.url}`);
            return Promise.resolve(error.response); // 返回普通回應，避免拋出錯誤
        }
        return Promise.reject(error); // 其他錯誤繼續拋出
    }
);

// 分頁相關狀態
const headers = [
    { title: "OrderID", key: "orderId" },
    { title: "訂單狀態", key: "orderStatus" },
    { title: "付款方式", key: "paymentMethod" },
    { title: "折扣金額", key: "discountAmount" },
    { title: "最終金額", key: "finalAmount" },
    { title: "訂單日期", key: "orderDate" },
    { title: "更新日期", key: "updatedAt" },
    { title: "操作", key: "actions" },
];

// ===== 定義狀態 =====
const orders = ref([]); // 訂單列表
const search = ref(""); // 搜尋輸入
const currentPage = ref(1); // 當前頁碼
const itemsPerPage = ref(10); // 每頁顯示的數量
const totalItems = ref(0); // 總筆數
const totalPages = ref(1); // 總頁數

const selectedOrder = ref(null); // 用於模態框顯示的訂單
let deleteModalInstance = null; // 刪除模態框實例
// let errorModalInstance = null; // 錯誤模態框實例
const isLoading = ref(false); // 防止多次請求的狀態_定義請求狀態，初始為 `false`
const errorModalMessage = ref(""); // 錯誤訊息內容

// ===== 格式化工具 =====
const formatNumberToInteger = (number) => Math.round(number);

// ===== 錯誤模態框 =====
function showErrorModal(message) {
    errorModalMessage.value = message;
    const modalElement = document.getElementById("errorModal");
    const modalInstance = Modal.getOrCreateInstance(modalElement);

    // 確保模態框顯示前，移除 aria-hidden
    modalElement.setAttribute("aria-hidden", "false");
    modalInstance.show();

    modalElement.addEventListener("hidden.bs.modal", () => {
        // 模態框隱藏後恢復 aria-hidden
        modalElement.setAttribute("aria-hidden", "true");
    });
}


// ===== 驗證是否為有效數字 =====
function isValidNumber(input) {
    return /^\d+$/.test(input);
}

// ===== 加載訂單列表（分頁） =====
async function loadTable() {
    if (isLoading.value) return; // 防止重複請求
    isLoading.value = true;

    try {
        const params = {
            page: currentPage.value - 1,
            size: itemsPerPage.value,
        };

        const { data, status } = await axios.get("/api/Order/paged", {
            params,
            validateStatus: (status) => status >= 200 && status < 300,
        });

        if (status === 200) {
            // 排序資料（OrderID 從小到大）
            orders.value = (data.content || []).sort((a, b) => a.orderId - b.orderId);
            totalItems.value = data.totalElements || 0;
            totalPages.value = data.totalPages || 1;
        }
    } catch (error) {
        console.error("分頁查詢失敗：", error);
        showErrorModal("查詢失敗，請稍後再試！");
    } finally {
        isLoading.value = false;
    }
}

// ===== 查詢單筆訂單 =====
async function validateOrderId() {
    const trimmedSearch = search.value.trim();

    if (!trimmedSearch) {
        loadTable();
        return;
    }

    if (!isValidNumber(trimmedSearch)) {
        showErrorModal("請輸入有效的數字作為訂單編號！");
        orders.value = [];
        totalItems.value = 0;
        totalPages.value = 1;
        return;
    }

    try {
        const { data, status } = await axios.get(`/api/Order/findOrderDetails/${trimmedSearch}`, {
            validateStatus: (status) => status === 200 || status === 404,
        });

        if (status === 200 && data.success) {
            orders.value = [data.data];
            totalItems.value = 1;
            totalPages.value = 1;
        } else if (status === 404) {
            // 特殊處理 404，避免報錯
            console.warn(`查無訂單 ID: ${trimmedSearch}，這是預期結果。`);
            showErrorModal(data.message || `查無訂單編號 ${trimmedSearch}，請確認後再試！`);
            orders.value = [];
            totalItems.value = 0;
            totalPages.value = 1;
        }
    } catch (error) {
        console.error("單筆查詢失敗：", error);
        showErrorModal("查詢失敗，請稍後再試！");
    }
}


// ===== 開啟刪除模態框 =====
function openDeleteModal(order) {
    selectedOrder.value = order; // 設定選中的訂單
    const modalElement = document.getElementById("deleteModal");
    deleteModalInstance = Modal.getOrCreateInstance(modalElement);
    deleteModalInstance.show(); // 顯示模態框
}

// ===== 確認刪除訂單 =====
async function confirmDeleteOrder() {
    if (!selectedOrder.value) return;
    try {
        // 發送刪除請求到後端
        await axios.delete(`/api/Order/delete/${selectedOrder.value.orderId}`);
        await loadTable(); // 刪除成功後重新加載列表
        selectedOrder.value = null; // 清空選中的訂單
        deleteModalInstance.hide(); // 關閉模態框
    } catch (error) {
        console.error("刪除失敗：", error);
        showErrorModal("刪除失敗，請稍後再試！");
    }
}

// ===== 防抖函數（用於搜尋輸入） =====
function debounce(func, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

// ===== 防抖的單筆查詢 =====
const debouncedValidateOrderId = debounce(validateOrderId, 200);

// ===== 初始化加載資料 =====
onMounted(loadTable);

// 監控分頁與查詢條件
/*watchEffect(() => {
    loadTable();
});*/
</script>

<template>
    <div>
        <h2 class="text-center mt-4">訂單總表</h2>

        <!-- 搜尋框 -->
        <div class="text-center my-4">
            <div class="d-inline-flex align-items-center">
                <input type="text" class="form-control search-input" placeholder="請輸入欲查詢的訂單編號" v-model="search"
                    @input="debouncedValidateOrderId" />
            </div>
        </div>
        <div>
            <!-- 新增按鈕 -->
            <RouterLink :to="{ name: 'orderadd' }" class="button-48 ms-2" role="button">
                <span class="text">新增訂單</span>
            </RouterLink>
        </div>

        <!-- 訂單表格 -->
        <v-data-table :items="orders" :headers="headers" item-value="orderId" class="mt-4">
            <template #item.discountAmount="{ item }">
                {{ formatNumberToInteger(item.discountAmount) }}
            </template>
            <template #item.finalAmount="{ item }">
                {{ formatNumberToInteger(item.finalAmount) }}
            </template>
            <template #item.actions="{ item }">
                <RouterLink :to="{ name: 'orderdetail', query: { orderId: item.orderId } }"
                    class="btn btn-primary btn-sm me-1">
                    <i class="bi bi-eye"></i>
                </RouterLink>
                <RouterLink :to="{ name: 'orderedit', query: { orderId: item.orderId } }"
                    class="btn btn-warning btn-sm me-1">
                    <i class="bi bi-pencil-square"></i>
                </RouterLink>
                <button class="btn btn-danger btn-sm" @click="openDeleteModal(item)">
                    <i class="bi bi-trash"></i>
                </button>
            </template>
        </v-data-table>

        <!-- 模態框：刪除確認 -->
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="false">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="deleteModalLabel">訂單刪除</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        確定要刪除 OrderID 為 <strong>{{ selectedOrder?.orderId }}</strong> 的訂單嗎？
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            取消
                        </button>
                        <button type="button" class="btn btn-danger" @click="confirmDeleteOrder">
                            確認刪除
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 錯誤模態框 -->
        <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="false">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="errorModalLabel">錯誤訊息</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">{{ errorModalMessage }}</div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 分頁控制 -->
        <!-- <div class="d-flex justify-content-between align-items-center mt-3">
            <div>
                每頁顯示：
                <select v-model="itemsPerPage" class="form-select d-inline w-auto">
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                </select>
            </div>
            <div>
                {{ totalItems }} 條中第 {{ (currentPage - 1) * itemsPerPage + 1 }} ~
                {{ Math.min(currentPage * itemsPerPage, totalItems) }} 條
            </div>
            <nav>
                <ul class="pagination mb-0">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <button class="page-link" @click="currentPage = Math.max(1, currentPage - 1)">
                            上一頁
                        </button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <button class="page-link" @click="currentPage = Math.min(totalPages, currentPage + 1)">
                            下一頁
                        </button>
                    </li>
                </ul>
            </nav>
        </div> -->
    </div>
</template>

<style scoped>
/* 搜尋框樣式 */
.search-input {
    width: 300px;
}

/* 搜尋框容器置中 */
.text-center .d-inline-flex {
    justify-content: center;
    align-items: center;
}

/* 新增按鈕_CSS */
.button-48 {
    appearance: none;
    background-color: #FFFFFF;
    border-width: 0;
    box-sizing: border-box;
    color: #000000;
    cursor: pointer;
    display: inline-block;
    font-family: Clarkson, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 1em;
    margin: 0;
    opacity: 1;
    outline: 0;
    padding: 1.5em 2.2em;
    position: relative;
    text-align: center;
    text-decoration: none;
    text-rendering: geometricprecision;
    text-transform: uppercase;
    transition: opacity 300ms cubic-bezier(.694, 0, 0.335, 1), background-color 100ms cubic-bezier(.694, 0, 0.335, 1), color 100ms cubic-bezier(.694, 0, 0.335, 1);
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: baseline;
    white-space: nowrap;
}

.button-48:before {
    animation: opacityFallbackOut .5s step-end forwards;
    backface-visibility: hidden;
    background-color: #EBEBEB;
    clip-path: polygon(-1% 0, 0 0, -25% 100%, -1% 100%);
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transform: translateZ(0);
    transition: clip-path .5s cubic-bezier(.165, 0.84, 0.44, 1), -webkit-clip-path .5s cubic-bezier(.165, 0.84, 0.44, 1);
    width: 100%;
}

.button-48:hover:before {
    animation: opacityFallbackIn 0s step-start forwards;
    clip-path: polygon(0 0, 101% 0, 101% 101%, 0 101%);
}

.button-48:after {
    background-color: #FFFFFF;
}

.button-48 span {
    z-index: 1;
    position: relative;
}
</style>
