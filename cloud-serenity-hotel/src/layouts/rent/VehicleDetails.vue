<script setup>
import VehicleList from "@/views/rent/VehicleList.vue";
import VehicleHeader from "@/components/rent/VehicleHeader.vue";
</script>
<template>
  <div>
    <VehicleHeader class="image" ></VehicleHeader>
    <VehicleList></VehicleList>
  </div>
</template>

<style scoped>
.image {
  justify-content: center;
  display: flex;
  align-items: center;
}
</style>