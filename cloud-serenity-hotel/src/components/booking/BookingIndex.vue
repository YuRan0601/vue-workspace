<script setup>
import axiosInstance from "@/axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const roomTypeTable = ref([]);

const router = useRouter();

async function loadRoomTypeTable() {
  const { data } = await axiosInstance.get("/room/type");
  console.log(data);

  roomTypeTable.value = data;
}

onMounted(async () => {
  loadRoomTypeTable();
});

function toBookingSearch() {
  router.push({ name: "bookingSearch" });
}

</script>

<template>
  <div>
    <div class="roomTypeImgDiv">
      <h1>房型</h1>
      <v-carousel
        show-arrows="hover"
        hide-delimiter-background
        cycle
        interval="3000"
        v-if="roomTypeTable.length != 0"
      >
        <v-carousel-item
          v-for="item in roomTypeTable"
          :key="item.typeId"
          :src="item.prImg?.imgUrl"
          :title="item.typeName"
        >
          <div class="roomTypeCaption">
            {{ item.typeName }}
          </div>
        </v-carousel-item>
      </v-carousel>
      <div id="bookingBtn">
        <v-btn
          color="green"
          @click="toBookingSearch"
          style="width: 100px; height: 50px"
          >立即預訂</v-btn
        >
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.roomTypeImgDiv {
  padding: 10px;
  width: 100%;
  text-align: center;
  background-color: rgb(185, 252, 185);
}

#bookingBtn {
  margin-top: 10px;
  width: 100%;
  text-align: center;
}

.roomTypeCaption {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
}
</style>
