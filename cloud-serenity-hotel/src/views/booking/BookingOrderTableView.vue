<script setup>
import axiosInstance from "@/axios";
import axios from "@/axios";
import Swal from "sweetalert2";
import { onMounted, ref, watchEffect } from "vue";

const orderTable = ref([]);
const roomTypeTable = ref([]);
const keyword = ref("");

const headers = [
  { title: "訂單ID", key: "orderId" },
  { title: "會員", key: "userName" },
  { title: "會員ID", key: "userId" },
  { title: "預定房型", key: "roomTypeName" },
  { title: "住房日期", key: "checkInDate" },
  { title: "退房日期", key: "checkOutDate" },
  { title: "總金額", key: "totalPrice" },
  { title: "付款方式", key: "paymentMethod" },
  { title: "訂單狀態", key: "status" },
  { title: "新增時間", key: "createdDate" },
  { title: "操作", key: "actions" },
];

const search = ref(null);

const orderStatus = [
  { name: "待付款", value: "pending" },
  { name: "已付款", value: "confirmed" },
  { name: "已取消", value: "cancelled" },
  { name: "已退房", value: "completed" },
];

const updateDialog = ref(false);

const updateBookingOrder = ref({
  orderId: null,
  user: {
    userId: null,
  },
  room: {
    roomId: null,
    roomName: null,
  },
  roomTypeName: null,
  checkInDate: null,
  checkOutDate: null,
  totalPrice: null,
  paymentMethod: null,
  status: null,
});

const updateRoomTypeId = ref(null);

async function loadOrderTable() {
  const { data } = await axios.get("/booking/order");

  console.log(data);

  orderTable.value = data;
}

async function loadRoomTypeTable() {
  const { data } = await axios.get("/room/type");

  console.log(data);

  roomTypeTable.value = data;
}

function seeUpdateOrder(item) {
  const bo = updateBookingOrder.value;
  bo.orderId = item.orderId;
  bo.user.userId = item.userId;
  bo.room.roomId = item.roomId;
  bo.room.roomName = item.roomName;
  bo.roomTypeName = item.roomTypeName;
  bo.checkInDate = item.checkInDate;
  bo.checkOutDate = item.checkOutDate;
  bo.totalPrice = item.totalPrice;
  bo.paymentMethod = item.paymentMethod;
  bo.status = item.status;
  updateRoomTypeId.value = item.roomTypeId;

  updateDialog.value = true;
}

async function updateOrderHandler() {
  Swal.fire({
    title: "確定要修改此訂單?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then(async (res) => {
    if (res.isConfirmed) {
      const { data } = await axiosInstance.put(
        `/booking/order/${updateRoomTypeId.value}`,
        updateBookingOrder.value,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.code === 200) {
        Swal.fire({
          title: "訂單修改成功",
          icon: "success",
          confirmButtonText: "確定",
        }).then(() => {
          loadOrderTable();
          updateDialog.value = false;
        });
      } else if (data.code === -1) {
        Swal.fire({
          title: "找不到訂單",
          icon: "error",
          confirmButtonText: "確定",
        }).then(() => {
          loadOrderTable();
        });
      } else if (data.code === 404) {
        Swal.fire({
          title: "已沒有空房",
          icon: "error",
          confirmButtonText: "確定",
        }).then(() => {
          loadOrderTable();
        });
      } else if (data.code === 501) {
        Swal.fire({
          title: "伺服器出錯，修改失敗",
          icon: "error",
          confirmButtonText: "確定",
        }).then(() => {
          loadOrderTable();
        });
      }
    }
  });
}

async function switchStatusSearch(status) {
  const { data } = await axiosInstance.get(`/booking/order/status/${status}`);
  orderTable.value = data;
}

async function searchByKeyword() {
  const { data } = await axiosInstance.get(
    `/booking/order/like/${keyword.value}`
  );
  console.log(data);

  orderTable.value = data;
}

onMounted(() => {
  loadOrderTable();
  loadRoomTypeTable();
});
</script>

<template>
  <div>
    <h1 class="bookingTitle">訂房訂單</h1>
    <v-container class="typeBtnContainer">
      <v-row>
        <v-btn class="typeBtn" color="black" @click="loadOrderTable"
          >所有</v-btn
        >
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
    <v-container
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 500px;
      "
    >
      <v-row>
        <v-text-field v-model="keyword" label="訂單編號或會員名"></v-text-field>
        <v-btn
          :key="index"
          color="green"
          @click="searchByKeyword"
          style="height: 50px; width: 80px"
          >查詢</v-btn
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
        show-expand
      >
        <template #expanded-row="{ item }">
          <tr>
            <th :colspan="4">預定房間</th>
            <th :colspan="4">最後修改時間</th>
          </tr>
          <tr>
            <td :colspan="4">
              {{ item.roomName }}
            </td>
            <td :colspan="4">
              {{ item.updatedDate }}
            </td>
          </tr>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            v-if="item.status === '待付款'"
            color="primary"
            class="mr-2"
            @click="seeUpdateOrder(item)"
          >
            修改
          </v-btn>
        </template>
      </v-data-table>
    </v-container>

    <!-- update表單 -->
    <div class="pa-4 text-center">
      <v-dialog v-model="updateDialog" max-width="600">
        <v-card title="修改訂單">
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  label="會員ID"
                  v-model="updateBookingOrder.user.userId"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="房間名稱"
                  v-model="updateBookingOrder.room.roomName"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="總金額"
                  v-model="updateBookingOrder.totalPrice"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="住房日期"
                  v-model="updateBookingOrder.checkInDate"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="退房日期"
                  v-model="updateBookingOrder.checkOutDate"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="付款方式"
                  v-model="updateBookingOrder.paymentMethod"
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="updateRoomTypeId"
                  label="房間類型"
                  :items="roomTypeTable"
                  item-title="typeName"
                  item-value="typeId"
                >
                </v-select>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="updateBookingOrder.status"
                  label="訂單狀態"
                  :items="orderStatus"
                  item-title="name"
                  item-value="value"
                >
                </v-select>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="關閉"
              variant="plain"
              @click="updateDialog = false"
            ></v-btn>

            <v-btn
              color="primary"
              text="修改"
              variant="tonal"
              @click="updateOrderHandler"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<style lang="css" scoped>
.v-dialog {
  z-index: 1000 !important;
}

.swal2-container {
  z-index: 9999 !important;
}

.bookingTitle {
  margin-top: 30px;
  margin-bottom: 50px;
}

.typeBtnContainer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.typeBtnContainer .typeBtn {
  margin: 5px;
}
</style>
