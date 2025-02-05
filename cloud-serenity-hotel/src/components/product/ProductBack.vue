<script setup>
</script>

<template>
    <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Cloud Serenity Hotel</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <RouterLink class="nav-link" :to="{ name: 'productAll' }">全部</RouterLink>
                        <RouterLink class="nav-link" :to="{ name: 'publicProductHome' }">上架</RouterLink>
                        <RouterLink class="nav-link" :to="{ name: 'hideProductHome' }">下架</RouterLink>
                    </div>
                </div>
            </div>
        </nav>
        <div class="container" >
            <RouterView></RouterView>
        </div>
    </div>
</template>

<style lang="css" scoped></style>