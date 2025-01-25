<script setup>
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { onMounted, ref, defineProps } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
console.log(route);

const carModelId = route.params.id; // 這就是從 URL 中提取的車輛 ID
const carId = route.params.carId; // 這就是從 URL 中提取的車輛 ID
const carModels = ref([]); // 車型資料
const formData = ref([]);

// 發送車型資料和車輛資料的請求
onMounted(async () => {
  try {
    // 發送車型資料請求
    const carResponse = await axios.get(
      `http://localhost:8080/CloudSerenityHotel/CarModel/queryOne/${carModelId}`
    );
    // 更新車型資料
    carModels.value = carResponse.data;
    console.log("車型資料已加載", carModels.value);
  } catch (error) {
    console.error("車型資料請求失敗:", error);
    Swal.fire({
      icon: "error",
      title: "車型資料載入失敗",
      text: "無法載入車型資料，請稍後再試",
    });
  }

  try {
    // 發送車輛資料請求
    const detailsResponse = await axios.get(
      `http://localhost:8080/CloudSerenityHotel/CarDetails/queryOne/${carId}`
    );
    // 更新車輛資料
    formData.value = detailsResponse.data;
    console.log("車輛資料已加載", formData.value);
  } catch (error) {
    console.error("車輛資料請求失敗:", error);
  }
});

const getCarModelName = (carModelId) => {
  const carModel = carModels.value.find(
    (model) => model.carModelId === carModelId
  );
  return carModel ? carModel.carModel : "未知車型";
};

const getCarBrandName = (carModelId) => {
  const carModel = carModels.value.find(
    (model) => model.carModelId === carModelId
  );
  return carModel ? carModel.brand : "未知品牌";
};
</script>
<template>
  <div>
    <div class="car-info-container">
      <h2 class="car-model">{{ formData.carModel }}</h2>
      <div class="car-info">
        <p><strong>車輛狀態：</strong>{{ formData.status }}</p>
        <p><strong>車型名稱：</strong>{{ carModels.carModel }}</p>
        <p><strong>車牌號碼：</strong>{{ formData.licensePlate }}</p>
        <p><strong>汽車年份：</strong>{{ formData.year }}</p>
        <p><strong>品牌：</strong>{{ carModels.brand }}</p>
        <p><strong>顏色：</strong>{{ formData.colorOptions }}</p>
        <p><strong>創建時間：</strong>{{ formData.createdAt }}</p>
        <p><strong>修改時間：</strong>{{ formData.updatedAt }}</p>
      </div>
      <div class="description-container">
        <p><strong>備註：</strong>{{ formData.remarks }}</p>
      </div>
    </div>
    <div>
      <button
        type="button"
        class="btn btn-outline-success hover-text-color ms-2"
        style="background-color: var(--bs-success-bg-subtle)"
      >
        <i class="bi bi-pencil-square icon-size"></i>
      </button>
      <button
        type="button"
        class="btn btn-danger hover-text-color ms-2"
        style="background-color: var(--bs-danger-border-subtle)"
      >
        <i class="bi bi-trash icon-size"></i>
      </button>
    </div>
    <div>
      <v-dialog v-model="dialogVisible" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">備註詳細</span>
          </v-card-title>
          <v-card-text>
            <p><strong>備註：</strong>{{ formData.remarks }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="closeDialog">關閉</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<style scoped>
.car-info-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
  box-shadow: 0 2px 10px rgba(203, 202, 202, 0.1);
}

.car-model {
  text-align: center;
  font-size: 28px;
  color: #333;
  margin-bottom: 15px;
  font-weight: bold;
}

.car-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 兩列並排 */
  gap: 20px; /* 每列間距 */
}

.car-info p {
  background-color: #fff;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.car-info p strong {
  color: #333;
  font-weight: bold;
}

.product-info {
  margin-top: 20px;
}

.product-info h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.product-info p {
  font-size: 16px;
}

.description-container {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 760px; /* 設定固定寬度 */
  margin: 20px auto;
}

/* 強化描述文字的樣式 */
.description-container p {
  font-size: 16px;
  color: #333;
  line-height: 1.6;
}

/* 設置強調文字的樣式 */
.description-container strong {
  font-weight: bold;
}

.hover-text-color {
  color: rgb(64, 56, 56);
  transition: color 0.3s ease, background-color 0.3s ease;
  border: none;
}

.hover-text-color:hover {
  color: black; /* 當鼠標移入時，文字顏色變為黑色 */
  background-color: rgb(68, 63, 63); /* 背景顏色改變 */
}

.hover-text-color:active {
  color: rgb(128, 128, 134); /* 當按鈕被點擊時，文字顏色變為藍色 */
}

.icon-size {
  font-size: 20px; /* 調整圖示大小為 30px */
}

/* 可選：改變鼠標懸停時的圖示大小 */
.icon-size:hover {
  font-size: 25px; /* 當鼠標移入時，圖示大小變為 35px */
}
</style>