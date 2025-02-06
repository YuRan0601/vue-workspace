<script setup>
import { useAuthStore } from "@/stores/authStore";
const useStores = useAuthStore()
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';

const isEdit = ref(false)
const formRef = ref(null)

const rules = {
    required: (v) => !!v || '此欄位為必填',
    taiwanID: (v) => validateTaiwanID(v) || '身分證字號錯誤'
};

const memberData = ref({
    userId: '',
    userName: '',
    email: '',
    member: {
        gender: '',
        birthday: '',
        phone: '',
        personalIdNo: '',
        country: '',
        address: '',
        passportNo: '',
        registerDate: '',
        dataUpdateTime: ''
    }
});
async function getMemberInfo() {
    const { data } = await axios.get(`/api/member/${useStores.user.userId}`);
    if (data == '') {
        console.error('No Member Data');

    } else {
        memberData.value = data;
    }
}



async function submitEditForm() {
    //驗證整個表單是否通過欄位規則
    const { valid } = await formRef.value.validate();

    if (valid) {
        axios.post('/api/member/updateData', memberData.value)
            .then(function (response) {
                // 彈出成功提示
                Swal.fire({
                    title: '更新成功',
                    text: '會員資料已更新！',
                    icon: 'success',
                    allowOutsideClick: false
                });
                getMemberInfo()
                isEdit.value = false
            })
            .catch(function (error) {
                Swal.fire({
                    title: '更新失敗',
                    text: '請稍後再試！',
                    icon: 'error',
                    allowOutsideClick: false
                });

            });

    } else {
        Swal.fire({
            title: '更新失敗',
            text: '請檢查表單內容!',
            icon: 'error',
            allowOutsideClick: false
        });
        cancelEdit()
    }

}

function cancelEdit() {
    isEdit.value = false
    getMemberInfo()
}

onMounted(() => {
    getMemberInfo()
})

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
    <div>
        <h2 class="mb-2">個人資料</h2>

        <v-form ref="formRef" style="width: 40vw;">
            <!-- 隱藏的 ID 欄位 -->
            <input type="hidden" v-model="memberData.userId" readonly>

            <!-- 使用者基本資料 -->
            <v-row align="center" style="height: 80px;">
                <v-col cols="6">
                    <h5 class="mb-3">基本資料</h5>
                </v-col>
                <v-col cols="6" class="d-flex justify-end">
                    <v-switch v-model="isEdit" color="primary" label="編輯模式"></v-switch>
                </v-col>
            </v-row>
            <v-text-field v-model="memberData.userName" label="使用者姓名" :readonly="!isEdit"
                :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="memberData.email" label="電子郵件" :readonly="!isEdit"
                :rules="[rules.required]"></v-text-field>

            <!-- 會員詳細資料 -->
            <h5 class="mt-4 mb-3">會員詳細資料</h5>
            <v-select v-model="memberData.member.gender" :items="['Male', 'Female']" label="性別" :disabled="!isEdit"
                :rules="[rules.required]"></v-select>
            <v-text-field v-model="memberData.member.birthday" label="生日" type="date" :readonly="!isEdit"
                :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="memberData.member.phone" label="電話" :readonly="!isEdit"
                :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="memberData.member.personalIdNo" label="身分證字號"
                :rules="[rules.taiwanID, rules.required]" :readonly="!isEdit"></v-text-field>
            <v-text-field v-model="memberData.member.country" label="國籍(國家三位字母代碼)" :readonly="!isEdit"
                :rules="[rules.required]"></v-text-field>
            <v-textarea v-model="memberData.member.address" label="地址" rows="2" :readonly="!isEdit"></v-textarea>
            <v-text-field v-model="memberData.member.passportNo" label="護照號碼" :readonly="!isEdit"></v-text-field>
        </v-form>
        <div v-show="isEdit" class="mb-4">
            <v-btn color="primary" @click="submitEditForm">保存變更</v-btn>
            <span class="mx-2"></span>
            <v-btn color="error" @click="cancelEdit">取消</v-btn>
        </div>
    </div>
</template>

<style lang="css" scoped></style>