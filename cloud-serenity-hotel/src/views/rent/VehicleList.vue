<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const carModels = ref([]); // 車型資料
const formData = ref([]);

const licensePlate = ref("");

const toUpperCase = () => {
  licensePlate.value.licensePlate =
    licensePlate.value.licensePlate.toUpperCase();
};

// 發送車型資料和車輛資料的請求
onMounted(async () => {
  try {
    // 並行發送兩個請求
    const [carResponse, detailsResponse] = await Promise.all([
      axios.get("/api/CarModel/queryAll"),
      axios.get("/api/CarDetails/queryAll"),
    ]);

    // 更新車型資料
    carModels.value = carResponse.data;
    console.log("車型資料已加載", carModels.value);

    // 更新車輛資料
    formData.value = detailsResponse.data;
    console.log("車輛資料已加載", formData.value);
  } catch (error) {
    console.error("Error fetching data:", error);
    Swal.fire({
      icon: "error",
      title: "資料載入失敗",
      text: "無法載入車輛資料或車型資料",
    });
  }
});

const getCarModelName = (carModelId) => {
  const carModel = carModels.value.find((model) => model.id === carModelId);
  return carModel ? carModel.carModel : "未知車型";
};

const getCarBrandName = (carModelId) => {
  const carModel = carModels.value.find((model) => model.id === carModelId);
  return carModel ? carModel.brand : "未知品牌";
};
</script>
<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">車輛編號</th>
          <th scope="col">車輛型號</th>
          <th scope="col">車輛品牌</th>
          <th scope="col">顏色</th>
          <th scope="col">狀態</th>
          <th scope="col">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="table-light" v-for="(car, index) in formData" :key="index">
          <td class="text-center align-middle">{{ car.carId }}</td>
          <!-- 根據 car.carModelId 查找對應的車型名稱 -->
          <!-- 車型名稱 -->
          <td class="text-center align-middle">
            {{ getCarModelName(car.carModelId) }}
          </td>
          <!-- 品牌名稱 -->
          <td class="text-center align-middle">
            {{ getCarBrandName(car.carModelId) }}
          </td>
          <td class="text-center align-middle">{{ car.colorOptions }}</td>
          <td class="text-center align-middle">{{ car.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* 表格樣式 */
.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.table th,
.table td {
  padding: 12px; /* 增加單元格的內邊距 */
  text-align: center; /* 讓文字置中 */
  border: 1px solid #ddd; /* 單元格邊框 */
  word-wrap: break-word; /* 防止長字串溢出 */
}

.table th {
  background-color: #f8f9fa; /* 表頭背景色 */
  font-weight: bold; /* 表頭文字加粗 */
  text-transform: uppercase; /* 表頭文字大寫 */
}

.table tbody tr:nth-child(odd) {
  background-color: #f9f9f9; /* 偶數行背景色 */
}

.table tbody tr:nth-child(even) {
  background-color: #fff; /* 奇數行背景色 */
}

.table tbody tr:hover {
  background-color: #f1f1f1; /* 鼠標懸停行的背景色 */
}

.table .text-center {
  text-align: center;
}

.table .align-middle {
  vertical-align: middle;
}
</style>