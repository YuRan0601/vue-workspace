<script setup>
import axiosInstance from "@/axios";
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";
import { nextTick, onMounted, ref } from "vue";

const userId = userStore.user.userId;

const orderStatus = [
  { name: "已預約", value: "RESERVED" },
  { name: "租借中", value: "RENTED" },
];

const headers = [
  { title: "訂單編號", key: "orderId" },
  { title: "車輛編號", key: "roomTypeName" },
  { title: "預約時間", key: "checkInDate" },
  { title: "結束時間", key: "checkOutDate" },
  { title: "租借車輛尺寸", key: "totalPrice" },
];

// 預約資料API
onMounted(async () => {
  try {
    const response = await axios.get(
      `http://localhost:8080/CloudSerenityHotel/car-reservation/query/${reservationId}`
    );
    console.log(response.data);
    reservation.value = response.data.data;
    carRentalRecord.value = reservation.value.carRentalRecord;
    carUserInfo.value = reservation.value.carUserInfo;

    console.log("carRentalRecord = ", carRentalRecord.value);
    console.log("carUserInfo = ", carUserInfo.value);
  } catch (error) {
    console.error("無法取得預約資料", error);
  }
});
</script>

<template>
  <div></div>
</template>

<style lang="css" scoped>
.typeBtnContainer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.typeBtnContainer .typeBtn {
  margin: 5px;
}
</style>
