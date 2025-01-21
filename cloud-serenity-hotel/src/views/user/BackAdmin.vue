<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';

const headers = [
    { title: "使用者編號", key: 'userId' },
    { title: "使用者姓名", key: 'userName' },
    { title: "電子信箱", key: 'email' },
    { title: "密碼", key: 'password' },
    { title: "使用狀態", key: 'userStatus', value: admins => `${admins.userStatus == 'In_use' ? '使用中' : '已註銷'}` },
    { title: "帳號更新時間", key: 'accountUpdateTime', value: admins => `${admins.accountUpdateTime.split(".")[0].replace("T", " ")}` },
    { text: '操作', value: 'action', sortable: false }
]

const admins = ref([]);

onMounted(async () => {
    const { data } = await axios.get('/api/admin/queryAllAdminTojson');
    admins.value = data.map(admin => ({
        ...admin,
        showPassword: false // 預設密碼不顯示
    }));
});

//重新載入資料
function reloadAdmins() {
    axios.get('/api/admin/queryAllAdminTojson')
        .then((response) => {
            admins.value = response.data.map(admin => ({
                ...admin,
                showPassword: false // 確保 showPassword 屬性正確初始化
            }));
        })
        .catch((error) => {
            console.error('重新載入管理員資料失敗:', error);
            Swal.fire({
                title: '資料載入失敗',
                text: '無法重新載入管理員資料，請稍後再試。',
                icon: 'error',
                allowOutsideClick: false
            });
        });
}

const togglePassword = (admin) => {
    admin.showPassword = !admin.showPassword;
};

const getStatus = (admin) => admin.userStatus === 'In_use';

const showAddModal = ref(false);
// 開啟對話框
function addAdmin() {
    showAddModal.value = true;
}

const addAdminData = ref({
    userName: '',
    email: '',
    password: ''
});

// 提交表單
const submitAddForm = () => {
    //post給後端API
    axios.post('/api/admin/addAdmin', addAdminData.value)
        .then(function (response) {
            Swal.fire({
                title: "新增管理員成功",
                icon: "success",
                allowOutsideClick: false
            });
            addAdminData.value = '';
            reloadAdmins()
        })
        .catch(function (error) {
            Swal.fire({
                title: "新增管理員失敗",
                text: "請稍後再試!",
                icon: "error",
                allowOutsideClick: false
            });
        });
    showAddModal.value = false;
}

const showEditModal = ref(false);  // 控制 v-dialog 顯示
// 預設的編輯資料
const editAdminData = ref({
    userId: '',
    userName: '',
    email: '',
    password: ''
});

// 開啟對話框並載入資料
const editData = (admin) => {
    showEditModal.value = true;
    editAdminData.value = { ...admin };  // 載入選中的管理員資料
};

// 提交表單
const submitEditForm = () => {
    // 發送更新請求給後端
    axios.post('/api/admin/upDateAdmin', editAdminData.value)
        .then(function (response) {
            // 彈出成功提示
            Swal.fire({
                title: '更新成功',
                text: '管理員資料已更新！',
                icon: 'success',
                allowOutsideClick: false
            });
            reloadAdmins()
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

//更新狀態
function editStatus(admin) {
    let requestData = {
        userId: admin.userId,
        userStatus: admin.userStatus
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
                reloadAdmins();
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
        <v-data-table :items="admins" :headers="headers" item-value="userId">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>管理員列表</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="addAdmin()">
                        <v-icon size="x-large">mdi-account-plus</v-icon>
                        <span class="pl-2">新增管理員</span>
                    </v-btn>
                </v-toolbar>
            </template>

            <template v-slot:[`item.password`]="{ item }">
                <div class="d-flex align-center">
                    <span v-if="item.showPassword">{{ item.password }}</span>
                    <span v-else>{{ '*'.repeat(item.password.length) }}</span>
                    <v-icon class="ml-2" color="primary" size="small" @click="togglePassword(item)">
                        {{ item.showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                    </v-icon>
                </div>
            </template>


            <template v-slot:item.action="{ item }">

                <v-icon color="primary" size="x-large" @click="editData(item)">mdi-account-edit</v-icon>
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

    <!-- v-dialog 編輯管理員對話框 -->
    <v-dialog v-model="showEditModal" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">編輯管理員</span>
            </v-card-title>
            <v-card-text>
                <v-form @submit.prevent="submitEditForm">
                    <v-text-field v-model="editAdminData.userName" label="使用者姓名" required></v-text-field>
                    <v-text-field v-model="editAdminData.email" label="電子郵件" required></v-text-field>
                    <v-text-field v-model="editAdminData.password" label="密碼" type="password" required></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="showEditModal = false" text>取消</v-btn>
                <v-btn @click="submitEditForm" color="primary">保存變更</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- v-dialog 新增管理員 -->
    <v-dialog v-model="showAddModal" max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">新增管理員</span>
            </v-card-title>
            <v-card-subtitle>
                <v-form @submit.prevent="submitAddForm">
                    <v-text-field v-model="addAdminData.userName" label="使用者姓名" name="userName" required></v-text-field>
                    <v-text-field v-model="addAdminData.password" label="密碼" type="password" name="password"
                        required></v-text-field>
                    <v-text-field v-model="addAdminData.email" label="電子郵件" type="email" name="email"
                        required></v-text-field>
                </v-form>
            </v-card-subtitle>
            <v-card-actions>
                <v-btn text @click="showAddModal = false">取消</v-btn>
                <v-btn color="primary" @click="submitAddForm">送出</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<style lang="css" scoped></style>