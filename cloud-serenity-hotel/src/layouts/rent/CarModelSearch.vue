<script setup>
import ModelDetail from "@/views/rent/ModelDetail.vue";
import CarImage from "@/components/rent/CarImage.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const carId = route.params.id; // 這就是從 URL 中提取的車輛 ID
console.log(carId);
</script>
<template>
  <div>
    <div>
      <div class="row centered-row">
        <div class="col-sm-7"><CarImage :id="carId" style="width: 800px;"/></div>
        <div class="col-sm-4 adjusted-position">
          <ModelDetail :id="carId" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.centered-row {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 100%; /* 讓容器寬度填滿父容器 */
  margin-top: 50px; /* 向下移動 50px */
  margin-left: 100px;
}

.adjusted-position {
  margin-left: -100px; /* 向右移動 20px */
  /* margin-top: -500px; 向上移動 20px */
}
</style>