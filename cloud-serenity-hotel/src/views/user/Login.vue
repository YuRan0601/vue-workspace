<script setup>
import axios from 'axios';
import { ref, computed } from 'vue';

const loginData = ref({
    email: '',
    password: ''
});
const errorMsg = ref('');
const isError = ref(false);
const passHidden = ref(false);
const passAttr = ref('password');

function showErrorMsg(msg) {
    if (msg.length > 0) { // 如果訊息不為空，顯示錯誤訊息
        errorMsg.value = msg;
        isError.value = true;
    } else { // 如果沒有訊息，隱藏錯誤訊息
        isError.value = false;
    }
}

//password 顯示開關
const checkHidden = computed(() => {
    if (passHidden.value) {
        passAttr.value = 'text';
    } else {
        passAttr.value = 'password';
    }
})

//一鍵登入
function adminKeyin() {
    loginData.value.email = "CSH_AD@mail.com"
    loginData.value.password = "aDmin@01"
}
function memberKeyin() {
    loginData.value.email = "Linsansan@mail.com"
    loginData.value.password = "Lin33#033"
}

const loginStatus = () => {
    //發送請求給後端
    axios.post('/api/user/checklogin', loginData.value)
        .then(function (response) {
            console.log(response.data);
            let data = response.data
            if (data == "admin") {
                window.location.href = '/back';
            } else if (data == "member") {
                window.location.href = '/front/member';
            }
        })
        .catch(function (error) {
            console.log(error.response.data);
            showErrorMsg(error.response.data);
        });
}

</script>

<template>
    <div class="login container">
        <form class="loginform" id="login" method="post">
            <h2 style='text-align: center; margin: 0;'>歡迎登入</h2>
            <br>
            <label for="email" class="form-label fs-5">電子信箱</label>
            <input v-model="loginData.email" type="email" class="form-control" id="email" name="email"
                placeholder="請輸入電子信箱" required />
            <br>
            <label for="password" class="form-label fs-5">密碼</label>
            <input v-model="loginData.password" :type="passAttr" class="form-control" id="password" name="password"
                placeholder="請輸入密碼" minlength="8" maxlength="64" required />
            <input v-model="passHidden" type="checkbox" class="my-3" @change="checkHidden()"> 顯示密碼</input>
            <br>
            <div class="d-grid gap-2 mx-auto">
                <button @click.prevent="loginStatus()" class="btn btn-primary">登入</button>
            </div>
            <div class="row my-2">
                <!-- 一鍵登入 -->
                <div class="col-2"><button @click.prevent="adminKeyin()"
                        class="btn btn-outline-dark bg-white text-dark"><v-icon>mdi-account-tie</v-icon></button>
                </div>
                <div class="col-2"><button @click.prevent="memberKeyin()"
                        class="btn btn-outline-dark bg-white text-dark"><v-icon>mdi-account</v-icon></button>
                </div>
            </div>
            <p v-show="isError" class="pt-2" id="errorMessage">
                <v-icon>mdi-alert</v-icon>
                <span v-text="errorMsg"></span>
            </p>
            <p style='text-align: center; margin: 0;'>
                沒有帳號? <RouterLink :to="{ name: 'register' }">立即註冊</RouterLink>
            </p>
        </form>
    </div>
</template>

<style lang="css" scoped>
.login {
    margin: auto;
    padding: 50px 0;
    display: flex;
    justify-content: center;
}

.loginform {
    padding: 35px 35px;
    width: 400px;
    display: block;
    border-radius: 50px;
    background-color: skyblue;
}

.nav-bgc {
    background-color: lightblue;
}

#errorMessage {
    margin: 0;
    color: #c70000;
    font-weight: bold;
    text-align: center;
}
</style>