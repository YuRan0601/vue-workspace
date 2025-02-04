<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRoute } from "vue-router"; // 引入 useRoute 來取得路由參數

// 預約資料
const reservation = ref({});
const carRentalRecord = ref([]); // 儲存車輛租賃記錄
const carUserInfo = ref([]); // 儲存使用者資訊

// 使用 useRoute 獲取 URL 中的 id 參數
const route = useRoute();
const reservationId = route.params.id; // 這裡從路由中獲取 `id`
console.log("reservationId = ", reservationId);

// 預約資料API
onMounted(async () => {
  try {
    const response = await axios.get(
      `http://localhost:8080/CloudSerenityHotel/car-reservation/query/${reservationId}`
    );
    console.log(response.data);
    reservation.value = response.data.data;
    carRentalRecord.value = reservation.value.carRentalRecord;
    carUserInfo.value = reservation.value.carUserInfo;

    console.log("carRentalRecord = ", carRentalRecord.value);
    console.log("carUserInfo = ", carUserInfo.value);
  } catch (error) {
    console.error("無法取得預約資料", error);
  }
});

const statusMap = {
  RENTED: "租借中",
  RESERVED: "已預約",
  AVAILABLE: "可租用",
};

const getStatusClass = (status) => {
  // 根據英文狀態轉換為對應的中文顯示
  const statusText = statusMap[status] || status; // 如果沒有對應的英文狀態，則顯示原始狀態

  let statusClass = "";
  if (status === "可租用") {
    statusClass = "status-available";
  } else if (status === "已預約") {
    statusClass = "status-booked";
  } else if (status === "租借中") {
    statusClass = "status-rented";
  }

  return { statusText, statusClass }; // 返回轉換後的狀態顯示字串和對應的 CSS 類別
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString.replace(" ", "T"));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, "0");

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;

  return `${year}-${month}-${day} ${hour}:${minute} ${ampm}`;
};

const confirmReservation = async () => {
  try {
    const response = await axios.post(
      `http://localhost:8080/CloudSerenityHotel/car-reservation/update/rented/${reservationId}`
    );
    if (response.data.status === "SUCCESS") {
      // 使用 SweetAlert2 顯示成功訊息
      Swal.fire({
        icon: "success",
        title: "取車成功！",
        text: "您的租車已經確認，請準備取車。",
        confirmButtonText: "確定",
      }).then(() => {
        // 成功後刷新頁面
        location.reload(); // 這行會刷新頁面
      });
    } else {
      // 使用 SweetAlert2 顯示錯誤訊息
      Swal.fire({
        icon: "error",
        title: "取車失敗！",
        text: "很抱歉，取車失敗，請稍後再試。",
        confirmButtonText: "確定",
      });
    }
  } catch (error) {
    console.error("取車失敗", error);
    // 使用 SweetAlert2 顯示錯誤訊息
    Swal.fire({
      icon: "error",
      title: "取車失敗！",
      text: "系統發生錯誤，請稍後再試。",
      confirmButtonText: "確定",
    });
  }
};
const cancelReservation = async () => {
  try {
    const response = await axios.post(
      `http://localhost:8080/CloudSerenityHotel/car-reservation/update/available/${reservationId}`
    );

    if (response.data.status === "SUCCESS") {
      // 使用 SweetAlert2 顯示成功訊息
      Swal.fire({
        icon: "success",
        title: "還車成功！",
        text: "您的還車已經確認，感謝您的租用。",
        confirmButtonText: "確定",
      }).then(() => {
        // 可以在這裡跳轉頁面，或者進一步處理
        location.reload(); // 這行會刷新頁面
      });
    } else {
      // 使用 SweetAlert2 顯示錯誤訊息
      Swal.fire({
        icon: "error",
        title: "還車失敗",
        text: "還車過程中發生錯誤，請稍後再試。",
        confirmButtonText: "確定",
      });
    }
  } catch (error) {
    console.error("還車失敗", error);
    // 使用 SweetAlert2 顯示錯誤訊息
    Swal.fire({
      icon: "error",
      title: "還車失敗！",
      text: "系統發生錯誤，請稍後再試。",
      confirmButtonText: "確定",
    });
  }
};
</script>

<template>
  <div class="container mt-4">
    <h2>租車預約詳細資料</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">欄位</th>
          <th scope="col">詳細資料</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>訂單編號</strong></td>
          <td>{{ reservationId }}</td>
        </tr>
        <tr>
          <td><strong>租借開始時間</strong></td>
          <td>{{ formatDate(carRentalRecord.createdAt) }}</td>
        </tr>
        <tr>
          <td><strong>租借結束時間</strong></td>
          <td>{{ formatDate(carRentalRecord.rentalEnd) }}</td>
        </tr>
        <tr>
          <td><strong>使用者姓名</strong></td>
          <td>{{ carUserInfo.userName }}</td>
        </tr>
        <tr>
          <td><strong>身分證字號</strong></td>
          <td>{{ carUserInfo.personalIdNo }}</td>
        </tr>

        <tr>
          <td><strong>車輛編號</strong></td>
          <td>{{ carRentalRecord.carId }}</td>
        </tr>
        <tr>
          <td><strong>車輛大小</strong></td>
          <td>{{ carRentalRecord.rentalSize }}</td>
        </tr>
        <tr>
          <td><strong>車輛類型</strong></td>
          <td>{{ carRentalRecord.rentalType }}</td>
        </tr>

        <tr>
          <td><strong>租借狀態</strong></td>
          <td :class="getStatusClass(carRentalRecord.rentalStatus).statusClass">
            {{ getStatusClass(carRentalRecord.rentalStatus).statusText }}
          </td>
        </tr>

        <tr>
          <td><strong>訂單創建時間</strong></td>
          <td>{{ formatDate(carRentalRecord.rentalStart) }}</td>
        </tr>
        <tr>
          <td><strong>訂單結束時間</strong></td>
          <td>{{ formatDate(carRentalRecord.updatedAt) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4">
      <button class="btn btn-success me-3" @click="confirmReservation">
        取車
      </button>
      <button class="btn btn-danger" @click="cancelReservation">還車</button>
    </div>
  </div>
</template>

<style scoped>
/* 整體容器樣式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 表格樣式 */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid #ddd;
}

.table th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: bold;
}

.table td {
  background-color: #ffffff;
}

.table-striped tbody tr:nth-child(odd) {
  background-color: #f2f2f2;
}

.table td strong {
  color: #333;
}

/* 標題樣式 */
h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

/* 按鈕樣式 */
button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  opacity: 0.9;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

/* 文字顏色狀態標籤 */
.status-available {
  color: green;
}

.status-booked {
  color: orange;
}

.status-rented {
  color: red;
}

/* 用於調整表格內部內容排版 */
td {
  vertical-align: middle;
}

/* 邊距調整 */
.mt-4 {
  margin-top: 2rem;
}

.me-3 {
  margin-right: 1rem;
}
</style>