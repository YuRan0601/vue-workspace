<script setup>
import { ref } from 'vue';
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from 'vue-router';
import axios from "axios";

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const useMemberInfo = ref(false);
const userId = authStore.user?.userId;

// 錯誤訊息
const errorMessages = ref({
    receiveName: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: ''
});

// 收件人資料
const recipient = ref({
    receiveName: '',
    address: '',
    phone: '',
    email: '',
    paymentMethod: '',
    userid: userId
});

// 填寫會員資料
const fillMemberData = () => {
    if (useMemberInfo.value && userId) {
        axios.get(`/api/cart/member`, { params: { userId } })
            .then(response => {
                const member = response.data.data;
                recipient.value = {
                    receiveName: member.userName || '',
                    phone: member.phone || '',
                    email: member.email || '',
                    address: member.address || '',
                    paymentMethod: recipient.value.paymentMethod || '',
                    userid: userId
                };
            })
            .catch(error => {
                console.error('會員資料載入錯誤', error);
            });
    } else {
        recipient.value = {
            receiveName: '',
            phone: '',
            email: '',
            address: '',
            paymentMethod: '',
            userid: userId
        };
    }

    // 清除錯誤訊息
    errorMessages.value = {
        receiveName: '',
        phone: '',
        email: '',
        address: '',
        paymentMethod: ''
    };
};

// 清除錯誤訊息方法
const clearReceiveNameError = () => { errorMessages.value.receiveName = ''; };
const clearPhoneError = () => { errorMessages.value.phone = ''; };
const clearEmailError = () => { errorMessages.value.email = ''; };
const clearAddressError = () => { errorMessages.value.address = ''; };
const clearPaymentMethodError = () => { errorMessages.value.paymentMethod = ''; };

// 提交表單
const handleSubmit = () => {
    let isValid = true;

    if (!recipient.value.receiveName) {
        errorMessages.value.receiveName = '姓名為必填';
        isValid = false;
    }

    if (!recipient.value.phone) {
        errorMessages.value.phone = '電話為必填';
        isValid = false;
    }

    if (!recipient.value.email) {
        errorMessages.value.email = 'Email為必填';
        isValid = false;
    }

    if (!recipient.value.address) {
        errorMessages.value.address = '地址為必填';
        isValid = false;
    }

    if (!recipient.value.paymentMethod) {
        errorMessages.value.paymentMethod = '付款方式為必填';
        isValid = false;
    }

    if (!isValid) return;

    cartStore.setRecipientData(recipient.value);
    router.push({ name: 'productCheckout' });
};
</script>

<template>
    <v-container class="mt-5">
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title class="headline text-center" style="font-size: 32px; font-weight: bold;">
                        收件人資料與付款方式
                    </v-card-title>

                    <v-checkbox v-model="useMemberInfo" label="與會員資料相同" @change="fillMemberData"></v-checkbox>

                    <v-form @submit.prevent="handleSubmit">
                        <v-text-field v-model="recipient.receiveName" label="姓名" outlined class="mb-4"
                            :error-messages="errorMessages.receiveName ? [errorMessages.receiveName] : []"
                            @input="clearReceiveNameError"></v-text-field>

                        <v-text-field v-model="recipient.phone" label="電話" outlined class="mb-4"
                            :error-messages="errorMessages.phone ? [errorMessages.phone] : []"
                            @input="clearPhoneError"></v-text-field>

                        <v-text-field v-model="recipient.email" label="Email" outlined class="mb-4"
                            :error-messages="errorMessages.email ? [errorMessages.email] : []"
                            @input="clearEmailError"></v-text-field>

                        <v-text-field v-model="recipient.address" label="地址" outlined class="mb-4"
                            :error-messages="errorMessages.address ? [errorMessages.address] : []"
                            @input="clearAddressError"></v-text-field>

                        <v-select v-model="recipient.paymentMethod" :items="['信用卡', '貨到付款']" label="付款方式" outlined
                            class="mb-4"
                            :error-messages="errorMessages.paymentMethod ? [errorMessages.paymentMethod] : []"
                            @blur="clearPaymentMethodError"></v-select>

                        <v-row justify="end" align="center">
                            <v-col cols="auto">
                                <v-btn color="primary" type="submit">下一步</v-btn>
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

.v-text-field,
.v-select {
    width: 100%;
    font-size: 18px;
}

.v-card-title {
    margin-bottom: 20px;
}
</style>
