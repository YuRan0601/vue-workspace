<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRoute } from 'vue-router';

const route = useRoute();

//新密碼
const newPassword = ref('');
//確認新密碼
const checkNewPassword = ref('');
//token
const token = ref('');

const passwordMsg = ref('')
const password2Msg = ref('')

async function submitRestForm() {

    if (newPassword.value != checkNewPassword.value) {
        Swal.fire({
            title: '修改失敗',
            text: '密碼不一致 請再檢查一次!',
            icon: 'error'
        });
        return;
    }

    await axios.post('/api/user/resetPassword', {
        token: token.value,
        newPassword: newPassword.value
    })
        .then(function (response) {
            Swal.fire({
                title: '修改成功',
                text: '密碼已修改！',
                icon: 'success',
                allowOutsideClick: false,
                didClose: () => {
                    // 跳轉到登入頁面
                    window.location.href = '/login';
                }
            });
        })
        .catch(function (error) {
            Swal.fire({
                title: '修改失敗',
                text: '無法重設密碼，請確認您的連結是否正確',
                icon: 'error'
            });
        })

}

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

//取得token
onMounted(() => {
    token.value = route.query.token || '';
});

</script>

<template>
    <div class="container my-4 pb-6">
        <h2>重設密碼</h2>
        <h6 style="color: #c70000; font-weight: bold;">至少8字,上限為64字,需有大小寫英文,數字,特殊字元 (!@#$%^*)</h6>
        <form @submit.prevent="submitRestForm" class="mt-2">
            <div class=" col-4 mb-4">
                <label for="newpassword" class="form-label fs-5">新密碼</label>
                <input type="password" class="form-control" v-model="newPassword" name="newpassword"
                    placeholder="請輸入新密碼" minlength="8" maxlength="64" @blur="passwordCheck()" required />
                <span class="passwordMsg" v-if="passwordMsg.length > 0">{{ passwordMsg }}</span>
            </div>
            <div class="col-4 mb-4">
                <label for="checkpassword" class="form-label fs-5">確認新密碼</label>
                <input type="password" class="form-control" v-model="checkNewPassword" name="checkpassword"
                    placeholder="請再輸入新密碼" minlength="8" maxlength="64" @blur="confirmNewPassword()" required />
                <span class="password2Msg" v-if="password2Msg.length > 0">{{ password2Msg }}</span>
            </div>
            <div class="col-4 mt-2">
                <button type="submit" class="btn btn-primary text-white">重設密碼</button>
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