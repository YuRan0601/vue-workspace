<script setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import Swal from "sweetalert2";

// ===== 訂單資料 =====
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
const currentPage = ref(1); // 當前頁碼
const itemsPerPage = ref(10); // 每頁顯示的數量
const totalItems = ref(0); // 總筆數

const orderStatus = ref('');
const fileFormat = ref('');
const filePath = ref('');

const isLoading = ref(false); // 防止多次請求的狀態_定義請求狀態，初始為 `false`

// ===== 格式化工具 =====
const formatNumberToInteger = (number) => Math.round(number);

// ===== 根據狀態查詢訂單 =====
// 根據狀態查詢訂單
async function loadOrders() {
    try {
        isLoading.value = true;
        let url = '';

        // 根據選擇的狀態來決定 API 呼叫
        if (orderStatus.value) {
            // 如果有選擇狀態，傳遞 orderStatus 參數給後端
            url = '/api/Order/findOrdersByStatus';  // 呼叫查詢特定狀態的 API
        } else {
            // 如果沒有選擇狀態，則查詢所有訂單
            url = '/api/Order/findAllOrders';
        }

        const { data } = await axios.get(url, {
            params: {
                orderStatus: orderStatus.value || undefined,  // 若有選擇狀態，則傳遞狀態，否則為空
            }
        });

        if (data.length === 0) {
            // 如果沒有資料，清空 orders
            orders.value = [];
        } else {
            orders.value = data.sort((a, b) => a.orderId - b.orderId); // 按 OrderID 排序
            totalItems.value = data.length; // 計算總筆數
        }
    } catch (error) {
        console.error("查詢失敗：", error);
    } finally {
        isLoading.value = false;
    }
}



// ===== 匯出訂單資料 =====
const exportOrders = async () => {

    // 檢查是否有資料
    if (orders.value.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: '沒有資料可匯出',
            text: '目前沒有符合條件的訂單，無法匯出。',
            confirmButtonText: '確認',
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn btn-secondary text-white me-2"
            },
        });
        return; // 如果沒有資料，停止後續操作
    }

    // 檢查是否有選擇訂單狀態和檔案格式
    if (!fileFormat.value) {
        Swal.fire({
            icon: 'warning',
            title: '未選擇檔案格式',
            text: '請選擇檔案格式後再進行匯出!',
            confirmButtonText: '確認',
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn btn-secondary text-white me-2"
            },
        });
        return; // 如果沒有選擇檔案格式，停止後續操作
    }

    try {
        // 如果 orderStatus 是空的，則不傳遞 orderStatus，表示匯出所有訂單
        const response = await axios.post("/api/Order/exportOrders", null, {
            params: {
                orderStatus: orderStatus.value || undefined, // 如果是空的則會傳遞 undefined
                format: fileFormat.value,
                filePath: filePath.value || "" // 若沒提供 filePath，傳空字串
            }
        });

        // 匯出成功後顯示 SweetAlert
        Swal.fire({
            icon: 'success',
            title: '匯出成功!',
            text: '訂單已成功匯出，若無設定路徑將匯於桌面!',
            confirmButtonColor: "#6a0dad",
            confirmButtonText: '確認',
            customClass: {
                confirmButton: "btn text-white me-2",
            },
        });
    } catch (error) {
        // 匯出失敗時顯示錯誤提示
        Swal.fire({
            icon: 'error',
            title: '匯出失敗!',
            text: '請稍後再試。',
            confirmButtonText: '確認'
        });
        console.error('匯出錯誤:', error);
    }
};

// ===== 監聽訂單狀態變動 =====
watch(orderStatus, () => {
    loadOrders(); // 當 orderStatus 改變時，重新載入訂單
});

// ===== 初始化加載資料 =====
onMounted(() => {
    loadOrders(); // 加載訂單列表
});
</script>

<template>
    <div>
        <h2 class="text-center mt-4">匯出訂單</h2>

        <v-container>
            <!-- 匯出檔案 -->
            <v-row>
                <v-col cols="12" md="4">
                    <v-select label="訂單狀態" v-model="orderStatus" :items="['', '未付款', '已付款', '處理中', '已出貨', '已完成', '已取消']"
                        outlined @change="loadOrders"></v-select>
                </v-col>

                <v-col cols="12" md="4">
                    <v-select label="檔案格式" v-model="fileFormat" :items="['', 'csv', 'json']" outlined></v-select>
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field label="檔案路徑與檔名" v-model="filePath" outlined></v-text-field>
                </v-col>
            </v-row>
            <v-btn @click="exportOrders" color="primary" class="mt-4">匯出訂單</v-btn>

            <!-- 訂單表格 -->
            <v-data-table v-if="orders.length > 0" :items="orders" :headers="headers" :items-per-page="itemsPerPage"
                :page.sync="currentPage" :total-items="totalItems" class="mt-4" density="compact">
                <template #item.discountAmount="{ item }">
                    {{ formatNumberToInteger(item.discountAmount) }}
                </template>
                <template #item.finalAmount="{ item }">
                    {{ formatNumberToInteger(item.finalAmount) }}
                </template>
                <template #item.actions="{ item }">
                    <RouterLink :to="{ name: 'orderdetail', params: { orderId: item.orderId } }"
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
