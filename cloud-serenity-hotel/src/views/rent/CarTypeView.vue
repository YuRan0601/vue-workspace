<script setup>
  import Swal from 'sweetalert2';
  import { onMounted, ref } from 'vue';
  import axios from 'axios';
  
  const carData = ref([]); //  存放車輛資料

  //發送 GET 請求
  onMounted(async() =>{
    try{
      const response = await axios.get('/api/CarModel/queryAll')
      carData.value = response.data;
    } catch(error){
      console.error("Error fetching data:",error);
      Swal.fire({
        icon:'error',
        title:'資料載入失敗',
        text:'無法載入車輛資料',
      });
    }
    
    
  });
</script>
<template>
  <div>
    <table class="table table-secondary">
    <thead>
      <tr>
        <th scope="col" class="text-center">車型圖片</th>
        <th scope="col" class="text-center">車輛型號</th>
        <th scope="col" class="text-center">品牌</th>
        <th scope="col" class="text-center">排氣量</th>
        <th scope="col" class="text-center">車輛總數</th>
        <th scope="col" class="text-center">車輛類型</th>
        <th scope="col" class="text-center">可使用車輛數</th>
        <th scope="col" class="text-center">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr class="table-light" v-for="(car,index) in carData" :key="index">
        <td class="text-center">
            <img :src="car.image" alt="車型圖片" width="50" />
        </td>
        <td class="text-center">{{car.carModel}}</td>
        <td class="text-center">{{car.brand}}</td>
        <td class="text-center">{{car.engineDisplacement}}</td>
        <td class="text-center">{{car.seatingCapacity}}</td>
        <td class="text-center">{{car.carType}}</td>
        <td class="text-center">{{ car.availableCount }}</td>
        <td class="text-center">
          <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
            <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off">
            <label class="btn btn-outline-secondary" for="btncheck1">查看</label>
          </div>
      </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<style scoped>
  
</style>