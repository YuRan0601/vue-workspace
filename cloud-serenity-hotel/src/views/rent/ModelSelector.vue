<script setup>
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import axios from "axios";

const carData = ref([]); //  存放車輛資料
const image = ref([]);

// 發送車型資料和圖片資料的 GET 請求
onMounted(async () => {
  try {
    // 並行發送兩個請求，一個是查詢車型資料，一個是查詢圖片資料
    const carResponse = await axios.get(
      "http://localhost:8080/CloudSerenityHotel/CarModel/queryAll"
    );
    // 更新車型資料
    carData.value = carResponse.data;
  } catch (error) {
    console.error("請求失敗:", error);
    Swal.fire("錯誤", "資料加載失敗，請稍後再試", "error"); // 彈出提示框顯示錯誤訊息
  }
  try {
    const imageResponse = await axios.get(
      "http://localhost:8080/CloudSerenityHotel/ImageCar/queryAll"
    );

    image.value = imageResponse.data; // 應該有這行來更新圖片資料
  } catch (error) {
    console.error("請求失敗:", error);
  }

  console.log("車型資料已加載");
  console.log(carData.value);
});

const getImageSrc = (carId) => {
  // 查找對應車型的圖片資料
  const carImage = image.value.find((img) => img.modelId === carId); // 假設每個圖片物件包含 modelId 和 base64Image

  if (carImage && carImage.base64Image) {
    const base64Str = carImage.base64Image;
    console.log("Base64 String (first 100 chars):", base64Str.slice(0, 100)); // 輸出前 100 個字元

    // 檢查 base64 字串的前綴來判斷圖片格式
    if (base64Str.startsWith("/9j/")) {
      // JPEG 格式
      return `data:image/jpeg;base64,${base64Str}`;
    } else if (base64Str.startsWith("iVBOR")) {
      // PNG 格式
      return `data:image/png;base64,${base64Str}`;
    } else {
      // 預設情況，假設是 JPEG
      return `data:image/jpeg;base64,${base64Str}`;
    }
  }
};
</script>
<template>
  <div>
    <div class="card-container">
      <div
        v-for="car in carData"
        :key="car.carModelId"
        class="card"
        style="width: 18rem"
      >
        <RouterLink
          :to="{ name: 'CarModelSearch', params: { id: car.carModelId } }"
        >
          <div>
            <img
              :src="getImageSrc(car.carModelId)"
              alt="車型圖片"
              class="car-image"
            />
            <div class="card-body">
              <h4>{{ car.carModel }}</h4>
              <h5>{{ car.brand }}</h5>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap; /* 允許卡片換行 */
  gap: 3rem; /* 卡片之間的間距 */
  justify-content: flex-start; /* 卡片從左邊開始排列 */
  padding: 5px;
  margin-left: auto; /* 使容器左邊距離自動 */
  margin-right: auto; /* 使容器右邊距離自動 */
  max-width: 1400px; /* 限制容器的最大寬度 */
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: scale(1.08); /* 向上漂浮並放大 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 增強陰影效果 */
}

.card img.car-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
}

.card-body {
  padding: 1rem;
  text-align: center;
}

.card-body h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #595d65;
  text-decoration: none; /* 隱藏底線 */
}

.card-body h5 {
  font-size: 1rem;
  color: #595d65;
  text-decoration: none; /* 隱藏底線 */
}

.card-body {
  display: inline-block; /* 如果需要確保 RouterLink 顯示為區塊元素，可以設定 */
  flex-direction: column; /* 使 h4 和 h5 垂直排列 */
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
  text-align: center; /* 使文字內部也居中 */
  height: 100%; /* 確保容器有足夠的高度 */
  margin-left: 90px;
}
</style>