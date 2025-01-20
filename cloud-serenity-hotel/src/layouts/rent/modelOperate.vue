<script setup>
  import carInfo from '@/views/rent/CarInfo.vue';
  import CarImage from '@/components/rent/CarImage.vue';

  defineProps({
    id:String
  })
  
</script>

<template>
  
  <div>
    <CarImage></CarImage>
    <carInfo></carInfo>
    
  </div>
  
</template>

<style scoped>
  
</style>