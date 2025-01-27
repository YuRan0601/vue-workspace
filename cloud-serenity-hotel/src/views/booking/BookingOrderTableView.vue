<script setup>
import axios from "@/axios";
import { onMounted, ref } from "vue";

const orderTable = ref([]);
const roomTypeTable = ref([]);

const headers = [
  { title: "訂單ID", key: "roomId" },
  { title: "預定房型", key: "roomTypeName" },
  { title: "住房日期", key: "checkInDate" },
  { title: "退房日期", key: "checkOutDate" },
  { title: "總金額", key: "totalPrice" },
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
  checkInDate: null,
  checkOutDate: null,
  totalPrice: null,
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
  bo.checkInDate = item.checkInDate;
  bo.checkOutDate = item.checkOutDate;
  bo.totalPrice = item.totalPrice;
  bo.status = item.status;
  updateRoomTypeId.value = item.roomTypeId;

  updateDialog.value = true;
}

onMounted(() => {
  loadOrderTable();
  loadRoomTypeTable();
});
</script>

<template>
  <div>
    <h3>訂房訂單</h3>
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
          <v-btn color="primary" class="mr-2" @click="seeUpdateOrder(item)">
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
              text="Close"
              variant="plain"
              @click="updateDialog = false"
            ></v-btn>

            <v-btn
              color="primary"
              text="Save"
              variant="tonal"
              @click="updateRoomHandler"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
