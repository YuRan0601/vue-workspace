<script setup>
import { useAuthStore } from "@/stores/authStore";
const useStores = useAuthStore()

function logout() {
    useStores.logout()
    window.location.href = '/front'
}
</script>

<template>
    <div>
        <h2>會員中心總覽</h2>
        <h5>歡迎來到會員中心！</h5>
        <h5>在這裡，您可以輕鬆管理您的個人資料、查詢訂單和預訂紀錄，並隨時查看您的租車和訂房狀況。</h5>
        <h5>透過下方的快速連結，您可以方便地進行操作!</h5>
        <div class="container">
            <div class="row row-col-3">
                <RouterLink class="function-card btn btn-light" :to="{ name: 'memberBookingOrder' }">
                    <v-icon class="fa-solid fa-hotel icon"></v-icon>
                    <h4 class="mt-2">訂房</h4>
                </RouterLink>
                <RouterLink class="function-card btn btn-light" :to="{ name: 'memberOrder' }">
                    <v-icon class="fa-solid fa-receipt icon"></v-icon>
                    <h4 class="mt-2">訂單</h4>
                </RouterLink>
                <RouterLink class="function-card btn btn-light" :to="{ name: '' }">
                    <v-icon class="fa-solid fa-car icon"></v-icon>
                    <h4 class="mt-2">租車</h4>
                </RouterLink>
                <RouterLink class="function-card btn btn-light" :to="{ name: 'memberInfo' }">
                    <v-icon class="fa-solid fa-circle-user icon"></v-icon>
                    <h4 class="mt-2">個人資料</h4>
                </RouterLink>
                <RouterLink class="function-card btn btn-light" :to="{ name: 'memberAccount' }">
                    <v-icon class="fa-solid fa-gears icon"></v-icon>
                    <h4 class="mt-2">修改密碼</h4>
                </RouterLink>
                <div class="function-card btn btn-light" @click="logout()">
                    <v-icon class="icon">mdi-logout</v-icon>
                    <h4 class="mt-2">登出</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.icon {
    font-size: 60px;
    margin: 10px;
}

.function-card {
    margin: 15px;
    width: 250px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgb(202, 202, 202);
}
</style>