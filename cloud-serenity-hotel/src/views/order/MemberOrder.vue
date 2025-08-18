<script setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/authStore"; // 引入 Pinia 的 authStore
import { useRouter } from "vue-router";

// ===== 使用 authStore =====
const authStore = useAuthStore(); // 取得 authStore 的實例
const router = useRouter();

// ===== 定義狀態 =====
const orders = ref([]); // 訂單列表
const orderStatus = ref(''); // 訂單狀態

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
        let url = `/api/order/user/${userId}`; // 查詢所有訂單
        if (orderStatus.value) {
            url += `/status/${orderStatus.value}`;
        }

        const response = await axios.get(url);
        console.log("後端返回資料：", response.data);

        // 取 data 層，並確保 orderItemsDtos 是陣列
        orders.value = response.data.data.map(order => ({
            ...order,
            orderItemsDtos: Array.isArray(order.orderItemsDtos) ? order.orderItemsDtos : [],
        }));
    } catch (error) {
        console.error("無法載入訂單資料：", error);
    }
}

function payOrder(orderId) {
    // 呼叫後端 retry API 生成付款表單
    axios.post(`/api/order/payment/retry`, { orderId: orderId })
        .then(response => {
            const paymentForm = response.data.data;
            // 將表單直接插入 DOM 並提交，跳轉到綠界
            const formContainer = document.createElement("div");
            formContainer.innerHTML = paymentForm;
            document.body.appendChild(formContainer);
            formContainer.querySelector("form").submit();
        })
        .catch(err => {
            console.error("取得付款表單失敗", err);
            alert("付款跳轉失敗，請稍後再試");
        });
}

// 檢視訂單詳情
function viewOrder(orderId) {
    router.push({ name: 'memberOrderDetail', params: { orderId } });
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
                        :items="['', '未付款', '已付款', '處理中', '已出貨', '已完成', '已取消']" outlined></v-select>
                </v-col>
            </v-row>

            <v-data-table :items="orders" :headers="headers" item-value="orderId" class="orderTable" show-expand>

                <!-- 商品名稱 -->
                <template #item.productName="{ item }">
                    <span class="text-ellipsis" :title="item.orderItemsDtos[0].productName">
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
                <template #expanded-row="{ item }">
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
                    <button class="btn btn-primary btn-sm m-3" @click="viewOrder(item.orderId)">
                        <i class="bi bi-eye"></i> 詳情
                    </button>
                    <!-- 只在信用卡 & 未付款顯示付款按鈕 -->
                    <button v-if="item.paymentMethod === '信用卡' && item.orderStatus === '未付款'"
                        class="btn btn-warning btn-sm" @click="payOrder(item.orderId)">
                        <i class="bi bi-credit-card-2-back"></i> 付款
                    </button>
                </template>

            </v-data-table>
        </v-container>
    </div>
</template>

<style scoped>
.orderTable {
    margin-top: 20px;
}

.text-ellipsis {
    display: inline-block;
    max-width: 200px;
    /* 或依照欄位寬度調整 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
