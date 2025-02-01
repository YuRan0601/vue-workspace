<script setup>
import axiosInstance from "@/axios";
import { ref, watch } from "vue";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const roomType = ref(null);

async function loadRoomType() {
  console.log("開始載入房型，id=", props.id);
  try {
    const { data } = await axiosInstance.get(`/room/type/${props.id}`);
    roomType.value = data.roomType;
    console.log("房型資料載入完成：", roomType.value);
  } catch (error) {
    console.error("載入房型資料發生錯誤：", error);
  }
}

watch(
  () => props.id,
  (newId) => {
    if (newId) {
      loadRoomType();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <div v-if="roomType" style="color: black; font-size: 20px">
      <!-- 用一個容器包裹兩個區塊 -->
      <div class="roomContainer">
        <!-- 左邊區塊：Carousel -->
        <div class="roomCarouselContainer">
          <v-carousel
            v-if="roomType.prImg || roomType.img"
            show-arrows="hover"
            hide-delimiter-background
            cycle
            interval="3000"
            class="roomCarousel"
          >
            <v-carousel-item :src="roomType.prImg?.imgUrl"></v-carousel-item>
            <v-carousel-item
              v-for="(item, index) in roomType.imgs"
              :key="index"
              :src="item.imgUrl"
            ></v-carousel-item>
          </v-carousel>
          <div v-else>沒有圖片</div>
        </div>
        <!-- 右邊區塊：房型描述 -->
        <div class="roomDescContainer">
          <div class="roomDesc">
            <h1 class="roomTitle">{{ roomType.typeName }}</h1>
            <br />
            <p>
              <label class="typeLabel">每晚房價：</label>NT${{ roomType.price }}
            </p>
            <p>
              <label class="typeLabel">最多入住人數：</label
              >{{ roomType.maxCapacity }}人
            </p>
            <p><label class="typeLabel">房型描述：</label></p>
            <pre>{{ roomType.typeDesc }}</pre>
          </div>
        </div>
      </div>
    </div>
    <div v-else>沒有資料</div>
  </div>
</template>

<style scoped>
/* 設定包裹容器為 Flex 版型 */
.roomContainer {
  display: flex;
  flex-wrap: nowrap;
  margin-top: 50px;
  height: 100vh;
}

/* 左邊的 Carousel 區塊佔 50% */
.roomCarouselContainer {
  flex: 0 0 60%;
  box-sizing: border-box;
  padding-right: 20px; /* 可選，增加右側間距 */
}

.roomCarousel {
  height: 500px;
}

/* 右邊的描述區塊佔 50% */
.roomDescContainer {
  flex: 0 0 40%;
  box-sizing: border-box;
  padding-top: 20px;
  padding-left: 20px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.roomDesc {
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* 如有需要，讓 Carousel 自動填滿容器 */
.roomCarousel {
  width: 100%;
}

.typeLabel {
  font-weight: bold;
  font-size: 25px;
}

.roomTitle {
  font-weight: bolder;
}
</style>
