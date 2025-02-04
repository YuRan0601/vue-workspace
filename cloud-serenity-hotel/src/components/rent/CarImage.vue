<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router"; // 引入 vue-router 來提取路由參數
import axios from "axios";
import { defineProps } from "vue";

// 定義接收來自父組件的 `id` 屬性
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const images = ref([]); // 用來存放從 API 獲得的圖片
const activeIndex = ref(0); // 當前顯示的圖片索引
const route = useRoute();

// 使用 `onMounted` 來在組件加載後發送請求
onMounted(() => {
  console.log("Component Mounted");
  fetchImages(); // 當組件加載時發送請求
});

// 定義 API 請求來獲取圖片數據
const fetchImages = async () => {
  const carModelId = route.params.id; // 假設 carModelId 是從 props 中獲得的
  console.log("fetchImages called");
  console.log("Received carModelId:", carModelId); // 檢查是否正確獲取 ID

  if (!carModelId) {
    console.error("Car Model ID is missing");
    return; // 如果沒有 carModelId，就結束函數
  }

  try {
    const response = await axios.get(
      `http://localhost:8080/CloudSerenityHotel/ImageCar/queryOne/${carModelId}`
    );
    console.log(response.data);

    console.log("API 回應:", response.data);
    if (response.data) {
      // 如果 response.data 存在，且 response.data.imageUrls 是一個陣列
      images.value = response.data;
      console.log(images.value);
      // 更新 imageUrls
    } else {
      console.error("返回的圖片數據格式錯誤", response.data);
    }
  } catch (error) {
    console.error("獲取圖片失敗:", error);
  }
};

const getImageSrc = (base64Str) => {
  console.log("Base64 String (first 100 chars):", base64Str.slice(0, 100)); // 輸出前 100 個字元
  // 檢查 base64 字串的前綴來判斷圖片格式
  if (base64Str.startsWith("/9j/")) {
    // JPEG 格式
    return `data:image/jpeg;base64,${base64Str}`;
  } else if (base64Str.startsWith("iVBOR")) {
    // PNG 格式
    return `data:image/png;base64,${base64Str}`;
  } else {
    // 預設情況，假設是 JPEG
    return `data:image/jpeg;base64,${base64Str}`;
  }
};

// 可選：自動切換圖片的功能（3秒鐘切換一次）
setInterval(() => {
  activeIndex.value = (activeIndex.value + 1) % images.value.length;
}, 3000);
</script>

<template>
  <div>
    <div
      id="carouselExampleIndicators"
      class="carousel slide"
      data-bs-ride="carousel"
    >
      <div class="carousel-indicators">
        <button
          v-for="(image, index) in images"
          :key="index"
          type="button"
          :data-bs-target="'#carouselExampleIndicators'"
          :data-bs-slide-to="index"
          :class="{ active: index === activeIndex }"
          :aria-label="'Slide ' + (index + 1)"
        ></button>
      </div>
      <div class="carousel-inner">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="carousel-item"
          :class="{ active: index === activeIndex }"
        >
          <img
            :src="getImageSrc(image)"
            class="d-block w-100"
            :alt="'Slide ' + (index + 1)"
          />
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 100%;
  height: auto;
}
</style>