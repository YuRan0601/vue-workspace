<script setup>
import { ref, onMounted } from "vue"; // 確保導入 ref 和 onMounted
import axios from "axios";

const reser = ref([]); // 訂單資料

onMounted(async () => {
  try {
    // 發送訂單資料請求
    const reserResponse = await axios.get(
      "http://localhost:8080/CloudSerenityHotel/car-reservation/query-all/reserved"
    );
    reser.value = reserResponse.data.data;
    console.log("訂單資料已加載", reser.value);
  } catch (error) {
    console.error("訂單資料請求失敗:", error);
  }
});

const formatDate = (dateString) => {
  if (!dateString) return "";

  // 轉換為 Date 對象，假設日期格式為 "yyyy-MM-dd HH:mm"
  const date = new Date(dateString.replace(" ", "T")); // 兼容 ISO 8601 格式

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // 12小時制
  let hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, "0");

  // 判斷 AM 或 PM
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12; // 將24小時制轉換為12小時制
  hour = hour ? hour : 12; // 小時為0時顯示為12

  return `${year}-${month}-${day} ${hour}:${minute} ${ampm}`;
};

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
</script>

<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">訂單編號</th>
          <th scope="col">車輛編號</th>
          <th scope="col">車輛狀態</th>
          <th scope="col">開始時間</th>
          <th scope="col">結束時間</th>
          <th scope="col">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(reservation, index) in reser" :key="index">
          <td>{{ reservation.id }}</td>
          <td>{{ reservation.carId }}</td>
          <td
            class="text-center align-middle"
            :class="getStatusClass(reservation.rentalStatus).statusClass"
          >
            {{ getStatusClass(reservation.rentalStatus).statusText }}
          </td>
          <!-- 使用 rentalStatus -->
          <td>{{ formatDate(reservation.rentalStart) }}</td>
          <!-- 格式化時間 -->
          <td>{{ formatDate(reservation.rentalEnd) }}</td>
          <!-- 格式化時間 -->
          <td class="text-center align-middle">
            <RouterLink
              :to="{
                name: 'CarReservationDetail',
                params: { id: reservation.id },
              }"
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
.status-available {
  color: black;
}

.status-booked {
  color: green;
}

.status-rented {
  color: red;
}

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