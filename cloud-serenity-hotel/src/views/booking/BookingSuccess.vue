<script setup>
import axiosInstance from "@/axios";
import { useAuthStore } from "@/stores/authStore";
import { useBookingOrderStore } from "@/stores/bookingOrderStore";
import Swal from "sweetalert2";
import { nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const userStore = useAuthStore();
const router = useRouter();
const bookingOrderStore = useBookingOrderStore();

const ecpayHtml = ref("");
const ecpayContainer = ref(null);

const payment = ref({
  orderId: null,
  productName: null,
  price: null,
});

onMounted(() => {
  userStore.checkMember();
});

function goMemberCenter() {
  router.push({ name: "memberBookingOrder" });
}

async function orderPay() {
  payment.value.orderId = bookingOrderStore.orderId;
  payment.value.productName = bookingOrderStore.roomTypeName;
  payment.value.price = bookingOrderStore.totalPrice;

  Swal.fire({
    title: `
    訂單ID：${payment.value.orderId}
    房型：${payment.value.productName}
    價格：${payment.value.price}
    點選確定進入付款頁面`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then(async (res) => {
    if (res.isConfirmed) {
      const { data } = await axiosInstance.post("/booking/pay", payment.value);

      console.log(data);

      if (data === 1) {
        await Swal.fire({
          title: "此訂單已付款!",
          icon: "error",
          confirmButtonText: "確定",
        });

        return;
      } else if (data === 2) {
        await Swal.fire({
          title: "此訂單已取消!",
          icon: "error",
          confirmButtonText: "確定",
        });

        return;
      } else if (data === 3) {
        await Swal.fire({
          title: "此訂單已完成退房!",
          icon: "error",
          confirmButtonText: "確定",
        });

        return;
      }

      ecpayHtml.value = data;

      await nextTick();

      const formEl = ecpayContainer.value.querySelector("#ecpay-form");
      if (formEl) {
        formEl.submit();
      }
    }
  });
}
</script>

<template>
  <div class="container">
    <div class="content">
      <h1>訂單建立成功</h1>
      <br />
      <h6>您的訂單編號是：{{ bookingOrderStore.orderId }}</h6>
      <br />
      <v-btn
        color="blue"
        v-if="bookingOrderStore.paymentMethod === '信用卡'"
        @click="orderPay"
      >
        去付款
      </v-btn>
      <v-btn color="green" @click="goMemberCenter"> 回會員中心查看訂單 </v-btn>
    </div>
    <div ref="ecpayContainer" v-html="ecpayHtml" style="display: none"></div>
  </div>
</template>

<style lang="css" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  width: 500px;
  border-radius: 10px;
  padding-top: 150px;
  text-align: center;
  min-height: 150vh;
}
</style>
