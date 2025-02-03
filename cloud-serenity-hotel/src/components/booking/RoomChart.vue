<template>
  <div class="chart-container">
    <div class="chart-box">
      <canvas ref="roomTypeChart"></canvas>
    </div>
    <div class="chart-box">
      <canvas ref="bookingRateChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Chart, registerables } from "chart.js";
import axiosInstance from "@/axios";

Chart.register(...registerables);

const roomTypeChart = ref(null);
const bookingRateChart = ref(null);
let roomTypeChartInstance = null;
let bookingRateChartInstance = null;

// API 獲取房型房間數比例
const fetchRoomTypeData = async () => {
  try {
    const response = await axiosInstance.get("/room/type-count");
    return response.data;
  } catch (error) {
    console.error("獲取房型數據失敗", error);
    return [];
  }
};

// API 獲取房型訂房率
const fetchBookingRateData = async () => {
  try {
    const response = await axiosInstance.get("/room/booking-rate");
    return response.data;
  } catch (error) {
    console.error("獲取訂房率數據失敗", error);
    return [];
  }
};

onMounted(async () => {
  const roomTypeData = await fetchRoomTypeData();
  const bookingRateData = await fetchBookingRateData();

  const roomTypeLabels = roomTypeData.map((item) => item.type_name);
  const roomTypeCounts = roomTypeData.map((item) => item.room_count);

  const bookingRateLabels = bookingRateData.map((item) => item.type_name);
  const bookingRates = bookingRateData.map((item) => item.booking_rate);

  // 圓餅圖 - 房型房間數比例
  if (roomTypeChart.value) {
    roomTypeChartInstance = new Chart(roomTypeChart.value, {
      type: "pie",
      data: {
        labels: roomTypeLabels,
        datasets: [
          {
            label: "房型房間數比例",
            data: roomTypeCounts,
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  // 柱狀圖 - 房型訂房率
  if (bookingRateChart.value) {
    bookingRateChartInstance = new Chart(bookingRateChart.value, {
      type: "bar",
      data: {
        labels: bookingRateLabels,
        datasets: [
          {
            label: "訂房率 (%)",
            data: bookingRates,
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "訂房率 (%)",
            },
          },
          x: {
            title: {
              display: true,
              text: "房型",
            },
          },
        },
      },
    });
  }
});

// 組件卸載時銷毀圖表
onUnmounted(() => {
  if (roomTypeChartInstance) roomTypeChartInstance.destroy();
  if (bookingRateChartInstance) bookingRateChartInstance.destroy();
});
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.chart-box {
  width: 500px;
  height: 400px;
  background: #f9f9f9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
