<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';

const headers = [
    { title: "使用者編號", key: 'userId' },
    { title: "使用者姓名", key: 'userName' },
    { title: "電子信箱", key: 'email' },
    // { title: "密碼", key: 'password' },
    { title: "使用狀態", key: 'userStatus', value: members => `${members.userStatus == 'In_use' ? '使用中' : '已註銷'}` },
    { title: "帳號更新時間", key: 'accountUpdateTime', value: members => `${members.accountUpdateTime.split(".")[0].replace("T", " ")}` },
    { text: '操作', value: 'action', sortable: false }
]

const members = ref([]);

onMounted(async () => {
    const { data } = await axios.get('/api/admin/queryAllMemberTojson');
    members.value = data.map(member => ({
        ...member,
        showPassword: false // 預設密碼不顯示
    }));
});

//重新載入資料
function reloadMembers() {
    axios.get('/api/admin/queryAllMemberTojson')
        .then((response) => {
            members.value = response.data.map(member => ({
                ...member,
                showPassword: false // 確保 showPassword 屬性正確初始化
            }));
        })
        .catch((error) => {
            console.error('重新載入會員資料失敗:', error);
            Swal.fire({
                title: '資料載入失敗',
                text: '無法重新載入會員資料，請稍後再試。',
                icon: 'error',
                allowOutsideClick: false
            });
        });
}

const togglePassword = (member) => {
    member.showPassword = !member.showPassword;
};

const getStatus = (member) => member.userStatus === 'In_use';

const memberData = ref({
    userId: '',
    userName: '',
    email: '',
    // password: '',
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



//編輯資料
const showEditModal = ref(false);
const editData = (member) => {
    showEditModal.value = true;
    memberData.value = { ...member };
};

//提交更新
const submitEditForm = () => {
    // 發送更新請求給後端
    axios.post('/api/admin/upDateMember', memberData.value)
        .then(function (response) {
            // 彈出成功提示
            Swal.fire({
                title: '更新成功',
                text: '會員資料已更新！',
                icon: 'success',
                allowOutsideClick: false
            });
            reloadMembers()
        })
        .catch(function (error) {
            Swal.fire({
                title: '更新失敗',
                text: '請稍後再試！',
                icon: 'error',
                allowOutsideClick: false
            });

        });
    showEditModal.value = false;  // 關閉對話框
};


//顯示詳細資料
const showModal = ref(false);
const showData = (member) => {
    showModal.value = true;
    memberData.value = { ...member };
};

//更新狀態
function editStatus(member) {
    let requestData = {
        userId: member.userId,
        userStatus: member.userStatus
    }
    // 發送請求給後端
    axios.post('/api/admin/statusLock', requestData)
        .then(function (response) {
            Swal.fire({
                title: '狀態更新成功',
                text: '該帳號的狀態已更改',
                icon: 'success',
                allowOutsideClick: false,
                confirmButtonText: '確定'

            }).then(() => {
                // 在彈窗關閉後重新載入表格
                reloadMembers();
            });
        })
        .catch(function (error) {
            Swal.fire({
                title: '狀態更新失敗',
                text: '請稍後再試！',
                icon: 'error',
                allowOutsideClick: false,
                confirmButtonText: '確定',
            });
        });
}

</script>

<template>
    <div class="container mt-4">
        <v-data-table :items="members" :headers="headers" item-value="userId">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>會員列表</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </template>

            <!-- <template v-slot:[`item.password`]="{ item }">
                <div class="d-flex align-center">
                    <span v-if="item.showPassword">{{ item.password }}</span>
                    <span v-else>{{ '*'.repeat(item.password.length) }}</span>
                    <v-icon class="ml-2" color="primary" size="small" @click="togglePassword(item)">
                        {{ item.showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                    </v-icon>
                </div>
            </template> -->


            <template v-slot:item.action="{ item }">

                <v-icon color="primary" size="x-large" @click="editData(item)">mdi-account-edit</v-icon>
                <span class="m-1"></span>
                <v-icon color="info" size="x-large" @click="showData(item)">mdi-card-account-details</v-icon>
                <span class="m-1"></span>
                <span v-if="getStatus(item)">
                    <v-icon color="danger" size="x-large" @click="editStatus(item)">mdi-account-off</v-icon>
                </span>
                <span v-else>
                    <v-icon color="success" size="x-large" @click="editStatus(item)">mdi-account</v-icon>
                </span>

            </template>
        </v-data-table>
    </div>

    <!-- v-dialog: 編輯會員對話框 -->
    <v-dialog v-model="showEditModal" max-width="800px">
        <v-card>
            <v-card-title>
                <span class="headline">編輯會員</span>
                <v-spacer></v-spacer>
            </v-card-title>
            <v-card-text>
                <v-form>
                    <!-- 隱藏的 ID 欄位 -->
                    <input type="hidden" v-model="memberData.userId" readonly>

                    <!-- 使用者基本資料 -->
                    <h5 class="mb-3">基本資料</h5>
                    <v-text-field v-model="memberData.userName" label="使用者姓名" required></v-text-field>
                    <v-text-field v-model="memberData.email" label="電子郵件" required></v-text-field>
                    <!-- <v-text-field v-model="memberData.password" label="密碼" type="password" required></v-text-field> -->

                    <!-- 會員詳細資料 -->
                    <h5 class="mt-4 mb-3">會員詳細資料</h5>
                    <v-select v-model="memberData.member.gender" :items="['Male', 'Female']" label="性別"
                        required></v-select>
                    <v-text-field v-model="memberData.member.birthday" label="生日" type="date" required></v-text-field>
                    <v-text-field v-model="memberData.member.phone" label="電話" required></v-text-field>
                    <v-text-field v-model="memberData.member.personalIdNo" label="身分證字號"></v-text-field>
                    <v-text-field v-model="memberData.member.country" label="國籍(國家三位字母代碼)" required></v-text-field>
                    <v-textarea v-model="memberData.member.address" label="地址" rows="2"></v-textarea>
                    <v-text-field v-model="memberData.member.passportNo" label="護照號碼"></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="submitEditForm">保存變更</v-btn>
                <v-btn color="error" @click="showEditModal = false">取消</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- 顯示詳細資料 -->
    <v-dialog v-model="showModal" max-width="800px">
        <v-card>
            <v-card-title>
                <span class="headline">會員詳細資料</span>
            </v-card-title>
            <v-card-text>
                <!-- 基本資料 -->
                <h5 class="mb-3">基本資料</h5>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="memberData.userName" label="使用者姓名" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="memberData.email" label="電子郵件" readonly></v-text-field>
                    </v-col>
                </v-row>

                <!-- 會員詳細資料 -->
                <h5 class="mt-4 mb-3">會員詳細資料</h5>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="memberData.member.gender" label="性別" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="memberData.member.birthday" label="生日" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="memberData.member.phone" label="電話" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="memberData.member.personalIdNo" label="身分證字號" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="memberData.member.country" label="國籍" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="memberData.member.passportNo" label="護照號碼" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="memberData.member.registerDate" label="註冊日期" readonly></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="memberData.member.dataUpdateTime" label="資料更新時間" readonly></v-text-field>
                    </v-col>
                </v-row>
                <h5 class="mt-4 mb-3">地址</h5>
                <v-textarea v-model="memberData.member.address" label="地址" readonly></v-textarea>
            </v-card-text>
            <v-card-actions class="justify-center">
                <v-btn @click="showModal = false" color="primary">關閉</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<style lang="css" scoped>
.headline {
    font-weight: bold;
}
</style>