<script setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
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

// 訂單資料
const headers = [
    { title: "OrderID", key: "orderId" },
    { title: "訂單狀態", key: "orderStatus" },
    { title: "付款方式", key: "paymentMethod" },
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
// 先取得全部訂單
const fetchOrders = async () => {
    try {
        const { data } = await axios.get("/api/order"); // 後端查全部訂單 API
        orders.value = data.data.map(order => ({
            ...order,
            isSelected: false
        }));
        calculateTotal();
    } catch (error) {
        console.error("取得訂單失敗", error);
    }
};

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
            // 單筆結果也進行排序（其實只有一筆數據）
            orders.value = [data.data].sort((a, b) => a.orderId - b.orderId);
            console.log("訂單資料：", orders.value); // 確認資料是否正確
            console.log("API 返回數據：", data.content);
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

// ===== 假刪除 / 作廢訂單 =====
const voidOrder = async (order) => {
    Swal.fire({
        title: "確定要作廢這筆訂單嗎？",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "作廢",
        cancelButtonText: "取消",
        customClass: {
            confirmButton: 'btn btn-danger text-white me-2',
            cancelButton: 'btn btn-secondary text-white'
        },
        buttonsStyling: false
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.put(`/api/Order/${order.orderId}/void`);
                Swal.fire("已作廢!", "", "success");
                loadTable(); // 更新訂單列表
            } catch (error) {
                console.error("作廢訂單失敗", error);
                Swal.fire("操作失敗", "請稍後再試", "error");
            }
        }
    });
};

// ===== 防抖函數（用於搜尋輸入） =====
function debounce(func, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

// ===== 防抖的單筆查詢 =====
const debouncedValidateOrderId = debounce(validateOrderId, 100);

// ===== 初始化加載資料 =====
onMounted(() => {
    fetchOrders();
});

// ===== 監控分頁與每頁項目變化 =====
watch([currentPage, itemsPerPage], () => {
    loadTable();
});
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
            <!-- 新增按鈕(後台不應該新增&刪除) -->
            <!-- <RouterLink :to="{ name: 'orderadd' }" class="button-48 ms-2" role="button">
                <span class="text">新增訂單</span>
            </RouterLink> -->
        </div>

        <!-- 訂單表格 -->
        <v-data-table :items="orders" :headers="headers" :items-per-page="itemsPerPage" :page.sync="currentPage"
            :total-items="totalItems" class="mt-4" density="compact">
            <template #item.discountAmount="{ item }">
                {{ formatNumberToInteger(item.discountAmount) }}
            </template>
            <template #item.finalAmount="{ item }">
                {{ formatNumberToInteger(item.finalAmount) }}
            </template>
            <!-- actions 欄位自訂按鈕 -->
            <template #item.actions="{ item }">
                <v-btn color="primary" class="btn-tiny me-1">
                    <i class="bi bi-eye"></i> 查看
                </v-btn>
                <v-btn color="info" class="btn-tiny me-1">
                    <i class="bi bi-pencil-square"></i> 修改
                </v-btn>
                <!-- 假刪除-> 作廢 -->
                <v-btn color="error" class="btn-tiny">
                    <i class="bi bi-trash"></i> 作廢
                </v-btn>
            </template>
        </v-data-table>
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

.btn-tiny {
    font-size: 0.75rem;
    /* 比之前大一些 */
    min-width: 32px;
    /* 按鈕寬度放大 */
    height: 28px;
    /* 按鈕高度放大 */
    padding: 0 4px;
    /* 文字左右留一點空間 */
}

.v-data-table .v-data-table__wrapper tr {
    height: 30px;
    /* 調整 row 高度 */
}
</style>
