<script setup>
import axiosInstance from "@/axios";
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";

const userStore = useAuthStore();
const orderTable = ref([]);

const orderStatus = [
  { name: "待付款", value: "pending" },
  { name: "已付款", value: "confirmed" },
  { name: "已取消", value: "cancelled" },
  { name: "已退房", value: "completed" },
];

const headers = [
  { title: "訂單ID", key: "roomId" },
  { title: "預定房型", key: "roomTypeName" },
  { title: "住房日期", key: "checkInDate" },
  { title: "退房日期", key: "checkOutDate" },
  { title: "總金額", key: "totalPrice" },
  { title: "付款方式", key: "paymentMethod" },
  { title: "訂單狀態", key: "status" },
  { title: "新增時間", key: "createdDate" },
  { title: "操作", key: "actions" },
];

async function loadOrderTable() {
  const userId = userStore.user.userId;
  const { data } = await axiosInstance.get(`/booking/order/${userId}`);
  orderTable.value = data;
}

async function switchStatusSearch(status) {
  const userId = userStore.user.userId;
  const { data } = await axiosInstance.get(
    `/booking/order/${userId}/${status}`
  );
  orderTable.value = data;
}

async function cancelOrder(item) {
  Swal.fire({
    title: `確定要取消 ${item.roomTypeName} 的訂單?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then(async (res) => {
    if(res.isConfirmed) {
        const { data } = await axiosInstance.put(
        `/booking/order/cancel/${item.orderId}`);

        if(data.code === 200) {
            Swal.fire({
                title: "取消成功",
                icon: "success",
                confirmButtonText: "確定",
            }).then(() => {
                loadOrderTable();
            });
        } else if (data.code === 404) {
            Swal.fire({
                title: "找不到訂單",
                icon: "error",
                confirmButtonText: "確定",
            }).then(() => {
                loadOrderTable();
            });
        } else if (data.code === 501) {
            Swal.fire({
                title: "伺服器出錯，請重試",
                icon: "error",
                confirmButtonText: "確定",
            }).then(() => {
                loadOrderTable();
            });
        }
    }
  });
}

onMounted(() => {
  loadOrderTable();
});
</script>

<template>
  <div>
    <v-container class="typeBtnContainer">
      <v-row>
        <v-btn class="typeBtn" color="black" @click="loadRoomTable">所有</v-btn>
        <v-btn
          class="typeBtn"
          v-for="(item, index) in orderStatus"
          :key="index"
          color="black"
          @click="switchStatusSearch(item.value)"
          >{{ item.name }}</v-btn
        >
      </v-row>
    </v-container>

    <!-- 訂單表 -->
    <v-container>
      <v-text-field v-model="search" label="查詢"></v-text-field>
      <v-data-table
        :items="orderTable"
        :headers="headers"
        item-value="orderId"
        :search="search"
      >
        <template #item.actions="{ item }">
          <v-btn
            v-if="item.status === '待付款' && item.paymentMethod === '信用卡'"
            color="primary"
            class="mr-2"
            @click="seeUpdateOrder(item)"
          >
            去付款
          </v-btn>
          <v-btn
            v-if="item.status === '待付款'"
            color="primary"
            class="mr-2"
            @click="cancelOrder(item)"
          >
            取消訂單
          </v-btn>
        </template>
      </v-data-table>
    </v-container>
  </div>
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
