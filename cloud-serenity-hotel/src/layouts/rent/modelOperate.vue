<script setup>
import carInfo from "@/views/rent/CarInfo.vue";
import CarImage from "@/components/rent/CarImage.vue";

defineProps({
  id: String,
});
</script>

<template>
  <div>
    <CarImage :id="id" class="image" />
    <carInfo></carInfo>
  </div>
</template>

<style scoped>
.image {
  justify-content: center;
  display: flex;
  align-items: center;
}
</style>