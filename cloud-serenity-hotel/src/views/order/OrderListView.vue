<script setup>
import axios from "axios";
import { ref, onMounted, watchEffect } from "vue";
import { Modal } from "bootstrap"; // 顯式導入 Modal

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

const orders = ref([]); // 訂單列表
const search = ref(""); // 查詢輸入
const currentPage = ref(1); // 當前頁碼
const itemsPerPage = ref(10); // 每頁顯示的數量
const totalItems = ref(0); // 總筆數
const totalPages = ref(1); // 總頁數

const selectedOrder = ref(null); // 被選中的訂單，用於模態框顯示

// 格式化整數
const formatNumberToInteger = (number) => {
    return Math.round(number); // 四捨五入為整數
};

// 格式化時間
const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

// 加載訂單列表
async function loadTable() {
    try {
        const params = {
            page: currentPage.value - 1,
            size: itemsPerPage.value,
            search: search.value,
        };
        const { data } = await axios.get("/api/Order/paged", { params });
        orders.value = data.content || [];
        totalItems.value = data.totalElements || 0;
        totalPages.value = data.totalPages || 1;
    } catch (error) {
        console.error("無法載入訂單資料：", error);
    }
}

// 查詢單筆訂單
async function validateOrderId(orderId) {
    if (!orderId) return;
    try {
        const { data } = await axios.get(`/api/Order/findOrderDetails/${orderId}`);
        if (data && data.orderId) {
            window.location.href = `/order/orderdetail?orderId=${orderId}`;
        } else {
            showErrorModal("查無此訂單", "請確認訂單編號是否正確！");
        }
    } catch {
        showErrorModal("查無此訂單", "請確認訂單編號是否正確！");
    }
}

// 確認刪除訂單
async function confirmDeleteOrder() {
    if (!selectedOrder.value) return;
    try {
        await axios.delete(`/api/Order/delete/${selectedOrder.value.orderId}`);
        await loadTable(); // 刪除成功後重新加載資料
        selectedOrder.value = null; // 清空選中的訂單
        const modal = document.getElementById("deleteModal");
        const bsModal = bootstrap.Modal.getInstance(modal);
        bsModal.hide(); // 關閉模態框
    } catch (error) {
        console.error("刪除失敗：", error);
        alert("刪除失敗，請稍後再試");
    }
}

// 初始化加載資料
onMounted(loadTable);

// 監控分頁與查詢條件
watchEffect(() => {
    loadTable();
});
</script>

<template>
    <div>
        <h2 class="text-center mt-4">訂單總表</h2>

        <!-- 查詢區域 -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <input type="text" class="form-control w-50" placeholder="請輸入訂單編號" v-model="search" />
            <button class="btn btn-primary ms-3" @click="loadTable">
                查詢
            </button>
            <RouterLink :to="{ name: 'orderadd' }" class="btn btn-success">
                新增訂單
            </RouterLink>
        </div>

        <!-- 訂單表格 -->
        <v-data-table :items="orders" :headers="headers" item-value="orderId" :search="search" class="elevation-1">
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
                <button class="btn btn-danger btn-sm" @click="deleteOrder(item)">
                    <i class="bi bi-trash"></i>
                </button>
            </template>
        </v-data-table>

        <!-- 模態框：刪除確認 -->
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="deleteModalLabel">刪除確認</h1>
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
.text-center {
    margin-top: 20px;
}
</style>
