<script setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import Swal from "sweetalert2";

// ===== 訂單資料 =====
const headers = [
    { title: "OrderID", key: "orderId" },
    { title: "訂單狀態", key: "orderStatus" },
    { title: "付款方式", key: "paymentMethod" },
    { title: "總金額", key: "totalAmount" },
    { title: "最終金額", key: "finalAmount" },
    { title: "訂單日期", key: "orderDate" },
    { title: "更新日期", key: "updatedAt" },
    { title: "操作", key: "actions" },
];

// ===== 定義狀態 =====
const orders = ref([]); // 訂單列表
const currentPage = ref(1); // 當前頁碼
const itemsPerPage = ref(10); // 每頁顯示的數量
const totalItems = ref(0); // 總筆數

const orderStatus = ref('');
const fileFormat = ref('');
const filePath = ref('');

const isLoading = ref(false); // 防止多次請求的狀態_定義請求狀態，初始為 `false`

// ===== 格式化工具 =====
const formatNumberToInteger = (val) => {
    if (!val) return 0;
    const num = Number(val.toString().replace(/,/g, "")); // 支援 "1,200" 或 "1200.0"
    return Math.round(num).toLocaleString("zh-TW");       // 回傳千分位格式
};

// ===== 加載訂單列表 =====
const fetchOrders = async () => {
    try {
        const { data } = await axios.get("/api/order"); // 後端查全部訂單 API
        orders.value = data.data.map(order => ({
            ...order,
            isSelected: false
        }));
    } catch (error) {
        console.error("取得訂單失敗", error);
    }
};

// ===== 條件查詢用 =====
const filters = ref({
    orderId: "",
    userId: "",
    startDate: "",
    endDate: "",
    paymentMethod: "",
    orderStatuses: [] // checkbox 多選: 勾選的狀態會是一個陣列
});

// ===== 狀態選項 =====
const orderStatusOptions = [
    "未付款",
    "已付款",
    "處理中",
    "已出貨",
    "已完成",
    "已取消",
    "作廢"
];

// ===== 查詢條件訂單 =====
const searchOrders = async () => {
    try {
        const params = { ...filters.value };
        // 將陣列轉成逗號分隔字串
        if (Array.isArray(params.orderStatuses) && params.orderStatuses.length > 0) {
            params.orderStatuses = params.orderStatuses.join(",");
        }

        // 移除空值
        Object.keys(params).forEach(key => {
            if (params[key] === "" || params[key] == null) delete params[key];
        });

        console.log(params); // 🔹 可以先檢查傳給後端的參數

        const { data } = await axios.get("/api/order/search", { params });
        orders.value = data;
    } catch (error) {
        console.error("條件查詢失敗", error);
        showErrorModal();
    }
};

// ===== 清空搜尋條件 =====
const resetFilters = () => {
    filters.value = {
        orderId: "",
        userId: "",
        startDate: "",
        endDate: "",
        paymentMethod: "",
        orderStatuses: []
    };
    fetchOrders(); // 重新載入全部訂單
};

// 顯示查詢失敗提示
const showErrorModal = (message) => {
    Swal.fire({
        icon: "error",
        title: "條件查詢失敗，請稍後再試！",
        text: message,
        confirmButtonColor: "#6c757d",
        confirmButtonText: "確認",
        customClass: {
            confirmButton: "btn btn-danger text-white",
        },
    });
};

