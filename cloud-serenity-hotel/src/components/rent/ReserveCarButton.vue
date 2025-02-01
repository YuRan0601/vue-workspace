<script setup>
import { ref } from "vue";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
</script>
<template>
  <div class="search-container">
    <select class="search-select" @change="handleSelectChange">
      <option value="all">全部</option>
      <option value="category1">機車</option>
      <option value="category2">轎車</option>
      <option value="category3">休旅車</option>
    </select>

    <input type="text" class="search-input" placeholder="搜尋..." />
    <button class="search-btn">搜尋</button>
  </div>
</template>
  

<style scoped>
.search-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  gap: 10px; /* 讓搜尋框、下拉選單和按鈕之間有間距 */
  margin-top: 20px; /* 上方邊距 */
}

.search-input {
  padding: 10px 15px; /* 增加內邊距 */
  border-radius: 5px; /* 圓角邊框 */
  border: 1px solid #ccc; /* 輕微的邊框 */
  font-size: 16px; /* 字體大小 */
  width: 200px; /* 搜尋框寬度 */
}

.search-select {
  padding: 10px 15px; /* 下拉選單的內邊距 */
  border-radius: 5px; /* 圓角邊框 */
  border: 1px solid #ccc; /* 輕微的邊框 */
  font-size: 16px; /* 字體大小 */
  width: 80px; /* 設定下拉選單的寬度 */
  text-align: center;
}

.search-select option {
  text-align: center; /* 讓每個選項文字也水平居中 */
}

.search-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  gap: 10px; /* 搜尋框和按鈕間的間距 */
  margin-top: 20px; /* 上方邊距 */
}

.search-input {
  padding: 10px 15px; /* 增加內邊距 */
  border-radius: 5px; /* 圓角邊框 */
  border: 1px solid #ccc; /* 輕微的邊框 */
  font-size: 16px; /* 字體大小 */
  width: 250px; /* 設定搜尋框寬度 */
}

.search-btn {
  background-color: #a7a8a7; /* 綠色背景 */
  color: rgb(255, 255, 255); /* 文字顏色 */
  padding: 10px 20px; /* 按鈕內邊距 */
  border-radius: 5px; /* 圓角邊框 */
  border: none; /* 去掉按鈕邊框 */
  cursor: pointer; /* 滑鼠指標樣式 */
  font-size: 16px; /* 字體大小 */
  transition: background-color 0.3s; /* 平滑過渡效果 */
}

.search-btn:hover {
  background-color: #cbcecb; /* 滑鼠懸停時的顏色變化 */
}
</style>