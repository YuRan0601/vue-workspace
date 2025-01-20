<script setup>

</script>

<template>
    <div>
        <h2>會員總覽</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto veritatis itaque iste harum ex eos totam
            eaque repellendus accusamus, quos id error accusantium molestiae fugiat, consequuntur velit ad nihil autem!
        </p>
        <div class="container">
            <div class="row ">
                <RouterLink class="col m-2 p-5 btn btn-light" :to="{ name: '' }">訂房</RouterLink>
                <RouterLink class="col m-2 p-5 btn btn-light" :to="{ name: '' }">訂單</RouterLink>
                <RouterLink class="col m-2 p-5 btn btn-light" :to="{ name: '' }">租車</RouterLink>
                <RouterLink class="col m-2 p-5 btn btn-light" :to="{ name: '' }">個人資料</RouterLink>
                <RouterLink class="col m-2 p-5 btn btn-light" :to="{ name: '' }">修改信箱與密碼</RouterLink>
                <a href="/api/user/logout" class="col m-2 p-5 btn btn-light">登出</a>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.icon {
    width: 80px;
    height: 80px;
}
</style>