<template>
  <div>
    <div class="chart-container">
      <div class="chart-box bookingOrderCount">
        <h4>房型總數： {{ totalRoomTypeCount }} 種</h4>
        <h4>房間總數： {{ totalRoomCount }} 間</h4>
        <h4>訂房訂單總數： {{ totalBookingCount }} 筆</h4>
      </div>

      <div class="chart-box monthlyOrderCount">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Chart, registerables } from "chart.js";
import axiosInstance from "@/axios";

// 註冊所有 Chart.js 元件
Chart.register(...registerables);

// 綁定 canvas 元素
const chartCanvas = ref(null);
let chartInstance = null;
const totalBookingCount = ref(0);
const totalRoomCount = ref(0);
const totalRoomTypeCount = ref(0);

const getRoomTypeCount = async () => {
  const { data } = await axiosInstance.get("/room/total-room-type-count");
  totalRoomTypeCount.value = data;
};

const getRoomCount = async () => {
  const { data } = await axiosInstance.get("/room/total-room-count");
  totalRoomCount.value = data;
};

// 從後端 API 獲取月份訂房數據
const fetchMonthlyBookingData = async () => {
  try {
    const response = await axiosInstance.get("/booking/monthly-count");
    return response.data;
  } catch (error) {
    console.error("取得數據失敗：", error);
    return [];
  }
};

onMounted(async () => {
  getRoomCount();
  getRoomTypeCount();
  const monthlyData = await fetchMonthlyBookingData();

  // 反轉數據順序，讓最舊的月份在左邊
  monthlyData.reverse();

  const labels = monthlyData.map((item) => item.month);
  const dataCounts = monthlyData.map((item) => {
    totalBookingCount.value += item.bookingCount;
    return item.bookingCount;
  });

  if (chartCanvas.value) {
    chartInstance = new Chart(chartCanvas.value, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "近5個月訂房數",
            data: dataCounts,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "訂房數",
            },
          },
          x: {
            title: {
              display: true,
              text: "月份",
            },
          },
        },
      },
    });
  }
});

// 組件卸載時銷毀圖表實例，防止內存泄漏
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  display: flex; /* 使用 Flexbox 讓子元素並排 */
  justify-content: center; /* 讓內容置中 */
  align-items: center; /* 垂直置中 */
  gap: 20px; /* 兩個區塊間的間距 */
}

.chart-box {
  width: 500px; /* 統一寬度 */
  height: 400px; /* 統一高度 */
  background: #f9f9f9; /* 可選，設定背景 */
  border-radius: 10px; /* 圓角 */
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1); /* 增加陰影 */
}

.bookingOrderCount {
  padding: 30px;
}
</style>
