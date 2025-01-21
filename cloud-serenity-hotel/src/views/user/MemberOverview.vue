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
        <h2>會員總覽</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto veritatis itaque iste harum ex eos totam
            eaque repellendus accusamus, quos id error accusantium molestiae fugiat, consequuntur velit ad nihil autem!
        </p>
        <div class="container">
            <div class="row row-col-3">
                <RouterLink class="function-card btn btn-light" :to="{ name: '' }">
                    <v-icon class=""></v-icon>
                    <h5>訂房</h5>
                </RouterLink>
                <RouterLink class="function-card btn btn-light" :to="{ name: '' }">
                    <v-icon class=""></v-icon>
                    <h5>訂單</h5>
                </RouterLink>
                <RouterLink class="function-card btn btn-light" :to="{ name: '' }">
                    <v-icon class=""></v-icon>
                    <h5>租車</h5>
                </RouterLink>
                <RouterLink class="function-card btn btn-light" :to="{ name: '' }">
                    <v-icon class=""></v-icon>
                    <h5>個人資料</h5>
                </RouterLink>
                <RouterLink class="function-card btn btn-light" :to="{ name: '' }">
                    <v-icon class="fa-solid fa-gears fa-2xl icon"></v-icon>
                    <h5>修改信箱與密碼</h5>
                </RouterLink>
                <div class="function-card btn btn-light" @click="logout()">
                    <v-icon class=""></v-icon>
                    <h5>登出</h5>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.icon {
    font-size: 50px;
    margin: 5px;
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