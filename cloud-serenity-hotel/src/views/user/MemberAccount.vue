<script setup>
import { useAuthStore } from "@/stores/authStore";
const useStores = useAuthStore()
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';

const memberData = ref({
    userId: '',
    userName: '',
    email: '',
    password: ''
});

//目前密碼
const nowPassword = ref('')
//新密碼
const newPassword = ref('');
//確認新密碼
const checkNewPassword = ref('');

const passwordMsg = ref('')
const password2Msg = ref('')

async function getMemberInfo() {
    const { data } = await axios.get(`/api/member/${useStores.user.userId}`);
    if (data == '') {
        console.error('No Member Data');

    } else {
        memberData.value = data;
    }
}

const submitEditForm = () => {
    if (!nowPassword.value || !newPassword.value || !checkNewPassword.value) {
        Swal.fire({
            title: '輸入錯誤',
            text: '所有欄位皆為必填！',
            icon: 'error'
        });
        return;
    }

    if (nowPassword.value !== memberData.value.password) {
        Swal.fire({
            title: '修改失敗',
            text: '請檢查目前密碼是否正確！',
            icon: 'error'
        });
        return;
    }

    memberData.value.password = newPassword.value
    console.log(memberData.value);

    //發送更新請求給後端
    axios.post('/api/member/updatePassword', memberData.value)
        .then(function (response) {
            // 彈出成功提示
            Swal.fire({
                title: '修改成功',
                text: '密碼已修改！',
                icon: 'success',
                allowOutsideClick: false,
                didClose: () => {
                    // 跳轉到登入頁面
                    window.location.href = '/front/member/Overview';
                }
            });

        })
        .catch(function (error) {
            Swal.fire({
                title: '修改失敗',
                text: '請稍後再試！',
                icon: 'error',
                allowOutsideClick: false
            });

        });

};

function passwordCheck() {
    let content = newPassword.value;
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

function confirmNewPassword() {
    if (newPassword.value != checkNewPassword.value) {
        password2Msg.value = '密碼不一致 請再檢查一次!';
    } else {
        password2Msg.value = '';
    }
}

onMounted(() => {
    getMemberInfo()
})
</script>

<template>
    <div class="container">
        <h2>修改密碼</h2>
        <h6 style="color: #c70000; font-weight: bold;">至少8字,上限為64字,需有大小寫英文,數字,特殊字元 (!@#$%^*)</h6>
        <form @submit.prevent="submitEditForm" class="mt-2">
            <div class="col-4 mb-4">
                <label for="nowpassword">目前密碼</label>
                <input type="password" class="form-control" v-model="nowPassword" name="nowpassword"
                    placeholder="請輸入目前密碼" minlength="8" maxlength="64" required />
            </div>
            <div class=" col-4 mb-4">
                <label for="newpassword">新密碼</label>
                <input type="password" class="form-control" v-model="newPassword" name="newpassword"
                    placeholder="請輸入新密碼" minlength="8" maxlength="64" @blur="passwordCheck()" required />
                <span class="passwordMsg" v-if="passwordMsg.length > 0">{{ passwordMsg }}</span>
            </div>
            <div class="col-4 mb-4">
                <label for="checkpassword">確認新密碼</label>
                <input type="password" class="form-control" v-model="checkNewPassword" name="checkpassword"
                    placeholder="請再輸入新密碼" minlength="8" maxlength="64" @blur="confirmNewPassword()" required />
                <span class="password2Msg" v-if="password2Msg.length > 0">{{ password2Msg }}</span>
            </div>
            <div class="col-4 mt-2">
                <button type="submit" class="btn btn-primary text-white">修改密碼</button>
            </div>
        </form>
    </div>
</template>

<style lang="css" scoped>
.passwordMsg,
.password2Msg {
    color: #c70000;
    font-weight: bold;
}
</style>