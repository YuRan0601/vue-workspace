<script setup>
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
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

        const response = await axios.get(`/api/order/user/${userId}/order/${orderId}`);
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

        <h2 class="mb-4">訂單明細</h2>

        <div v-if="orderDetail" class="order-summary p-4">
            <!-- 上半部 訂單資訊 / 總金額 / 收件人資訊 -->
            <!-- 訂單資料 -->
            <div class="order-grid">
                <h4 class="text-primary mb-3">訂單資料：</h4>
                <div class="order-row">
                    <label>訂單編號：</label>
                    <span>{{ orderDetail.orderId }}</span>
                </div>
                <div class="order-row">
                    <label>狀態：</label>
                    <span>{{ orderDetail.orderStatus }}</span>
                </div>
                <div class="order-row">
                    <label>付款方式：</label>
                    <span>{{ orderDetail.paymentMethod }}</span>
                </div>
                <div class="order-row">
                    <label>總金額：</label>
                    <span>${{ Math.round(orderDetail.totalAmount) }}</span>
                </div>
                <div class="order-row">
                    <label>最終金額：</label>
                    <span>${{ Math.round(orderDetail.finalAmount) }}</span>
                </div>
            </div>

            <!-- 收件人資料 -->
            <div class="order-grid">
                <h4 class="text-primary mb-3">收件人資料：</h4>
                <div class="order-row">
                    <label>收件人：</label>
                    <span>{{ orderDetail.receiveName }}</span>
                </div>
                <div class="order-row">
                    <label>電話：</label>
                    <span>{{ orderDetail.phoneNumber }}</span>
                </div>
                <div class="order-row">
                    <label>Email：</label>
                    <span>{{ orderDetail.email }}</span>
                </div>
                <div class="order-row">
                    <label>地址：</label>
                    <span>{{ orderDetail.address }}</span>
                </div>
            </div>

            <!-- 下半部 商品清單 -->
            <div class="order-items">
                <h4 class="text-primary">商品清單：</h4>
                <div class="row">
                    <div class="col-md-4 mb-3" v-for="item in orderDetail.orderItemsDtos" :key="item.orderitemId">
                        <div class="card h-100 shadow-sm">
                            <img v-if="item.productMainImage" :src="`/api/${item.productMainImage}`"
                                class="card-img-top" alt="商品主圖">
                            <div class="card-body">
                                <h5 class="card-title">{{ item.productName }}</h5>
                                <p class="card-text">
                                    數量：{{ item.quantity }} 件<br>
                                    <span v-if="item.specialPrice != null && item.specialPrice > 0">
                                        原價：<s>${{ item.unitPrice }}</s><br>
                                        特價：$<span class="text-danger">{{ item.specialPrice }}</span>
                                    </span>
                                    <span v-else>
                                        單價：${{ item.unitPrice }}
                                    </span><br />
                                    <span>單件折扣：${{ item.discount }}</span><br />
                                    <span>小記：${{ item.subtotal }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 返回按鈕 -->
            <div class="text-right mt-4">
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
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f7f7f7;
    margin: 0;
    padding: 20px;
}

.card {
    background-color: #fff;
    border-radius: 15px;
    margin: 20px auto;
    max-width: 950px;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-5px);
}

h2 {
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

.alert-warning {
    padding: 10px;
    background-color: #ffcc00;
    color: white;
    margin-bottom: 20px;
}

.card-img-top {
    max-height: 150px;
    object-fit: cover;
    border-radius: 10px;
}

/* 佔滿卡片寬度 */
/* 限制最大高度，可調整 */
/* 讓圖片按比例縮小，不裁切 */
/* 卡片內圖片和文字有間距 */
/* .card-img-top {
    width: 100%;        
    max-height: 120px;  
    object-fit: contain; 
    border-radius: 10px;
    margin-bottom: 10px; 
} */

/* 訂單資料 & 收件人資料圓弧網格樣式 */
.order-grid {
    border-radius: 15px;
    background-color: #fff;
    padding: 15px 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
}

.order-row {
    display: flex;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
}

.order-row label {
    width: 120px;
    /* 左側固定寬度，可調整 */
    font-weight: 600;
}

.order-row span {
    flex: 1;
    /* 右側自動填滿 */
}

.order-row:last-child {
    border-bottom: none;
}
</style>
