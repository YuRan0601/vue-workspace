<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 從路由的 query 中獲取訂單狀態及最終金額
const finalAmount = route.query.finalAmount || 0;
const paymentStatus = route.query.paymentStatus || "success"; // 用來表示支付狀態

// 轉跳到會員中心訂單頁面
const goToOrders = () => {
    router.push({ name: 'memberOrder' }); // 假設你的會員訂單頁路由是 'memberOrders'
};

// 轉跳到購物車頁面
const goBackToCart = () => {
    router.push({ name: 'productCart' });  // 假設你的購物車頁路由是 'productCart'
};

// 付款失敗的情況，去到會員中心付款
const goToPayment = () => {
    router.push({ name: 'memberOrder', query: { paymentPending: true } }); // 透過 query 參數標註支付待處理
};
</script>

<template>
    <v-container class="text-center checkout-success">
        <div class="success-box">
            <h2 class="my-4">訂單成功！</h2>
            <p class="my-2">您的訂單已成功提交，總金額為 <strong>${{ finalAmount }}</strong>。</p>
            <p class="my-2">我們已經將訂單詳情發送至您的電子郵件，請查看。</p>
            <p class="my-2" v-if="paymentStatus === 'failed'">若付款失敗，請至會員中心訂單區，點選去付款按鈕完成付款。</p>

            <!-- 按鈕區域放在 success-box 裡面 -->
            <v-row justify="center" class="mt-3">
                <v-col class="text-center" cols="auto">
                    <v-btn @click="goToOrders" color="primary" class="mx-2">查看訂單詳情</v-btn>
                    <v-btn @click="paymentStatus === 'failed' ? goToPayment : goBackToCart" color="secondary"
                        class="mx-2">
                        {{ paymentStatus === 'failed' ? '前往付款' : '返回購物車' }}
                    </v-btn>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<style scoped>
.checkout-success {
    padding-top: 50px;
    padding-bottom: 70px;
    /* 增加底部間距 */
}

.success-box {
    background-color: #f9f9f9;
    width: 80%;
    max-width: 700px;
    margin: 0 auto;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.my-4 {
    margin-top: 20px;
    margin-bottom: 20px;
}

.v-btn {
    margin-top: 10px;
}
</style>
