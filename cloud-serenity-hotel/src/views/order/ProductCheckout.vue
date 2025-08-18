<script setup>
import { computed, ref, nextTick } from 'vue';
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL; // For 顯示圖片
const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

// 用 computed 直接讀 Pinia
const orderItems = computed(() => cartStore.selectedItems);
const recipient = computed(() => cartStore.recipient);

// 總金額
const totalAmount = computed(() => {
    return orderItems.value.reduce(
        (sum, item) =>
            sum + (item.subtotal ?? (item.quantity * (item.unitPrice - (item.discount || 0)))),
        0
    );
});

// 返回頁面
const goBackToCart = () => router.push({ name: 'productCart' });
const goBackToRecipient = () => router.push({ name: 'productRecipient' });

const ecpayHtml = ref("");
const ecpayContainer = ref(null);

// 提交訂單（現金 / 貨到付款）
const submitOrder = () => {
    const userId = authStore.user?.userId;
    if (!userId) return alert("請先登入！");

    // 只選擇被勾選的商品
    const selectedItems = cartStore.selectedItems.filter(item => item.isSelected);
    if (selectedItems.length === 0) return alert("請選擇商品！");

    // 組成 DTO
    const orderData = {
        recipient: { ...cartStore.recipient },
        orderItems: selectedItems
    };

    axios.post("/api/order", orderData) // ✅ 對應你的 Controller
        .then(res => {
            if (res.status === 201) {
                Swal.fire({
                    title: '建立訂單成功!',
                    text: '您的訂單已經建立，可至會員中心訂單區查看。',
                    icon: 'success',
                    confirmButtonText: '去查看',
                    customClass: { confirmButton: "btn btn-primary text-white me-2" },
                }).then(() => router.push({ name: 'memberOrder' }));
            } else {
                alert('訂單提交失敗');
            }
        })
        .catch(err => {
            console.error(err);
            alert('訂單提交失敗');
        });
};

// 提交訂單（信用卡付款）
const submitOrderWithPayment = () => {
    const userId = authStore.user?.userId;
    if (!userId) return alert("請先登入！");

    const selectedItems = cartStore.selectedItems.filter(item => item.isSelected);
    if (selectedItems.length === 0) return alert("請選擇商品！");

    const orderData = {
        recipient: { ...cartStore.recipient },
        orderItems: selectedItems
    };

    axios.post("/api/order/payment", orderData)
        .then(res => {
            if (res.data.success) {
                // 後端回傳的是 ECPay 付款表單 HTML
                ecpayHtml.value = res.data.data;
                nextTick(() => {
                    if (ecpayContainer.value) {
                        const form = ecpayContainer.value.querySelector("form");
                        if (form) form.submit(); // 🚀 自動提交到金流
                    }
                });
            } else {
                alert('付款流程建立失敗：' + res.data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert('付款流程建立失敗');
        });
};

</script>

<template>
    <v-container class="text-center">
        <h2 class="my-4">訂單最後確認</h2>

        <v-row class="d-flex justify-center">
            <v-col v-for="item in orderItems" :key="item.productId" cols="12" md="4">
                <v-card class="my-3">
                    <v-img :src="BASE_URL + '/' + item.imageUrl" alt="product image" height="200px"></v-img>
                    <v-card-title class="text-center wrap-text">{{ item.productName }}</v-card-title>
                    <v-card-subtitle class="text-center">
                        <span v-if="item.discount > 0">
                            <span class="original-price">${{ item.unitPrice }}</span>
                            <span class="special-price">${{ (item.unitPrice - item.discount).toFixed(0) }}</span>
                        </span>
                        <span v-else class="normal-price">${{ item.unitPrice }}</span>
                    </v-card-subtitle>
                    <v-card-actions class="justify-center">
                        <span>{{ item.quantity }}件</span>
                        <span>小計: ${{ item.subtotal ?? (item.quantity * (item.unitPrice - (item.discount || 0)))
                        }}</span>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="my-4">
            <v-col>
                <h3>收件人資料</h3>
                <p>姓名: {{ recipient.receiveName }}</p>
                <p>電話: {{ recipient.phone }}</p>
                <p>地址: {{ recipient.address }}</p>
                <p>Email: {{ recipient.email }}</p>
                <p>付款方式: {{ recipient.paymentMethod }}</p>
            </v-col>
        </v-row>

        <v-row class="my-4">
            <v-col>
                <h3>總金額：${{ totalAmount }}</h3>
            </v-col>
        </v-row>

        <v-row>
            <v-col class="text-center">
                <v-btn @click="goBackToCart" class="mt-3" color="info">返回購物車</v-btn>
                <v-btn @click="goBackToRecipient" class="mt-3" color="info">返回收件人資料</v-btn>
                <!-- 信用卡付款 -->
                <v-btn v-if="recipient.paymentMethod === '信用卡'" @click="submitOrderWithPayment" class="mt-3"
                    color="primary">
                    提交訂單(前往付款)
                </v-btn>
                <!-- 其他付款方式（貨到付款、現金） -->
                <v-btn v-else @click="submitOrder" class="mt-3" color="primary">
                    提交訂單
                </v-btn>
            </v-col>
        </v-row>

        <div ref="ecpayContainer" v-html="ecpayHtml" style="display: none"></div>
    </v-container>
</template>

<style scoped>
.wrap-text {
    white-space: normal;
    word-wrap: break-word;
    word-break: break-word;
}

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
