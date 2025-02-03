<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from "@/stores/cartStore";  // 引入 Pinia store

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

// 使用 Pinia store
const cartStore = useCartStore();

// 直接訪問 Pinia store 中的 orderItems 和 recipient
const orderItems = ref(cartStore.selectedItems);  // 獲取選中的商品
const recipient = ref(cartStore.recipient);  // 獲取收件人資料

// 計算總金額
const totalAmount = computed(() => {
    return orderItems.value.reduce((total, item) => total + item.subtotal, 0);
});

// 提交訂單
const submitOrder = () => {
    console.log('提交的訂單資料:', { orderItems: orderItems.value, recipient: recipient.value });
    // 你可以在這裡執行提交訂單的 API 調用或跳轉到另一個頁面
};
</script>

<template>
    <v-container class="text-center">
        <h2 class="my-4">最終確認</h2>

        <!-- 顯示來自 Pinia store 的選中商品 -->
        <v-row class="d-flex justify-center">
            <v-col v-for="item in orderItems" :key="item.productId" cols="12" md="4">
                <v-card class="my-3">
                    <v-img :src="BASE_URL + '/' + item.imageUrl" alt="product image" height="200px"></v-img>
                    <v-card-title class="text-center">{{ item.productName }}</v-card-title>
                    <v-card-subtitle class="text-center">
                        <span v-if="item.discount > 0">
                            <s style="color: gray;">${{ item.unitPrice }}</s>
                            <span style="color: #D94600;">${{ (item.unitPrice - item.discount).toFixed(2) }}</span>
                        </span>
                        <span v-else>${{ item.unitPrice }}</span>
                    </v-card-subtitle>
                    <v-card-actions class="justify-center">
                        <span>{{ item.quantity }}件</span>
                        <span>小計: ${{ item.subtotal }}</span>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- 顯示收件人資料 -->
        <v-row class="my-4">
            <v-col>
                <h3>收件人資料</h3>
                <p>姓名: {{ recipient.name }}</p>
                <p>電話: {{ recipient.phone }}</p>
                <p>地址: {{ recipient.address }}</p>
                <p>Email: {{ recipient.email }}</p>
                <p>付款方式: {{ recipient.paymentMethod }}</p>
            </v-col>
        </v-row>

        <!-- 顯示總金額 -->
        <v-row class="my-4">
            <v-col>
                <h3>總金額：${{ totalAmount }}</h3>
            </v-col>
        </v-row>

    </v-container>
    <v-row>
        <v-col class="text-center">
            <!-- 提交訂單的按鈕 -->
            <v-btn @click="submitOrder" class="mt-3" color="primary">提交訂單</v-btn>
        </v-col>
    </v-row>
</template>

<style scoped>
.v-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
}

.v-card-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
}

.v-card-subtitle {
    font-size: 16px;
    color: gray;
    text-align: center;
}

.v-card-actions {
    justify-content: center;
    font-size: 16px;
    padding: 5px;
}

.v-img {
    object-fit: cover;
    width: 100%;
    height: auto;
}

.text-center {
    text-align: center;
}

.my-4 {
    margin-top: 20px;
    margin-bottom: 20px;
}

.v-btn {
    margin: 5px;
}
</style>
