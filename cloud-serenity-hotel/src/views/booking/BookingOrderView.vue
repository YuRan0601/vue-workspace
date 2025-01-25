<script setup>
import { useAuthStore } from "@/stores/authStore";
import { useBookingOrderStore } from "@/stores/bookingOrderStore";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const userStore = useAuthStore();
const bookingOrderStore = useBookingOrderStore();
const router = useRouter();

const bookingOrder = ref({
  user: {
    userId: null,
  },
  checkInDate: null,
  checkOutDate: null,
  totalPrice: null,
});

onMounted(() => {
  userStore.checkMember();

  bookingOrderStore.checkValue();

  const order = bookingOrder.value;

  order.user.userId = bookingOrderStore.userId;
  order.checkInDate = bookingOrderStore.checkInDate.toLocaleDateString("en-CA");
  order.checkOutDate =
    bookingOrderStore.checkOutDate.toLocaleDateString("en-CA");
  order.totalPrice = bookingOrderStore.totalPrice;
});
</script>

<template>
  <div class="container">
    <div class="content">
      <h3>您的訂房</h3>
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

        <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>

        <v-btn color="warning" @click="resetValidation">
          Reset Validation
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<style lang="css" scoped>
template {
  background-color: black;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  width: 500px;
  border-radius: 10px;
  padding: 50px;
}
</style>
