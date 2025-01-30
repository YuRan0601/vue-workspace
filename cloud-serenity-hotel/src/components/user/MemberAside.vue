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
        <div class="aside flex-shrink-0 p-3 bg-white text-white" style="width: 280px">
            <ul class="list-unstyled ps-0">

                <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                        data-bs-target="#account-collapse" aria-expanded="false">
                        我的帳號
                    </button>
                    <div class="collapse" id="account-collapse">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li>
                                <RouterLink class="link-dark rounded" :to="{ name: 'memberOverview' }">總覽</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="link-dark rounded" :to="{ name: 'memberInfo' }">個人資料</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="link-dark rounded" :to="{ name: 'memberAccount' }">修改密碼
                                </RouterLink>
                            </li>
                        </ul>
                    </div>
                </li>

                <li class="border-top my-3"></li>

                <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                        data-bs-target="#booking-collapse" aria-expanded="false">
                        訂房
                    </button>
                    <div class="collapse" id="booking-collapse">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" class="link-dark rounded">New</a></li>
                        </ul>
                    </div>
                </li>

                <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                        data-bs-target="#order-collapse" aria-expanded="false">
                        訂單
                    </button>
                    <div class="collapse" id="order-collapse">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" class="link-dark rounded">New</a></li>
                        </ul>
                    </div>
                </li>

                <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                        data-bs-target="#rent-collapse" aria-expanded="false">
                        租車
                    </button>
                    <div class="collapse" id="rent-collapse">
                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" class="link-dark rounded">New</a></li>
                        </ul>
                    </div>
                </li>

                <div class="d-grid gap-2 mt-4 mx-auto"><a href="#" @click="logout()" class="btn btn-primary">登出帳號</a>
                </div>
            </ul>
        </div>
    </div>
</template>

<style lang="css" scoped>
@import url("/src/layouts/common/sidebars.css");


.aside {
    /* position: fixed; */
    left: 0;
    top: 55px;
    bottom: 0;
    overflow-y: auto;
}
</style>