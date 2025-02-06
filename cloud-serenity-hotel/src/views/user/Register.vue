<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { ref, watch } from 'vue';

//國家列表api
const countryArray = ref()
axios.get("https://restcountries.com/v3.1/all?fields=name,cca3")
    .then((response) => {
        let country = response.data
        country.sort((a, b) => a.name.common.localeCompare(b.name.common)); // 按國名排序
        countryArray.value = country
        // console.log(countryArray.value);

    }).catch((error) => {
        console.log(error);

    })

// 獲取表單資料
const registerData = ref({
    userName: '',
    email: '',
    password: '',
    member: {
        gender: 'Male',
        birthday: '',
        phone: '',
        personalIdNo: '',
        country: 'TWN',
        address: '',
        passportNo: ''
    }
});
const submitRegister = () => {

    //發送請求給後端
    axios.post('/api/user/register', registerData.value)
        .then(function (response) {
            // 彈出成功提示
            Swal.fire({
                title: '註冊成功',
                text: '將跳轉到登入頁面！',
                icon: 'success',
                allowOutsideClick: false,
                timer: 3000, // 設定 3 秒後自動關閉
                timerProgressBar: true, // 顯示倒數計時進度條
                didClose: () => {
                    // 跳轉到登入頁面
                    window.location.href = '/login';
                }
            });
        })
        .catch(function (error) {
            Swal.fire({
                title: '註冊失敗',
                text: '請稍後再試！',
                icon: 'error',
                allowOutsideClick: false
            });
        });
}

//一鍵帶入
function autoKeyin() {
    registerData.value.userName = "林小美";
    registerData.value.email = "linxiaomei.cloud@gmail.com";
    registerData.value.password = "cloud#cus01";
    registerData.value.member.gender = "Female";
    registerData.value.member.birthday = "2000-01-01";
    registerData.value.member.phone = "0917871233";
    registerData.value.member.personalIdNo = "C278126936";
    registerData.value.member.country = "TWN";
    registerData.value.member.address = "台北市松山區敦化北路340-9號";
    registerData.value.member.passportNo = "";
}


//判斷身分別 移除必填屬性
const nativeRequired = ref(true)
const foreignerRequired = ref(false)
const identity = ref('native')

watch(identity, (newVal) => {
    if (newVal == "native") {
        //本國人無須護照號碼也可訂房入住
        nativeRequired.value = true;
        foreignerRequired.value = false;
    } else {
        //外國人沒有身分證字號
        nativeRequired.value = false;
        foreignerRequired.value = true;
    }
});

