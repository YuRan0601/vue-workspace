<script setup>

</script>

<template>
    <div>
        <h2>會員中心</h2>
        <span class="mx-2">
            <RouterLink :to="{ name: 'login' }">登入</RouterLink>
        </span>
        <span class="mx-2">
            <RouterLink :to="{ name: 'register' }">註冊</RouterLink>
        </span>
        <div class="container">
            <RouterView></RouterView>
        </div>

    </div>
</template>

<style lang="css" scoped></style>