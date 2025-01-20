<script setup>
import CarManage from '@/components/rent/CarManage.vue';
import CarTypeView from '@/views/rent/CarTypeView.vue';



</script>

<template>
    <div>
        <CarManage></CarManage>
        <CarTypeView></CarTypeView>
        <RouterView></RouterView>
    </div>
</template>

<style lang="css" scoped></style>