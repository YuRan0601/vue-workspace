<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

const router = useRouter();

// 記錄最終金額
const finalAmount = ref(0);

// 發送訂單創建請求並獲取最終金額
const createOrder = async () => {
    try {
        const response = await axios.post('/api/CartToOrder', { /* 這裡是需要傳送的訂單資料 */ });

        // 設置最終金額
        finalAmount.value = response.data.finalAmount; // 從後端返回的最終金額
    } catch (error) {
        console.error('訂單創建失敗:', error);
    }
};

// 轉跳到會員中心訂單頁面
const goToOrders = () => {
    router.push({ name: 'memberOrder' }); // 假設你的會員訂單頁路由是 'memberOrders'
};

// 轉跳到購物車頁面
const goBackToCart = () => {
    router.push({ name: 'productCart' });  // 假設你的購物車頁路由是 'productCart'
};

// 當頁面加載時呼叫 createOrder
createOrder();
</script>

<template>
    <v-container class="text-center checkout-success">
        <div class="success-box">
            <h2 class="my-4">訂單成功！</h2>
            <p class="my-2">您的訂單已成功提交，總金額為 <strong>${{ finalAmount }}</strong>。</p>
            <p class="my-2">我們已經將訂單詳情發送至您的電子郵件，請查看。</p>
            <p class="my-2">或可至會員中心之訂單，查看訂單詳情。</p>

            <!-- 按鈕區域放在 success-box 裡面 -->
            <v-row justify="center" class="mt-3">
                <v-col class="text-center" cols="auto">
                    <v-btn @click="goToOrders" color="primary" class="mx-2">查看訂單詳情</v-btn>
                    <v-btn @click="goBackToCart" color="secondary" class="mx-2">返回購物車</v-btn>
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
    /* 更淺的灰色背景 */
    width: 80%;
    max-width: 700px;
    margin: 0 auto;
    padding: 40px;
    border-radius: 12px;
    /* 更圓滑的角落 */
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    /* 更深的陰影，讓框框更明顯 */
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
    /* 減少按鈕與文字的間距 */
}
</style>
