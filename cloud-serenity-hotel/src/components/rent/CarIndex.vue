<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

// 點擊整個區域跳轉到某個頁面
const navigateToPage = () => {
  router.push("/rent/CarRentalHome"); // 將 '/target-page' 改為你要跳轉的路由
};
</script>

<template>
  <div class="carousel-container">
    <div id="carouselExampleCaptions" class="carousel slide">
      <div class="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          class="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img
            src="@/assets/images/CarHomePage1.jpg"
            class="d-block w-100"
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>與舒適同行，與便捷並肩</h5>
            <p>入住飯店，即享便捷租車服務，無論商務或旅行，輕鬆出發！</p>
          </div>
        </div>
        <div class="carousel-item">
          <img
            src="@/assets/images/CarHomePage2.jpg"
            class="d-block w-100"
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>快速便捷，省時省心</h5>
            <p>即時租車，不再等待，讓您有更多時間探索每個美麗景點</p>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    <div class="button-container">
      <button type="button" class="btn btn-secondary" @click="navigateToPage">
        即刻租車
      </button>
    </div>
  </div>
</template>

<style lang="css" scoped>
.button-container {
  display: flex;
  justify-content: center; /* 使用 Flexbox 將按鈕水平居中 */
  margin-top: 20px; /* 調整與其他區域的間距 */
}

.btn-secondary {
  background-color: #6c757d; /* 按鈕背景色 */
  color: white; /* 按鈕文字顏色 */
  padding: 10px 20px; /* 按鈕內邊距 (上下 10px，左右 20px) */
  font-size: 16px; /* 按鈕字體大小 */
  border-radius: 5px; /* 按鈕圓角 */
  border: none; /* 去除按鈕邊框 */
  transition: background-color 0.3s ease, transform 0.3s ease; /* 添加過渡效果 */
}

.btn-secondary:hover {
  background-color: #5a6268; /* 懸停時改變背景顏色 */
  transform: scale(1.05); /* 懸停時輕微放大 */
}

/* 調整整個父容器大小 */
.carousel-container {
  max-width: 1200px; /* 設定容器的最大寬度 */
  margin: 0 auto; /* 水平居中對齊 */
  padding: 20px; /* 在容器周圍加入適當的內邊距 */
  overflow: hidden; /* 隱藏超出容器範圍的部分 */
}

/* 使圖片保持固定高度並填滿容器 */
.carousel-inner img {
  width: 100%;
  height: 100%; /* 設定固定高度 */
  object-fit: cover; /* 保持圖片的比例，填滿容器 */
}

/* 調整輪播文字顯示的位置，使其更美觀 */
.carousel-caption {
  bottom: 20px; /* 設定文字的底部距離 */
  left: 0;
  right: 0;
  text-align: center;
  color: white; /* 文字顏色 */
  padding: 10px 20px; /* 內邊距 */
  border-radius: 5px; /* 邊框圓角 */
}

/* 增強 carousel 控制按鈕的顯示 */
.carousel-control-prev,
.carousel-control-next {
  border-radius: 50%; /* 按鈕圓形 */
  padding: 10px;
  z-index: 10;
}

/* 控制按鈕圖示顏色 */
.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: invert(1); /* 使箭頭顏色變為白色 */
}

/* 調整 carousel-indicators 按鈕樣式 */
.carousel-indicators button {
  background-color: #fff; /* 設定圓點顏色 */
  opacity: 0.7;
}

.carousel-indicators .active {
  background-color: #007bff; /* 活動狀態的圓點顏色 */
}
</style>