// ===== 匯出訂單 =====
const exportOrders = async () => {
    if (orders.value.length === 0) return showNoDataModal();
    if (!fileFormat.value) return showNoFormatModal();

    try {
        const params = { ...filters.value, format: fileFormat.value };
        if (Array.isArray(params.orderStatuses) && params.orderStatuses.length > 0) {
            params.orderStatuses = params.orderStatuses.join(",");
        }
        Object.keys(params).forEach(key => {
            if (params[key] === "" || params[key] == null) delete params[key];
        });

        const { data } = await axios.get("/api/order/export", {
            params,
            responseType: "blob"
        });

        const mimeTypes = {
            csv: 'text/csv;charset=utf-8',
            json: 'application/json;charset=utf-8',
            xml: 'application/xml;charset=utf-8'
        };

        const blob = new Blob([data], { type: mimeTypes[fileFormat.value] || 'application/octet-stream' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `orders_${Date.now()}.${fileFormat.value}`;
        link.click();
        URL.revokeObjectURL(link.href);

        showSuccessModal();
    } catch (error) {
        console.error("匯出失敗", error);
        showExportErrorModal(error.message);
    }
};

// 提示：沒有資料可匯出
const showNoDataModal = () => {
    Swal.fire({
        icon: "warning",
        title: "沒有資料可匯出",
        text: "目前沒有符合條件的訂單，無法匯出。",
        confirmButtonColor: "#6c757d",
        confirmButtonText: "確認",
        customClass: {
            confirmButton: "btn btn-secondary text-white",
        },
    });
};

// 提示：未選擇檔案格式
const showNoFormatModal = () => {
    Swal.fire({
        icon: "warning",
        title: "未選擇檔案格式",
        text: "請選擇匯出格式後再操作！",
        confirmButtonColor: "#6c757d",
        confirmButtonText: "確認",
        customClass: {
            confirmButton: "btn btn-secondary text-white",
        },
    });
};

// 提示：匯出成功
const showSuccessModal = () => {
    Swal.fire({
        icon: "success",
        title: "匯出成功!",
        text: "訂單已成功匯出。",
        confirmButtonColor: "#6a0dad",
        confirmButtonText: "確認",
        customClass: {
            confirmButton: "btn text-white",
        },
    });
};

// 提示：匯出失敗
const showExportErrorModal = (message) => {
    Swal.fire({
        icon: "error",
        title: "匯出失敗",
        text: message || "請稍後再試！",
        confirmButtonColor: "#6c757d",
        confirmButtonText: "確認",
        customClass: {
            confirmButton: "btn btn-danger text-white",
        },
    });
};

// ===== 初始化加載資料 =====
onMounted(() => {
    fetchOrders();
});
</script>

<template>
    <div>
        <h2 class="text-center mt-4">匯出訂單</h2>
        <div class="text-center my-4">
            <v-card class="pa-4 my-4" outlined>
                <h4>🔎請依照條件搜尋</h4>
                <div class="d-flex flex-wrap gap-2 justify-content-center">
                    <input type="number" placeholder="訂單ID" v-model="filters.orderId" class="form-control"
                        style="width: 120px;" />
                    <input type="number" placeholder="使用者ID" v-model="filters.userId" class="form-control"
                        style="width: 120px;" />

                    <!-- ✅ 日期加上 label -->
                    <!-- 起始日期 -->
                    <div class="d-flex align-items-center">
                        <label class="form-label me-1 mb-0">起始日期:</label>
                        <input type="date" v-model="filters.startDate" class="form-control form-control-sm"
                            style="width: 160px;" />
                    </div>
                    <!-- 結束日期 -->
                    <div class="d-flex align-items-center">
                        <label class="form-label me-1 mb-0">結束日期:</label>
                        <input type="date" v-model="filters.endDate" class="form-control form-control-sm"
                            style="width: 160px;" />
                    </div>

                    <select v-model="filters.paymentMethod" class="form-control" style="width: 120px;">
                        <option value="">付款方式不限</option>
                        <option value="信用卡">信用卡</option>
                        <option value="貨到付款">貨到付款</option>
                    </select>

                    <!-- ✅ 改成 checkbox 多選 -->
                    <div class="d-flex flex-wrap gap-2 align-items-center">
                        <span class="fw-bold">訂單狀態：</span>
                        <div v-for="status in orderStatusOptions" :key="status" class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" :value="status"
                                v-model="filters.orderStatuses" />
                            <label class="form-check-label">{{ status }}</label>
                        </div>
                    </div>
                    <!-- ✅ 查詢 / 清空按鈕移到下一行 -->
                    <div class="w-100 text-center mt-3">
                        <v-btn color="primary" class="me-2" @click="searchOrders"><i class="bi bi-search"></i>
                            查詢</v-btn>
                        <v-btn color="secondary" @click="resetFilters"><i class="bi bi-x-lg"></i> 清空條件</v-btn>
                    </div>
                </div>
            </v-card>
        </div>
        <div class="text-center my-4">
            <v-card class="pa-4 my-4" outlined>
                <h4 class="text-center mb-4">📂 匯出訂單</h4>
                <v-row class="justify-center">
                    <v-col cols="12" md="3">
                        <v-select label="匯出格式(CSV、JSON、XML)" v-model="fileFormat" :items="['', 'CSV', 'JSON', 'XML']"
                            outlined />
                    </v-col>
                    <v-col cols="12" md="2" class="d-flex align-center">
                        <v-btn @click="exportOrders" color="primary" class="w-100">
                            <i class="bi bi-download"></i> 匯出
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card>
        </div>
        <v-container>
            <!-- 訂單表格 -->
            <v-data-table v-if="orders.length > 0" :items="orders" :headers="headers" :items-per-page="itemsPerPage"
                :page.sync="currentPage" :total-items="totalItems" class="mt-4" density="compact">
                <template #item.totalAmount="{ item }">
                    {{ formatNumberToInteger(item.totalAmount) }}
                </template>
                <template #item.finalAmount="{ item }">
                    {{ formatNumberToInteger(item.finalAmount) }}
                </template>
                <template #item.actions="{ item }">
                    <RouterLink :to="{ name: 'exportDetail', params: { orderId: item.orderId } }"
                        class="btn btn-primary btn-sm me-1">
                        <i class="bi bi-eye">查看單筆</i>
                    </RouterLink>
                </template>
            </v-data-table>
            <!-- 當沒有資料時顯示提示 -->
            <v-alert v-else type="info" class="mt-4">
                沒有資料
            </v-alert>
        </v-container>
    </div>
</template>

<style scoped></style>
