<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore"; // 引入 Pinia 的 authStore


//測試

// ===== 使用 authStore =====
const authStore = useAuthStore(); // 取得 authStore 的實例

// ===== 定義狀態 =====
const orders = ref([]); // 訂單列表

// 表頭資料
const headers = [
    { title: "訂單編號", key: "orderId" },
    {
        title: "商品名稱",
        key: "productName",
        formatter: (row) => {
            console.log("商品資料：", row.orderItemsDtos); // 確認資料進入 formatter
            if (!row.orderItemsDtos || !Array.isArray(row.orderItemsDtos)) return "無商品";
            const productNames = row.orderItemsDtos.map((item) => item.productName);
            return productNames.length > 1 ? "多項商品" : productNames[0] || "無商品";
        },
    },
    { title: "總金額", key: "totalAmount", formatter: (row) => `$${row.totalAmount}` },
    { title: "訂單狀態", key: "orderStatus" },
    { title: "操作", key: "actions" },
];

// 從後端載入訂單資料
async function loadOrders() {
    try {
        const userId = authStore.user?.userId; // 從 authStore 取得動態 userId
        if (!userId) throw new Error("未登入，無法獲取用戶資料");
        const response = await axios.get(`/api/Order/user/${userId}`);
        console.log("後端返回資料：", response.data); // 確認回傳資料結構
        orders.value = response.data.map(order => ({
            ...order,
            orderItemsDtos: order.orderItemsDtos || [], // 確保 orderItemsDtos 是陣列
        }));
    } catch (error) {
        console.error("無法載入訂單資料：", error);
    }
}

// 檢視訂單詳情
function viewOrder(orderId) {
    console.log("檢視訂單詳情：", orderId);
}

// 掛載時載入訂單資料
onMounted(() => {
    loadOrders();
});
</script>

<template>
    <div>
        <h2>訂單資料</h2>
        <v-container>
            <v-data-table :items="orders" :headers="headers" item-value="orderId" class="orderTable" show-expand>
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
                    <v-btn color="primary" class="mr-2" @click="viewOrder(item.orderId)">
                        檢視詳情
                    </v-btn>
                </template>
            </v-data-table>
        </v-container>
    </div>
</template>


<style lang="css" scoped></style>