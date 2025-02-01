<script setup>
import axiosInstance from "@/axios";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";

const roomTypeTable = ref([]);

async function loadTable() {
  const { data } = await axiosInstance.get("/room/type");
  console.log(data);

  roomTypeTable.value = data;
}

onMounted(() => {
  loadTable();
});
</script>

<template>
  <div>
    <section class="breadcrumb_area header">
      <div
        class="overlay bg-parallax"
        data-stellar-ratio="0.8"
        data-stellar-vertical-offset="0"
        data-background=""
      ></div>
      <div class="container-fluid">
        <div class="page-cover text-center">
          <h2 class="page-cover-tittle">房型介紹</h2>
        </div>
      </div>
    </section>
    <div class="container">
      <div class="roomTypeBtns">
        <RouterLink
          class="roomTypeBtn"
          v-for="item in roomTypeTable"
          :key="item.typeId"
          :to="{ name: 'oneRoomType', params: { id: item.typeId } }"
          >{{ item.typeName }}</RouterLink
        >
        <!-- <v-btn
          class="roomTypeBtn"
          v-for="item in roomTypeTable"
          :key="item.typeId"
          >{{ item.typeName }}</v-btn
        > -->
      </div>
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style lang="css" scoped>
.header {
  background-image: url("../../assets/common/header_bg.jpg");
  width: 100%;
  height: 200px;
  background-position: right top;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  height: 100vh;
}

.roomTypeBtns {
  text-align: center;
  padding: 10px;
  margin: 10px 0 10px 0;
}

.roomTypeBtn {
  background-color: #f0ed33;
  border: 1px solid #f0ed33;
  border-radius: 10%;
  padding: 10px;
  margin: 0 10px 0 10px;
  color: black;
  text-decoration: none;
}
</style>
