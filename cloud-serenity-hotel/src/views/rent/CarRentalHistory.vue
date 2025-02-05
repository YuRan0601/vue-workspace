<script setup>
import { ref, onMounted, nextTick } from "vue"; // 確保導入 ref 和 onMounted
import axios from "axios";

const reser = ref([]); // 訂單資料
const searchQuery = ref("");

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

const reservedReservations = ref([]);
const rentedReservations = ref([]);
const routeName = ref("CarRentalHistory"); // 用來跟蹤當前顯示的是哪一個表格

const handleClick = async (route) => {
  routeName.value = route; // 根據選擇的路由切換顯示

  try {
    let response;
    if (route === "CarRentalHistory") {
      response = await axios.get(
        "http://localhost:8080/CloudSerenityHotel/car-reservation/query-all/reserved"
      );
      reser.value = response.data.data; // 預約中的資料
    } else if (route === "CarRentalHistoryRenthd") {
      response = await axios.get(
        "http://localhost:8080/CloudSerenityHotel/car-reservation/query-all/rented"
      );
      reser.value = response.data.data; // 租借中的資料
    }

    if (response && response.data.status === "SUCCESS") {
      console.log("請求成功", response.data);
    } else {
      console.log("請求失敗", response.data);
    }
  } catch (error) {
    console.error("請求錯誤", error);
  }
};
const reservation = ref({});

const handleSearch = async (event) => {
  event.preventDefault(); // 阻止表單提交的默認行為

  if (!searchQuery.value) {
    console.log("請輸入查詢內容");
    return; // 若沒有輸入查詢內容，直接返回
  }

  try {
    // 發送請求
    const response = await axios.get(
      `http://localhost:8080/CloudSerenityHotel/car-reservation/query/list/${searchQuery.value}`
    );
    console.log(response);

    // 更新 reservedReservations 的資料
    reser.value = response.data.data;
    // reservation.value = response.data.data;
    // console.log(reservation.value.carRentalRecord);

    // reser.value = reservation.value.carRentalRecord;
    // console.log(reser.value);

    console.log("搜尋結果:", reser.value);
  } catch (error) {
    console.error("搜尋請求失敗:", error);
  }
};
</script>

<template>
  <div>
    <div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">租車預約管理</a>

          <div>
            <form class="d-flex ms-auto align-items-center">
              <!-- 調整長寬的輸入框 -->
              <input
                class="form-control me-2 search-input"
                type="search"
                placeholder="搜尋..."
                aria-label="Search"
                v-model="searchQuery"
              />
              <!-- 查詢按鈕 -->
              <button
                class="btn btn-outline-success search-button"
                type="submit"
                @click="handleSearch"
              >
                查詢
              </button>
            </form>
          </div>
          <div class="btn-group mb-4" role="group" aria-label="Rental Status">
            <button
              class="btn btn-primary"
              @click="handleClick('CarRentalHistory')"
            >
              預約中
            </button>
            <button
              class="btn btn-danger"
              @click="handleClick('CarRentalHistoryRenthd')"
            >
              租借中
            </button>
          </div>
        </div>
      </nav>
    </div>
    <!-- 按鈕選擇區 -->

    <!-- 預約中訂單的表格 -->
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
          <td>{{ formatDate(reservation.rentalStart) }}</td>
          <td>{{ formatDate(reservation.rentalEnd) }}</td>
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
/* 使表單元素靠右對齊 */
.d-flex {
  justify-content: flex-end;
  width: 100%; /* 讓表單佔滿整個區域 */
}

/* 自定義輸入框長寬 */
.search-input {
  width: 300px; /* 調整寬度為 300px */
  height: 38px; /* 調整高度 */
}

/* 自定義按鈕長寬 */
.search-button {
  height: 38px; /* 讓按鈕與輸入框同高 */
  padding-left: 18px;
  padding-right: 18px;
}

/* 如果需要更高級的樣式，可以加些細節 */
.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

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