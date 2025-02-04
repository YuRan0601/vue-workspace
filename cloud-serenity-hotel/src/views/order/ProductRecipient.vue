<script setup>
import { ref } from 'vue';
import { useCartStore } from "@/stores/cartStore"; // 引入 Pinia store
import { useAuthStore } from "@/stores/authStore"; // 引入 Pinia store
import { useRouter } from 'vue-router'; // 引入 Vue Router
import axios from "axios"; // 引入 axios 用於 API 請求

const authStore = useAuthStore(); // 使用 Pinia Store
const cartStore = useCartStore(); // 使用 Pinia store 來存取選中的商品
const router = useRouter(); // 使用 Vue Router

const useMemberInfo = ref(false);  // 控制是否從會員資料填充
const userId = authStore.user?.userId; // 從 authStore 中獲取 userId

// 初始化錯誤訊息和收件人資料
const errorMessages = ref({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: ''
});

const recipient = ref({
    name: '',
    address: '',
    phone: '',
    email: '',
    paymentMethod: '',
    userid: userId // 將當前用戶的 userId 填入 recipient
});

// 填寫會員資料功能
const fillMemberData = () => {
    if (useMemberInfo.value && userId) {
        axios.get(`/api/Cart/memberInfo`, { params: { userId } })
            .then(response => {
                recipient.value = {
                    name: response.data.userName || '', // 使用會員的 userName 來填充姓名
                    phone: response.data.phone || '',
                    email: response.data.email || '',
                    address: response.data.address || '',
                    paymentMethod: recipient.value.paymentMethod || '' // 保留付款方式
                };
            })
            .catch(error => {
                console.error('會員資料載入錯誤', error);
            });
    } else {
        recipient.value = {
            name: '',
            phone: '',
            email: '',
            address: '',
            paymentMethod: ''
        };
    }

    // 清除錯誤訊息
    errorMessages.value = {
        name: '',
        phone: '',
        email: '',
        address: '',
        paymentMethod: ''
    };
};

// 清除錯誤訊息的方法
const clearNameError = () => { errorMessages.value.name = ''; };
const clearPhoneError = () => { errorMessages.value.phone = ''; };
const clearEmailError = () => { errorMessages.value.email = ''; };
const clearAddressError = () => { errorMessages.value.address = ''; };
const clearPaymentMethodError = () => { errorMessages.value.paymentMethod = ''; };

// 提交表單
const handleSubmit = () => {
    let isValid = true;

    // 檢查所有欄位是否已填寫
    if (!recipient.value.name) {
        errorMessages.value.name = '姓名為必填';
        isValid = false;
    } else { errorMessages.value.name = ''; }

    if (!recipient.value.phone) {
        errorMessages.value.phone = '電話為必填';
        isValid = false;
    } else { errorMessages.value.phone = ''; }

    if (!recipient.value.email) {
        errorMessages.value.email = 'Email為必填';
        isValid = false;
    } else { errorMessages.value.email = ''; }

    if (!recipient.value.address) {
        errorMessages.value.address = '地址為必填';
        isValid = false;
    } else { errorMessages.value.address = ''; }

    if (!recipient.value.paymentMethod) {
        errorMessages.value.paymentMethod = '付款方式為必填';
        isValid = false;
    } else { errorMessages.value.paymentMethod = ''; }

    if (!isValid) {
        return;  // 如果表單驗證不通過，不進行下一步
    }

    // 將資料儲存到 Pinia store
    cartStore.setRecipientData(recipient.value);

    // 跳轉到結帳頁面
    router.push({ name: 'productCheckout' });
};
</script>

<template>
    <v-container class="mt-5">
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title class="headline" style="font-size: 32px; font-weight: bold;">
                        收件人資料與付款方式
                    </v-card-title>
                    <!-- 加入 "與會員資料相同" 的勾選框 -->
                    <v-checkbox v-model="useMemberInfo" label="與會員資料相同" @change="fillMemberData"></v-checkbox>
                    <v-form @submit.prevent="handleSubmit">
                        <!-- 姓名 -->
                        <v-text-field v-model="recipient.name" label="姓名" outlined class="mb-4" style="font-size: 18px;"
                            :error-messages="errorMessages.name ? [errorMessages.name] : []"
                            @input="clearNameError"></v-text-field>

                        <!-- 電話 -->
                        <v-text-field v-model="recipient.phone" label="電話" outlined class="mb-4"
                            style="font-size: 18px;" :error-messages="errorMessages.phone ? [errorMessages.phone] : []"
                            @input="clearPhoneError"></v-text-field>

                        <!-- Email -->
                        <v-text-field v-model="recipient.email" label="Email" outlined class="mb-4"
                            style="font-size: 18px;" :error-messages="errorMessages.email ? [errorMessages.email] : []"
                            @input="clearEmailError"></v-text-field>

                        <!-- 地址 -->
                        <v-text-field v-model="recipient.address" label="地址" outlined class="mb-4"
                            style="font-size: 18px;"
                            :error-messages="errorMessages.address ? [errorMessages.address] : []"
                            @input="clearAddressError"></v-text-field>

                        <!-- 付款方式 -->
                        <v-select v-model="recipient.paymentMethod" :items="['信用卡', '貨到付款', '銀行轉帳']" label="付款方式"
                            outlined class="mb-4" style="font-size: 18px;"
                            :error-messages="errorMessages.paymentMethod ? [errorMessages.paymentMethod] : []"
                            @blur="clearPaymentMethodError"></v-select>

                        <v-row justify="end" align="center">
                            <v-col cols="auto">
                                <v-btn color="primary" type="submit">
                                    下一步
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.v-card {
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.v-select .v-select__selections {
    font-size: 18px;
}

.v-text-field,
.v-select {
    width: 100%;
    font-size: 18px;
}

.v-card-title {
    text-align: center;
    margin-bottom: 20px;
}
</style>
