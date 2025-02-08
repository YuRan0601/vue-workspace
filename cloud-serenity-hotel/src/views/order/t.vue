<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

// ===== 訂單資料 =====
const headers = [
    { title: "OrderID", key: "orderId" },
    { title: "訂單狀態", key: "orderStatus" },
    { title: "付款方式", key: "paymentMethod" },
    { title: "折扣金額", key: "discountAmount" },
    { title: "最終金額", key: "finalAmount" },
    { title: "訂單日期", key: "orderDate" },
    { title: "更新日期", key: "updatedAt" },
    //{ title: "操作", key: "actions" },
];

// ===== 定義狀態 =====
const orders = ref([]); // 訂單列表
const currentPage = ref(1); // 當前頁碼
const itemsPerPage = ref(10); // 每頁顯示的數量
const totalItems = ref(0); // 總筆數
//const totalPages = ref(1); // 總頁數

const orderStatus = ref('');
const fileFormat = ref('');
const filePath = ref('');

const isLoading = ref(false); // 防止多次請求的狀態_定義請求狀態，初始為 `false`

// ===== 格式化工具 =====
const formatNumberToInteger = (number) => Math.round(number);

// ===== 匯出訂單資料 =====
const exportOrders = async () => {
    try {
        // 打印出傳送的資料，確認格式
        console.log({
            orderStatus: orderStatus.value,
            format: fileFormat.value,
            filePath: filePath.value
        });

        // 發送 POST 請求，傳送訂單狀態、格式和檔案路徑（如果有提供）
        const response = await axios.post("/api/Order/exportOrders", null, {
            params: {
                orderStatus: orderStatus.value,
                format: fileFormat.value,
                filePath: filePath.value || "" // 若沒提供 filePath，傳空字串
            }
        });

        alert('匯出成功！');
    } catch (error) {
        alert('匯出失敗，請重試！');
        console.error('匯出錯誤:', error);
    }
};

// ===== 加載訂單列表（分頁） =====
async function loadTable() {
    if (isLoading.value) return; // 防止重複請求
    isLoading.value = true;

    try {
        const { data } = await axios.get("/api/Order/findAllOrders");
        orders.value = data.sort((a, b) => a.orderId - b.orderId); // 按 OrderID 排序
        totalItems.value = data.length; // 總筆數
    } catch (error) {
        console.error("查詢失敗：", error);
    } finally {
        isLoading.value = false;
    }
}

// ===== 初始化加載資料 =====
onMounted(() => {
    loadTable();
});
</script>

<template>
    <div>
        <h2 class="text-center mt-4">匯出訂單</h2>

        <v-container>
            <!-- 匯出檔案 -->
            <v-row>
                <v-col cols="12" md="4">
                    <v-select label="訂單狀態" v-model="orderStatus" :items="['未付款', '已付款', '處理中', '已出貨', '已完成', '已取消']"
                        outlined></v-select>
                </v-col>

                <v-col cols="12" md="4">
                    <v-select label="檔案格式" v-model="fileFormat" :items="['csv', 'json']" outlined></v-select>
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field label="檔案路徑" v-model="filePath" outlined></v-text-field>
                </v-col>
            </v-row>
            <v-btn @click="exportOrders" color="primary" class="mt-4">匯出訂單</v-btn>

            <!-- 訂單表格 -->
            <v-data-table :items="orders" :headers="headers" :items-per-page="itemsPerPage" :page.sync="currentPage"
                :total-items="totalItems" class="mt-4" density="compact">
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
        </v-container>
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
