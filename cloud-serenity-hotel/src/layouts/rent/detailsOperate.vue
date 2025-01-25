<script setup>
import CarImage from "@/components/rent/CarImage.vue";
import CarDetails from "@/views/rent/CarDetails.vue";

import { useRoute } from "vue-router";

const route = useRoute();
const carId = route.params.id; // 這就是從 URL 中提取的車輛 ID
const carModelId = route.params.carModelId; // 這就是從 URL 中提取的車輛 ID
</script>

<template>
  <div>
    <CarImage :id="carId" />
    <CarDetails :id="carModelId" />
  </div>
</template>

<style scoped>
</style>