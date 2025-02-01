<script setup>
import { ref } from "vue";
import CarReservation from "@/views/rent/CarReservation.vue";

import { useRoute } from "vue-router";

const route = useRoute();

// 從路由參數中獲取 carModelId
const carModelId = ref(route.params.id); // 從 URL 中提取 `id`
// 從查詢參數中獲取 bookingNumber
const orderId = ref(route.query.orderId);

// const carId = route.params.id; // 這就是從 URL 中提取的車輛 ID
</script>
<template>
  <div>
    <CarReservation :carModelId="carModelId" :orderId="orderId" />
  </div>
</template>

<style scoped>
</style>