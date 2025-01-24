<script setup>
import MemberAside from '@/components/user/MemberAside.vue';


</script>

<template>
    <div class="row">
        <!-- <h2 class="text-center bg-light">會員中心</h2> -->
        <div class="row">
            <div class="col-auto">
                <MemberAside></MemberAside>
            </div>
            <div class="col border-start">
                <div class="container mt-4">
                    <RouterView></RouterView>
                </div>
            </div>

        </div>
    </div>
</template>

<style lang="css" scoped></style>