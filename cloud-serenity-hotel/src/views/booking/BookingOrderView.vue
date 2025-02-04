<script setup>
import axiosInstance from "@/axios";
import axios from "@/axios";
import { useAuthStore } from "@/stores/authStore";
import { useBookingOrderStore } from "@/stores/bookingOrderStore";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const userStore = useAuthStore();
const bookingOrderStore = useBookingOrderStore();
const router = useRouter();
const paymentMethod = ["入住時付款", "信用卡"];

const form = ref(null);
const isValid = ref(false);

const rules = {
  required: (value) => !!value || "此欄位為必填",
  number: (value) => /^\d+$/.test(value) || "必須是數字",
  positive: (value) => value > 0 || "數字必須大於 0",
};

const bookingOrder = ref({
  user: {
    userId: null,
  },
  checkInDate: null,
  checkOutDate: null,
  totalPrice: null,
  paymentMethod: null,
});

onMounted(() => {
  userStore.checkMember();

  bookingOrderStore.checkValue();

  const order = bookingOrder.value;

  order.user.userId = userStore.user.userId;
  order.checkInDate = bookingOrderStore.checkInDate.toLocaleDateString("en-CA");
  order.checkOutDate =
    bookingOrderStore.checkOutDate.toLocaleDateString("en-CA");
  order.totalPrice = bookingOrderStore.totalPrice;
});

async function insertOrder() {
  userStore.checkMember();

  if (!userStore.user) {
    return;
  }

  const { valid } = await form.value.validate();

  if (!valid) {
    await Swal.fire({
      title: "請確定輸入的內容符合規則!",
      icon: "error",
      confirmButtonText: "確定",
    });

    return;
  }


  Swal.fire({
    title: "確定要提交訂單?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then(async (res) => {
    if (res.isConfirmed) {

      Swal.fire({
        title: "處理中",
        text: "請稍候...",
        allowOutsideClick: false, // 防止使用者點擊背景關閉
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const { data } = await axiosInstance.post(
        `/booking/order/${bookingOrderStore.roomTypeId}`,
        bookingOrder.value,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Swal.close();

      if (data.code === 200) {
        Swal.fire({
          title: "訂單建立成功",
          icon: "success",
          confirmButtonText: "確定",
        }).then(() => {
          router.push({ name: "bookingSuccess" });
        });
      } else if (data.code === 404) {
        Swal.fire({
          title: "已沒有空房",
          icon: "error",
          confirmButtonText: "確定",
        }).then(() => {
          router.push({ name: "bookingSearch" });
        });
      } else if (data.code === 405) {
        Swal.fire({
          title: "請確定登入",
          icon: "error",
          confirmButtonText: "確定",
        }).then(() => {
          router.push({ name: "login" });
        });
      } else if (data.code === 501) {
        Swal.fire({
          title: "伺服器出錯，新增失敗",
          icon: "error",
          confirmButtonText: "確定",
        }).then(() => {
          router.push({ name: "bookingSearch" });
        });
      }
    }
  });
}
</script>

<template>
  <div class="container">
    <div class="content">
      <h3>您的訂房訂單</h3>
      <br />
      <v-form ref="form">
        <v-text-field
          v-model="userStore.user.userName"
          label="會員名稱"
          readonly
        ></v-text-field>

        <v-text-field
          v-model="bookingOrderStore.roomTypeName"
          label="房型名稱"
          readonly
        ></v-text-field>

        <v-text-field
          v-model="bookingOrder.totalPrice"
          label="每晚房價"
          readonly
        ></v-text-field>

        <v-text-field
          v-model="bookingOrder.checkInDate"
          label="訂房日期"
          readonly
        ></v-text-field>

        <v-text-field
          v-model="bookingOrder.checkOutDate"
          label="退房日期"
          readonly
        ></v-text-field>

        <v-select
          v-model="bookingOrder.paymentMethod"
          label="付款方式"
          :items="paymentMethod"
          :rules="[rules.required]"
        >
        </v-select>

        <v-btn color="blue" class="mr-4" @click="insertOrder"> 確認訂房 </v-btn>

        <v-btn color="error" @click="resetValidation"> 取消訂房 </v-btn>
      </v-form>
    </div>
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
  padding: 50px;
  text-align: center;
}
</style>
