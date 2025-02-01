<script setup>
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { onMounted, ref, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter(); // 取得路由對象
import axios from "axios";

defineProps({
  id: String,
});
const route = useRoute();
const carModelId = route.params.id; // 這就是從 URL 中提取的車輛 ID
const carModels = ref([]); // 車型資料

const showBookingDialog = () => {
  // 顯示 SweetAlert2 彈窗，要求用戶輸入訂房編號
  Swal.fire({
    title: "請輸入訂房編號",
    input: "text", // 這裡是輸入框
    inputPlaceholder: "輸入訂房編號...",
    showCancelButton: true,
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    inputValidator: (value) => {
      // 驗證是否填寫了訂房編號
      if (!value) {
        return "訂房編號是必填的！";
      }
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      // 用戶點擊「確認」，這裡可以處理訂房編號
      const orderId = result.value;
      console.log("訂房編號:", orderId);

      try {
        // 發送請求查詢訂單是否存在
        const response = await axios.get(
          `http://localhost:8080/CloudSerenityHotel/CarModel/UserDetailByOrderId/${orderId}`
        );

        if (response.data.bookingId) {
          // 訂單存在，跳轉到 RentalForm 頁面並傳遞訂房編號作為查詢參數
          router.push({
            name: "RentalForm",
            params: { id: carModelId }, // 假設 carModelId 作為 :id 路由參數傳遞
            query: { orderId }, // 訂房編號作為查詢參數
          });
        } else {
          // 訂單不存在，提示用戶
          Swal.fire({
            icon: "error",
            title: "訂單不存在",
            text: `未找到訂房編號 ${orderId} 的訂單，請確認後再試。`,
          });
        }
      } catch (error) {
        console.error("查詢訂單失敗:", error);
        Swal.fire({
          icon: "error",
          title: "查詢失敗",
          text: "無法查詢訂單，請稍後再試。",
        });
      }
    } else {
      // 用戶取消，這裡可以處理取消邏輯
      console.log("用戶取消了預約");
    }
  });
};

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
});
</script>
<template>
  <div>
    <div class="container">
      <div class="data-container">
        <h2><i class="bi bi-car-front-fill"></i>{{ carModels.carModel }}</h2>

        <!-- 表格開始 -->
        <table>
          <thead></thead>
          <tbody>
            <tr>
              <td>品牌</td>
              <td>{{ carModels.brand }}</td>
            </tr>
            <tr>
              <td>排氣量</td>
              <td>{{ carModels.engineDisplacement }}</td>
            </tr>
            <tr>
              <td>座位數量</td>
              <td>{{ carModels.seatingCapacity }}</td>
            </tr>
            <tr>
              <td>車輛類型</td>
              <td>{{ carModels.carType }}</td>
            </tr>
          </tbody>
        </table>
        <!-- 表格結束 -->
      </div>

      <button class="button-container" @click.prevent="showBookingDialog">
        立即預約
      </button>
    </div>
  </div>
</template>

<style scoped>
.data-container {
  font-family: "Arial", sans-serif; /* 設定整體字體 */
  color: #333; /* 字體顏色 */
  line-height: 1.6; /* 行高，讓文字不會太擠 */
}

.data-container h2 {
  font-size: 4rem; /* 設定 h2 標題字體大小 */
  font-weight: bold; /* 設定標題字體為粗體 */
  color: #2c3e50; /* 設定標題顏色 */
  margin-bottom: 10px; /* 設定標題和下一行間距 */
}

.data-container table {
  margin-right: 40px;
}

.data-container td {
  font-size: 2rem; /* 設定段落文字的字體大小 */
  color: #555; /* 設定段落文字顏色 */
  margin: 5px 0; /* 設定段落文字的上下間距 */
  padding: 10px;
  border-bottom: 1px solid #ddd; /* 增加底邊框，讓每行之間有區隔 */
  padding-right: 50px;
}

h2 i {
  margin-right: 130px; /* 在圖示右側添加 10px 的間距 */
}

.button-container {
  background-color: #656865; /* 按鈕背景顏色 */
  color: white; /* 按鈕文字顏色 */
  font-size: 18px; /* 增大字體大小 */
  font-weight: bold; /* 字體加粗 */
  border-radius: 8px; /* 圓角邊框 */
  padding: 15px 50px; /* 增加按鈕的內邊距，這會使按鈕變大 */
  transition: background-color 0.3s ease; /* 添加背景顏色過渡效果 */
  display: flex;
  justify-content: center; /* 讓文字在按鈕內居中 */
  align-items: center; /* 讓文字在按鈕內垂直居中 */
  margin-top: 50px; /* 向下移動50px */
  margin-left: 190px;
}
</style>