//email
const emailMsg = ref('')
const eMsgShow = ref('false')
const eMsgColor = ref('')
function emailCheck() {
    let email = registerData.value.email;

    if (email.length != 0) {
        axios.post('/api/user/checkEmail', { email })
            .then(function (response) {
                console.log(response.data);

                if (response.data == "ok") {
                    emailMsg.value = '此Email可以使用'
                    eMsgColor.value = 'green'
                    eMsgShow.value = true
                } else {
                    emailMsg.value = '此Email已被使用'
                    eMsgColor.value = '#c70000'
                    eMsgShow.value = true
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    } else {
        emailMsg.value = '<i class="fa-solid fa-circle-xmark"></i> Email不可為空白'
        eMsgShow.value = true
    }

};

//password 顯示開關
const passAttr = ref('password');
const showPassword = ref('false');
function checkEye() {
    if (passAttr.value === 'password') {
        passAttr.value = 'text';
        showPassword.value = true;
    } else {
        passAttr.value = 'password';
        showPassword.value = false;
    }
};

//password 檢查
const passwordMsg = ref('')
function passwordCheck() {
    let content = registerData.value.password;
    let contentLength = content.length;
    let rule1 = new RegExp(/[a-z]/i);
    let rule2 = new RegExp(/[0-9]/);
    let rule3 = new RegExp(/[!@#$%^*]/);
    if (contentLength == 0) {
        passwordMsg.value =
            '密碼不可為空白';
    } else if (contentLength < 8) {
        passwordMsg.value =
            '密碼至少8個字';
    } else if (!rule1.test(content)) {
        passwordMsg.value =
            '密碼必須包含英文';
    } else if (!rule2.test(content)) {
        passwordMsg.value =
            '密碼必須包含數字';
    } else if (!rule3.test(content)) {
        passwordMsg.value =
            '密碼必須包含特殊字元 (!@#$%^*)';
    } else {
        passwordMsg.value = '';
    }
};

// twId
const twIdMsg = ref(false)
function twId() {
    let content = registerData.value.member.personalIdNo;
    let result = validateTaiwanID(content);
    twIdMsg.value = !result;
};

//身分證驗證器 by GPT
function validateTaiwanID(id) {
    // 檢查格式：英文字母開頭，接著9個數字
    const regex = /^[A-Z][0-9]{9}$/;
    if (!regex.test(id)) {
        return false;
    }

    // 字母對應數字表
    const letterMapping = {
        A: 10, B: 11, C: 12, D: 13, E: 14, F: 15,
        G: 16, H: 17, I: 34, J: 18, K: 19, L: 20,
        M: 21, N: 22, O: 35, P: 23, Q: 24, R: 25,
        S: 26, T: 27, U: 28, V: 29, W: 32, X: 30,
        Y: 31, Z: 33,
    };

    // 將第一個字母轉換為數字並拆分成兩部分 ex:10 -> 1 0
    const firstChar = id[0];
    const numCode = letterMapping[firstChar];
    //第一個數字
    const firstDigit = Math.floor(numCode / 10);
    //第二個數字
    const secondDigit = numCode % 10;

    // 計算權重總和 乘數 1 9 8 7 6 5 4 3 2 1 1
    let sum = firstDigit + secondDigit * 9;
    for (let i = 1; i <= 8; i++) {
        sum += parseInt(id[i]) * (9 - i);
    }
    // 加上最後一位檢查碼
    sum += parseInt(id[9]);
    // 確認總和能被10整除
    return sum % 10 === 0;
}

</script>

<template>
    <div class="container mb-6">
        <h2 style="text-align: center; margin: 0">歡迎註冊</h2>
        <br />
        <label for="identity" class="form-label fs-5">身分別</label>
        <select class="form-select w-25" v-model="identity" required>
            <option value="native">本國人</option>
            <option value="foreigner">外國人</option>
        </select>
        <br />
        <h4 style="color: red; font-weight: bold;">標示 * 為必填欄位，本國人需必填 身分證字號 ，護照號碼則選填，外國人必填護照號碼!</h4>
        <form @submit.prevent="submitRegister" id="register" class="row">
            <!-- 左欄 -->
            <div class="col-md-6">
                <label for="email" class="form-label fs-5">電子信箱<span
                        style="color: red; font-weight: bold;">*</span></label>
                <input type="email" class="form-control" v-model="registerData.email" @blur="emailCheck()" name="email"
                    placeholder="請輸入電子信箱" required />
                <span class="EmailMsg" v-show="eMsgShow" :style="{ color: eMsgColor }" v-html="emailMsg"></span>
                <br />

                <label for="password" class="form-label fs-5">密碼<span style="color: red; font-weight: bold;">*</span>
                    <button type="button" class="btn btn-warning mx-2" data-bs-container="body"
                        data-bs-toggle="collapse" data-bs-target="#collapsePassword" aria-expanded="false"
                        aria-controls="collapsePassword">
                        密碼規則
                    </button></label>
                <div class="collapse" id="collapsePassword">
                    <div class="mb-2">
                        至少8字,上限為64字,需有大小寫英文,數字,特殊字元 (!@#$%^*)
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <input :type="passAttr" class="form-control" v-model="registerData.password" name="password"
                            placeholder="請輸入密碼" minlength="8" maxlength="64" @blur="passwordCheck()" required />
                    </div>
                    <div class="col-1">
                        <v-icon class="checkEye" @click="checkEye()">{{ showPassword ? 'mdi-eye-off' : 'mdi-eye'
                            }}</v-icon>
                    </div>
                </div>

                <span class="passwordMsg" v-if="passwordMsg.length > 0">{{ passwordMsg }}</span>
                <br />

                <label for="name" class="form-label fs-5">姓名<span
                        style="color: red; font-weight: bold;">*</span></label>
                <input type="text" class="form-control" v-model="registerData.userName" name="name" placeholder="請輸入姓名"
                    required />
                <br />

                <label for="gender" class="form-label fs-5">性別<span
                        style="color: red; font-weight: bold;">*</span></label>
                <select class="form-select" v-model="registerData.member.gender" name="gender" required>
                    <option value="Male">男</option>
                    <option value="Female">女</option>
                    <option value="Other">其他</option>
                </select>
                <br />

                <label for="birthday" class="form-label fs-5">生日<span
                        style="color: red; font-weight: bold;">*</span></label>
                <input type="date" class="form-control" v-model="registerData.member.birthday" name="birthday"
                    required />
                <br />
            </div>

            <!-- 右欄 -->
            <div class="col-md-6">
                <label for="phone" class="form-label fs-5">行動電話<span
                        style="color: red; font-weight: bold;">*</span></label>
                <input type="tel" class="form-control" v-model="registerData.member.phone" name="phone"
                    placeholder="請輸入行動電話" required />
                <br />

                <label for="personal-id-no" class="form-label fs-5">身分證字號<span class="per-sp"
                        v-show="nativeRequired">*</span></label>
                <input type="text" class="form-control" v-model="registerData.member.personalIdNo" name="personal_id_no"
                    placeholder="請輸入身分證字號" @blur="twId()" :required="nativeRequired" />
                <span class="twIdMsg" v-show="twIdMsg">身分證字號錯誤</span>
                <br />

                <label for="country" class="form-label fs-5">國籍(國家三位字母代碼)<span
                        style="color: red; font-weight: bold;">*</span></label>
                <select class="form-select" v-model="registerData.member.country" name="country" required>
                    <option v-for="countrys in countryArray" :value="countrys.cca3">
                        {{ countrys.cca3 }}
                    </option>
                </select>
                <br />

                <label for="passport-no" class="form-label fs-5">護照號碼<span class="pass-sp"
                        v-show="foreignerRequired">*</span></label>
                <input type="text" class="form-control" v-model="registerData.member.passportNo" name="passport_no"
                    placeholder="請輸入護照號碼" :required="foreignerRequired" />
                <br />
            </div>

            <!-- 地址獨立一行 -->
            <div class="col-12">
                <label for="address" class="form-label fs-5">聯絡地址<span
                        style="color: blue; font-weight: bold;">(選填)</span></label>
                <input type="text" class="form-control" v-model="registerData.member.address" id="address"
                    name="address" minlength="10" placeholder="請輸入地址" />
                <br />
            </div>

            <!-- 按鈕 -->
            <div class="col-12 text-center">
                <button type="submit" class="btn btn-primary btn-lg px-5 text-white">註冊</button>
                <button type="button" @click="autoKeyin()"
                    class="btn btn-primary btn-lg px-5 text-white mx-2">一鍵帶入</button>
            </div>
        </form>
    </div>
</template>

<style lang="css" scoped>
.twIdMsg,
.passwordMsg,
.EmailMsg {
    color: #c70000;
    font-weight: bold;
}

.checkEye {
    position: relative;
    top: 20%;
    right: 10px;
}

.per-sp,
.pass-sp {
    color: red;
    font-weight: bold;
}
</style>