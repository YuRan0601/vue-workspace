<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";

const authStore = useAuthStore();
const userId = authStore.user?.userId;

if (!userId) {
    console.error("用戶未登入，無法獲取訂單資訊！");
}

const orderDetail = ref(null);
const route = useRoute();
const orderId = route.params.orderId;

async function loadOrderDetail() {
    try {
        if (!userId) return;

        const response = await axios.get(`/api/Order/user/${userId}/order/${orderId}`);
        orderDetail.value = response.data.data;
    } catch (error) {
        console.error("無法載入訂單詳情：", error);
    }
}

onMounted(() => {
    loadOrderDetail();
});
</script>

<template>
    <div>
        <div v-if="!userId" class="alert alert-warning">
            您尚未登入，請先登入後再查看訂單。
        </div>

        <h2 class="mb-4 ">訂單明細</h2>

        <div v-if="orderDetail" class="order-summary card shadow-lg">
            <div class="order-info">
                <div class="info-item">
                    <strong>訂單編號：</strong> {{ orderDetail.orderId }}
                </div>
                <div class="info-item">
                    <strong>狀態：</strong> {{ orderDetail.orderStatus }}
                </div>
                <div class="info-item">
                    <strong>付款方式：</strong> {{ orderDetail.paymentMethod }}
                </div>
                <div class="info-item">
                    <strong>收件人Email：</strong> {{ orderDetail.email }}
                </div>
            </div>

            <div class="order-items">
                <h4 class="text-primary">商品清單：</h4>
                <ul>
                    <li v-for="item in orderDetail.orderItemsDtos" :key="item.orderitemId" class="order-item">
                        <span>{{ item.productName }} ({{ item.quantity }} 件)</span>

                        <span>
                            <!-- 如果有特價，顯示原價並劃線，並顯示特價 -->
                            <span v-if="item.specialPrice > 0">
                                原價：<s>${{ item.unitPrice }}</s>，
                                特價：$<span class="text-danger">{{ item.specialPrice }}</span> <!-- 這裡設置紅色 -->
                            </span>
                            <!-- 如果沒有特價，只顯示原價 -->
                            <span v-else>
                                原價：${{ item.unitPrice }}
                            </span>
                        </span>
                    </li>
                </ul>
            </div>

            <div class="price-summary">
                <div class="info-item">
                    <strong>小計：</strong> ${{ Math.round(orderDetail.totalAmount) }}
                </div>
                <div class="info-item">
                    <strong>折扣金額：</strong> $<span class="text-danger">{{ Math.round(orderDetail.discountAmount)
                        }}</span>
                </div>
                <div class="info-item">
                    <strong>最終總金額：</strong> ${{ Math.round(orderDetail.finalAmount) }}
                </div>
            </div>

            <div class="recipient-info">
                <h4 class="text-success">收件人資訊：</h4>
                <p><strong>收件人：</strong> {{ orderDetail.receiveName }}</p>
                <p><strong>電話：</strong> {{ orderDetail.phoneNumber }}</p>
                <p><strong>地址：</strong> {{ orderDetail.address }}</p>
            </div>

            <!-- 返回按鈕，固定在卡片右下角 -->
            <div class="text-right">
                <RouterLink :to="{ name: 'memberOrder' }" class="btn btn-outline-primary">
                    <i class="bi bi-arrow-left"></i> 返回
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.text-danger {
    color: red;
    /* 設置特價為紅色 */
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f7f7f7;
    margin: 0;
    padding: 20px;
}

.card {
    background-color: #ffffff;
    border-radius: 15px;
    padding: 25px;
    margin: 20px auto;
    max-width: 950px;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.card:hover {
    transform: translateY(-5px);
}

h2 {
    color: #333;
}

.order-info,
.price-summary,
.recipient-info {
    margin-bottom: 20px;
}

.info-item {
    margin-bottom: 15px;
    font-size: 1.1em;
    color: #555;
}

.order-items ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
}

.order-items li {
    padding: 12px 0;
    border-bottom: 1px solid #e0e0e0;
    font-size: 1.1em;
}

.price-summary p,
.recipient-info p {
    margin: 5px 0;
    font-size: 1.1em;
}

strong {
    color: #333;
}

.btn-outline-primary {
    padding: 10px 20px;
    border-radius: 6px;
    border: 1px solid #4c8bf5;
    color: #4c8bf5;
    font-weight: bold;
    text-align: center;
}

.text-primary {
    color: #4c8bf5;
}

.text-success {
    color: #28a745;
}

.alert-warning {
    padding: 10px;
    background-color: #ffcc00;
    color: white;
    margin-bottom: 20px;
}

/* 調整返回按鈕位置 */
.card-footer {
    text-align: right;
    padding-top: 20px;
}
</style>
