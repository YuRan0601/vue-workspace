<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const email = ref('');

async function submitForgotForm() {
    if (!email.value) {
        Swal.fire({
            title: '發送失敗',
            text: '請輸入 Email',
            icon: 'error'
        });
        return;
    }
    await axios.post('/api/user/forgotPassword', { email: email.value })
        .then(function (response) {
            Swal.fire({
                title: '發送成功',
                text: '如果此信箱已註冊，我們將發送密碼重設郵件，請檢查您的收件匣。',
                icon: 'success'
            });
        })
        .catch(function (error) {
            Swal.fire({
                title: '發送失敗',
                text: '請稍後再試！',
                icon: 'error'
            });
        })
}

function autoKeyin() {
    email.value = "linxiaomei.cloud@gmail.com";
}

</script>

<template>
    <div class="container my-4 pb-6">
        <h2>忘記密碼</h2>
        <p>請輸入已註冊的電子信箱，我們會發送有關重設密碼方法到此電子信箱。</p>
        <form @submit.prevent="submitForgotForm" class="mt-2">
            <div class="col-4 mb-4">
                <label for="email" class="form-label fs-5">電子信箱</label>
                <input type="email" class="form-control" v-model="email" name="email" placeholder="請輸入電子信箱" required />
            </div>
            <div class="col-4 mt-2">
                <button type="submit" class="btn btn-primary text-white">寄送重設密碼確認信</button>
                <button type="button" @click="autoKeyin()" class="btn btn-primary px-5 text-white mx-2">一鍵帶入</button>
            </div>
        </form>
    </div>
</template>

<style lang="css" scoped></style>