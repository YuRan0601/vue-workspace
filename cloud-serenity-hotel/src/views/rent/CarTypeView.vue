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
    <table class="table table-secondary">
      <thead>
        <tr>
          <th scope="col" class="text-center">車型圖片</th>
          <th scope="col" class="text-center">車型編號</th>
          <th scope="col" class="text-center">車輛型號</th>
          <th scope="col" class="text-center">品牌</th>
          <th scope="col" class="text-center">排氣量</th>
          <th scope="col" class="text-center">車輛總數</th>
          <th scope="col" class="text-center">車輛類型</th>
          <th scope="col" class="text-center">可使用車輛數</th>
          <th scope="col" class="text-center">查看</th>
        </tr>
      </thead>
      <tbody>
        <tr class="table-light" v-for="(car, index) in carData" :key="index">
          <td class="text-center align-middle" style="height: 70px">
            <!-- 顯示圖片 -->
            <img
              :src="getImageSrc(car.carModelId)"
              alt="車型圖片"
              class="car-image"
            />
          </td>
          <td class="text-center align-middle">{{ car.carModelId }}</td>
          <td class="text-center align-middle">{{ car.carModel }}</td>
          <td class="text-center align-middle">{{ car.brand }}</td>
          <td class="text-center align-middle">{{ car.engineDisplacement }}</td>
          <td class="text-center align-middle">{{ car.seatingCapacity }}</td>
          <td class="text-center align-middle">{{ car.carType }}</td>
          <td class="text-center align-middle">{{ car.totalVehicles }}</td>
          <td class="text-center align-middle">
            <RouterLink
              :to="{ name: 'carInfo', params: { id: car.carModelId } }"
            >
              <label class="btn btn-outline-secondary">查看</label>
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}

/* 為按鈕添加一些邊距與樣式 */
.btn {
  padding: 5px 15px; /* 調整按鈕內部邊距 */
  font-size: 14px; /* 按鈕文字大小 */
  border-radius: 5px; /* 按鈕圓角 */
  cursor: pointer;
}

.btn-outline-secondary {
  border: 1px solid #6c757d;
  color: #6c757d;
  background-color: white;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
}

/* 針對每一列的顯示，添加條件調整 */
tr:hover {
  background-color: #f1f1f1; /* 鼠標懸停顯示背景 */
}

/* 可選：為每個 cell 中的內容添加一些間距，使其更易讀 */
td {
  vertical-align: middle; /* 確保 td 內的文字垂直居中 */
  text-align: center; /* 確保文字水平居中 */
}

td.text-center {
  height: 20px; /* 設定容器高度，這樣才能看到居中的效果 */
  text-align: center; /* 文字水平居中 */
  justify-content: center;
  align-items: center;
}

/* 設定圖片樣式 */
img.car-image {
  width: 80px; /* 設定圖片寬度 */
  height: 70px; /* 設定圖片高度 */
  object-fit: cover; /* 確保圖片不會變形 */
  border-radius: 10px; /* 圓角邊框 */
  transition: transform 0.2s; /* 過渡效果，讓放大過程更平滑 */
  display: block; /* 這樣圖片本身會自動水平居中 */
  margin: 0 auto;
}

/* 設定懸停效果 */
img.car-image:hover {
  transform: scale(1.3); /* 當懸停時，圖片放大 1.1 倍 */
  cursor: pointer; /* 改變鼠標為點擊手勢 */
}

.car-image {
  display: block; /* 讓圖片成為區塊元素 */
  margin: 0 auto; /* 自動設置邊距來居中圖片 */
  width: 50px; /* 設定圖片寬度 */
  height: auto; /* 高度自動調整，保持圖片比例 */
  max-height: 50px; /* 限制圖片的最大高度，避免過大 */
}
</style>