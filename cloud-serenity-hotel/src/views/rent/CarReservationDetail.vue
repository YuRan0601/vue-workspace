<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router"; // 引入 useRoute 來取得路由參數

// 預約資料
const reservation = ref({});

// 使用 useRoute 獲取 URL 中的 id 參數
const route = useRoute();
const reservationId = route.params.id; // 這裡從路由中獲取 `id`

// 預約資料API
onMounted(async () => {
  try {
    const response = await axios.get(
      `http://localhost:8080/CloudSerenityHotel/car-reservation/query/${reservationId}`
    );
    console.log(response.data);

    reservation.value = response.data.data;
  } catch (error) {
    console.error("無法取得預約資料", error);
  }
});

console.log(reservation.value.carUserInfo);
console.log(reservation.value.carRentalRecord);

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
          <td><strong>會員編號</strong></td>
          <td>{{ reservation.userId }}</td>
        </tr>
        <tr>
          <td><strong>身分證字號</strong></td>
          <td>{{ reservation.personalIdNo }}</td>
        </tr>
        <tr>
          <td><strong>姓名</strong></td>
          <td>{{ reservation.userName }}</td>
        </tr>
        <tr>
          <td><strong>車輛編號</strong></td>
          <td>{{ reservation.carId }}</td>
        </tr>
        <tr>
          <td><strong>車型</strong></td>
          <td>{{ reservation.rentalType }}</td>
        </tr>
        <tr>
          <td><strong>租借狀態</strong></td>
          <td>{{ reservation.rentalStatus }}</td>
        </tr>
        <tr>
          <td><strong>租借開始時間</strong></td>
          <td>{{ formatDate(reservation.createdAt) }}</td>
        </tr>
        <tr>
          <td><strong>租借結束時間</strong></td>
          <td>{{ formatDate(reservation.rentalEnd) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid #ddd;
}

th,
td {
  padding: 8px 20px;
  text-align: left;
}

th {
  background-color: #f8f9fa;
}

h2 {
  margin-bottom: 20px;
}
</style>