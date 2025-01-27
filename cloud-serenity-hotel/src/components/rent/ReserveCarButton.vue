<script setup>
import { ref } from "vue";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

const pickupDate = ref("");
const returnDate = ref("");

const dateRule = (value) => {
  return (value && !isNaN(new Date(value))) || "請選擇有效的日期";
};

// 處理預約的事件
const handleReserve = () => {
  if (pickupDate.value && returnDate.value) {
    console.log(
      `預約成功！取車時間: ${pickupDate.value}, 還車時間: ${returnDate.value}`
    );
  } else {
    console.error("請選擇取車和還車時間");
  }
};
</script>
<template>
  <div class="reservation-container">
    <div class="button-container">
      <v-defaults-provider>
        <v-btn @click="handleReserve">立即預約</v-btn>
      </v-defaults-provider>
    </div>
  </div>
</template>
  

<style scoped>
/* 整體容器設置，讓容器寬度與頁面同寬 */
.reservation-container {
  display: flex;
  flex-direction: row; /* 讓欄位橫向排列 */
  justify-content: flex-end; /* 所有元素向右對齊 */
  align-items: center; /* 垂直居中 */
  width: 100%; /* 設置容器寬度為頁面寬度 */
  padding: 20px;
  border: 1px solid #ffffff;
  background-color: #ffffff;
}

.reservation-container label {
  font-family: "Arial", sans-serif;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  display: block;
  text-align: left;
}

.date-input {
  width: 100%; /* 寬度為100%，讓它適應父容器的寬度 */
  max-width: 300px; /* 最大寬度為300px，防止過寬 */
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

/* 單個欄位的樣式 */
.form-group {
  width: 300px; /* 固定寬度 */
  margin-right: 20px; /* 欄位之間的間距 */
  position: relative; /* 啟用相對定位 */
  left: -50px; /* 向左移動20px，可以調整這個值 */
}

label {
  font-size: 14px;
  margin-bottom: 8px;
  display: block;
}

.date-input {
  width: 100%; /* 設定日期選擇器寬度為欄位的100% */
  padding: 10px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

/* 按鈕容器 */
.button-container {
  display: flex;
  justify-content: flex-start; /* 讓按鈕靠左 */
  align-items: center; /* 垂直居中按鈕 */
  margin-top: 30px; /* 向下移動50px */
  margin-right: 25px;
  padding: 10px 10px; /* 內邊距，左右增加一些間距 */
}

.v-btn {
  background-color: #656865; /* 按鈕背景顏色 */
  color: white; /* 按鈕文字顏色 */
  font-size: 18px; /* 增大字體大小 */
  font-weight: bold; /* 字體加粗 */
  border-radius: 8px; /* 圓角邊框 */
  padding: 23px 50px; /* 增加按鈕的內邊距，這會使按鈕變大 */
  transition: background-color 0.3s ease; /* 添加背景顏色過渡效果 */
  display: flex;
  justify-content: center; /* 讓文字在按鈕內居中 */
  align-items: center; /* 讓文字在按鈕內垂直居中 */
}
</style>