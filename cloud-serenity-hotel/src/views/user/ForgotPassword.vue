<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const email = ref('');

function submitForgotForm() {
    //檢查Email
    //如果有註冊則寄送信件 否則不寄信
    //無論是否寄信都會顯示已寄出視窗 並跳轉到首頁
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
            </div>
        </form>
    </div>
</template>

<style lang="css" scoped></style>