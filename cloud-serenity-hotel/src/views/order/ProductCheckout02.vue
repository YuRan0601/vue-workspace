<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from "@/stores/cartStore";  // 引入 Pinia store
import { useAuthStore } from "@/stores/authStore"; // 引入 Pinia store
import { useRouter } from 'vue-router'; // 引入 Vue Router
import axios from 'axios'; // 引入 axios
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;
const router = useRouter(); // 使用 Vue Router

// 使用 Pinia store
const cartStore = useCartStore();

// ===== 使用 authStore =====
const authStore = useAuthStore(); // 取得 authStore 的實例

// 直接訪問 Pinia store 中的 orderItems 和 recipient
const orderItems = ref(cartStore.selectedItems);  // 獲取選中的商品
const recipient = ref(cartStore.recipient);  // 獲取收件人資料

// 計算總金額
const totalAmount = computed(() => {
    return orderItems.value.reduce((total, item) => total + item.subtotal, 0);
});

// 返回購物車
const goBackToCart = () => {
    router.push({ name: 'productCart' });  // 導回購物車頁面
};

// 返回收件人資料
const goBackToRecipient = () => {
    router.push({ name: 'productRecipient' });  // 導回收件人資料頁面
};

// 提交訂單
const submitOrder = () => {
    const userId = authStore.user?.userId;  // 使用正確的大小寫，獲取當前登入的 userId

    if (!userId) {
        alert("請先登入！");
        return;
    }

    const orderData = {
        recipient: {
            receiveName: recipient.value.name,  // 傳送 receive_name 給後端
            phone: recipient.value.phone,
            email: recipient.value.email,
            address: recipient.value.address,
            paymentMethod: recipient.value.paymentMethod,
            userid: userId  // 加入 userId
        },
        orderItems: orderItems.value
    };

    console.log('提交的訂單資料:', orderData); // 確保資料傳送正確

    axios.post(`/api/Order/CartToOrder`, orderData)
        .then(response => {
            if (response.status === 200 || response.status === 201) { // 如果訂單提交成功
                const finalAmount = response.data.finalAmount; // 獲取最終金額
                console.log('訂單提交成功:', response.data);

                // 更新購物車中所有已結帳商品的狀態，設為 4 (已結帳)
                cartStore.selectedItems.forEach(item => {
                    item.status = 4;  // 假設狀態 4 代表已結帳
                });

                // 從購物車中刪除所有已結帳的商品
                cartStore.setSelectedItems([]);

                // 跳轉到訂單成功頁面
                router.push({
                    name: 'cartToOrderSuccess',
                    query: { finalAmount: finalAmount }  // 將最終金額傳遞
                });
            } else {
                console.error('訂單提交失敗：狀態碼不正確', response.status);
                alert('訂單提交失敗，請稍後再試');
            }
        })
        .catch(error => {
            console.error('訂單提交失敗:', error);
            alert('訂單提交失敗，請稍後再試');
        });
};
</script>

<template>
    <v-container class="text-center">
        <h2 class="my-4">訂單最後確認</h2>

        <!-- 顯示來自 Pinia store 的選中商品 -->
        <v-row class="d-flex justify-center">
            <v-col v-for="item in orderItems" :key="item.productId" cols="12" md="4">
                <v-card class="my-3">
                    <v-img :src="BASE_URL + '/' + item.imageUrl" alt="product image" height="200px"></v-img>
                    <v-card-title class="text-center">{{ item.productName }}</v-card-title>
                    <v-card-subtitle class="text-center">
                        <span v-if="item.discount > 0">
                            <span class="original-price">${{ item.unitPrice }}</span>
                            <span class="special-price">${{ (item.unitPrice - item.discount).toFixed(0) }}</span>
                        </span>
                        <span v-else class="normal - price">${{ item.unitPrice }}</span>
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
            <!-- 返回購物車的按鈕 -->
            <v-btn @click="goBackToCart" class="mt-3" color="info">返回購物車</v-btn>
            <!-- 返回收件人資料的按鈕 -->
            <v-btn @click="goBackToRecipient" class="mt-3" color="info">返回收件人資料</v-btn>
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

.original-price {
    font-size: 16px;
    color: black;
    text-decoration: line-through;
}

.special-price {
    font-size: 18px;
    color: red;
    font-weight: bold;
}

.normal-price {
    font-size: 18px;
    color: black;
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
    margin: 15px;
}
</style>
