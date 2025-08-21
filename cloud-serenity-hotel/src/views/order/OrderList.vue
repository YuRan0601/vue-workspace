<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import Swal from 'sweetalert2';

// ===== 訂單資料 =====
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
const currentPage = ref(1); // 當前頁碼
const itemsPerPage = ref(10); // 每頁顯示的數量
const totalItems = ref(0); // 總筆數
// const totalPages = ref(1); // 總頁數

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

// 查詢條件訂單
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


// 提示：顯示查詢失敗
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

// 清空搜尋條件
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

// ===== 假刪除 / 作廢訂單 =====
const voidOrder = async (order) => {
    // 先跳出確認視窗
    Swal.fire({
        title: "確定要作廢這筆訂單嗎？",
        text: `訂單編號：${order.orderId}`,
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
            await handleVoidOrder(order);
        }
    });
};

// 呼叫後端 API 作廢訂單
const handleVoidOrder = async (order) => {
    try {
        const { data } = await axios.put(`/api/order/${order.orderId}/void`);
        if (data.success) {
            showVoidSuccessAlert();
            // ===== 前端立即更新 orderStatus =====
            order.orderStatus = data.data.orderStatus;
        } else {
            showVoidErrorAlert(data.message || "請稍後再試");
        }
    } catch (error) {
        console.error("作廢訂單失敗", error);
        showVoidErrorAlert("請稍後再試");
    }
};

// 提示：顯示作廢成功
const showVoidSuccessAlert = () => {
    Swal.fire({
        icon: "success",
        title: "已作廢!",
        text: "",
        confirmButtonColor: "#6a0dad",
        confirmButtonText: "確認",
        allowOutsideClick: false,
        customClass: {
            confirmButton: "btn text-white me-2",
        },
    });
};

// 提示：顯示作廢失敗
const showVoidErrorAlert = (message) => {
    Swal.fire({
        icon: "error",
        title: "作廢失敗",
        text: message,
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
        <h2 class="text-center mt-4">訂單總表</h2>
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
                <RouterLink :to="{ name: 'orderdetail', params: { orderId: item.orderId } }">
                    <v-btn color="primary" class="btn-tiny me-1">
                        <i class="bi bi-eye"></i> 查看
                    </v-btn>
                </RouterLink>
                <!-- 只有當訂單不是作廢時才顯示修改 & 作廢 -->
                <template v-if="item.orderStatus !== '作廢'">
                    <RouterLink :to="{ name: 'orderedit', params: { orderId: item.orderId } }">
                        <v-btn color="amber 500" class="btn-tiny me-1">
                            <i class="bi bi-pencil-square"></i> 修改
                        </v-btn>
                    </RouterLink>
                    <v-btn color="error" class="btn-tiny" @click="voidOrder(item)">
                        <i class="bi bi-trash"></i> 作廢
                    </v-btn>
                </template>
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
