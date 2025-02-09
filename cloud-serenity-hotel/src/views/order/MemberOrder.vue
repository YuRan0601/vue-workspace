<script setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/authStore"; // 引入 Pinia 的 authStore

// ===== 使用 authStore =====
const authStore = useAuthStore(); // 取得 authStore 的實例

// ===== 定義狀態 =====
const orders = ref([]); // 訂單列表
const orderStatus = ref(''); // 訂單狀態
const currentPage = ref(1); // 當前頁碼
const itemsPerPage = ref(10); // 每頁顯示的數量
const totalItems = ref(0); // 總筆數

// ===== 格式化工具 =====
const formatNumberToInteger = (number) => Math.round(number);

// 表頭資料
const headers = [
    { title: "訂單編號", key: "orderId" },
    { title: "商品資訊", key: "productName" },
    { title: "最終總金額", key: "finalAmount" },
    { title: "訂單狀態", key: "orderStatus" },
    { title: "更新時間", key: "updatedAt" },
    { title: "操作", key: "actions" },
];

// 從後端載入訂單資料
async function loadOrders() {
    try {
        const userId = authStore.user?.userId; // 從 authStore 取得動態 userId
        if (!userId) throw new Error("未登入，無法獲取用戶資料");

        // 根據選擇的訂單狀態來決定 API 呼叫
        let url = '/api/Order/user/' + userId; // 預設為查詢所有訂單
        if (orderStatus.value) {
            // 若有選擇訂單狀態，才會加上狀態作為查詢條件
            url += `/status/${orderStatus.value}`;
        }

        const response = await axios.get(url);
        console.log("後端返回資料：", response.data); // 確認回傳資料結構
        orders.value = response.data.map(order => ({
            ...order,
            orderItemsDtos: Array.isArray(order.orderItemsDtos) ? order.orderItemsDtos : [],
        }));
    } catch (error) {
        console.error("無法載入訂單資料：", error);
    }
}


// 檢視訂單詳情
function viewOrder(orderId) {
    console.log("檢視訂單詳情：", orderId);
}

// 監聽訂單狀態變動，當狀態改變時重新載入訂單
watch(orderStatus, () => {
    loadOrders();
});

// 掛載時載入訂單資料
onMounted(() => {
    loadOrders();
});
</script>

<template>
    <div>
        <h2>訂單資料</h2>
        <v-container>
            <!-- 查詢訂單狀態 -->
            <v-row>
                <v-col cols="12" md="4">
                    <v-select label="訂單狀態(未選預設全部)" v-model="orderStatus"
                        :items="['', '未付款', '已付款', '處理中', '已出貨', '已完成', '已取消']" outlined
                        @change="loadOrders"></v-select>
                </v-col>
            </v-row>
            <v-data-table :items="orders" :headers="headers" item-value="orderId" class="orderTable" show-expand>

                <!-- 商品名稱 -->
                <template #item.productName="{ item }">
                    <span>
                        <template v-if="item.orderItemsDtos.length === 0">無商品</template>
                        <template v-else-if="item.orderItemsDtos.length === 1">
                            {{ item.orderItemsDtos[0].productName }}
                        </template>
                        <template v-else>多項商品</template>
                    </span>
                </template>

                <!-- 總金額 -->
                <template #item.finalAmount="{ item }">
                    ${{ formatNumberToInteger(item.finalAmount) }}
                </template>

                <!-- 展開的行 -->
                <template v-slot:expanded-row="{ item }">
                    <tr>
                        <th colspan="5">商品明細</th>
                    </tr>
                    <tr v-for="product in item.orderItemsDtos" :key="product.productName">
                        <td colspan="5">
                            {{ product.productName }} - {{ product.quantity }} 件
                        </td>
                    </tr>
                </template>

                <!-- 操作按鈕 -->
                <template #item.actions="{ item }">
                    <RouterLink :to="{ name: 'memberOrderDetail', params: { orderId: item.orderId } }"
                        class="btn btn-primary btn-sm">
                        <i class="bi bi-eye"></i> 查看詳情
                    </RouterLink>
                </template>
            </v-data-table>
        </v-container>
    </div>
</template>

<style lang="css" scoped></style>
