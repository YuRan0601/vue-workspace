<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goToAllProducts() {
  router.push({ name: 'productShopping' })
}
</script>

<template>
  
    <div class="header">
    <div class="bg"></div>
      <div class="text-container">
        <h1 class="title">伴手禮商城</h1>
        <h4 class="subtitle">購買伴手禮的好地方 !</h4>
        <v-btn class="buy-btn" color="#CE0000" @click="goToAllProducts">點我購買</v-btn>
      </div>
    </div>
</template>

<style lang="css" scoped>
.bg {
  position: absolute; /* 讓色塊疊加在圖片上 */
  width: 500px; /* 設定藍色區塊寬度 */
  height: 100%; /* 讓它和 .header 一樣高 */
  background: #004B97; /* 設定背景顏色 */
  top: 0;
  left: 0; /* 讓色塊從左側開始 */
  /* opacity: 0.8; 可以加點透明度，讓圖片稍微透出 */
  z-index: 1; /* 確保色塊覆蓋在圖片上 */
}

.header {
  position: relative; /* 讓 .bg 能夠正確定位 */
  background-image: url("../../assets/product/ProductIndex.jpg");
  width: 100%;
  height: 400px;
  background-position: calc(50% + 400px) calc(100% + 340px);
  background-size: cover;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 50px;
}

.text-container {
  position: relative; /* 讓文字不被 .bg 遮住 */
  z-index: 2; /* 讓文字顯示在藍色區塊之上 */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 讓內部的 h1, h4, 按鈕都靠左對齊 */
  text-align: left;
}

.title {
  color: white; 
  font-size: 70px; /* 調整字體大小 */
  font-weight: bold; /* 加粗 */
  margin: 0;
}

.subtitle {
  font-size: 20px; /* 調整副標題大小 */
  margin-top: 10px; /* 控制副標題與標題的間距 */
  margin-left: 6px; /* 讓副標題往右移動 */
  background-color: white; /* 藍色背景 */
  color: #004B97; /* 白色文字 */
  padding: 8px 65px; /* 內距，讓背景不會太擠 */
  border-radius: 30px; /* 圓角 */
  display: inline-block; /* 讓背景剛好包住文字 */
  font-weight: bold; /* 讓文字加粗，看起來更清晰 */
}

.buy-btn {
  margin-top: 25px; /* 調整按鈕與副標題的間距 */
}
</style>
