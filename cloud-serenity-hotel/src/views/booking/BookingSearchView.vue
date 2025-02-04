<script setup>
import { useAuthStore } from "@/stores/authStore";
import { useBookingOrderStore } from "@/stores/bookingOrderStore";
import axios from "axios";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";

const userStore = useAuthStore();
const bookingOrderStore = useBookingOrderStore();

const selectedCheckInDate = ref(null);
const selectedCheckOutDate = ref(null);
const roomTypeDialog = ref(false);

const roomTypeDetail = ref({
  imgsUrl: [],
  typeName: "",
  typeDesc: "",
  typeId: null,
  roomCount: null,
  price: null,
  maxCapacity: null,
});

function seeRoomTypeDetail(item) {
  roomTypeDialog.value = true;

  const detail = roomTypeDetail.value;

  let imgArray = [];

  if (item.prImg) {
    imgArray.push(item.prImg.imgUrl);
  }

  for (let i = 0; i < item.imgs.length; i++) {
    imgArray.push(item.imgs[i].imgUrl);
  }

  detail.imgsUrl = imgArray;

  detail.typeName = item.typeName;

  detail.typeId = item.typeId;
  detail.price = item.price;
  detail.typeDesc = item.typeDesc;
  detail.roomCount = item.roomCount;
  detail.maxCapacity = item.maxCapacity;
}

const searchRoomTypes = ref([]);

function onSelectCheckInDate() {
  if (selectedCheckInDate.value) {
    selectedCheckOutDate.value = new Date(selectedCheckInDate.value);
    selectedCheckOutDate.value.setDate(
      selectedCheckOutDate.value.getDate() + 1
    );
  }
}

async function searchRoomTypeByDate() {
  if (selectedCheckInDate.value == null || selectedCheckOutDate.value == null) {
    Swal.fire({
      title: "請選擇日期!",
      icon: "error",
      confirmButtonText: "確定",
    });
    return;
  }

  // const {data} = await axios.get(`http://localhost:8080/CloudSerenityHotel/room/${selectedCheckInDate.value.toISOString().split('T')[0]}/${selectedCheckOutDate.value.toISOString().split('T')[0]}`);
  const { data } = await axios.get(
    `http://localhost:8080/CloudSerenityHotel/room/${selectedCheckInDate.value.toLocaleDateString(
      "en-CA"
    )}/${selectedCheckOutDate.value.toLocaleDateString("en-CA")}`
  );

  console.log(data);
  searchRoomTypes.value = data;
}

function bookingRoomTypeConfirm(item) {
  userStore.checkMember();

  if (!userStore.user) {
    return;
  }

  Swal.fire({
    title: `確定預定 ${item.typeName}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then(async (res) => {
    if (res.isConfirmed) {
      bookingOrderStore.checkInDate = selectedCheckInDate.value;
      bookingOrderStore.checkOutDate = selectedCheckOutDate.value;
      bookingOrderStore.totalPrice = item.price;
      bookingOrderStore.roomTypeId = item.typeId;
      bookingOrderStore.roomTypeName = item.typeName;

      console.log(bookingOrderStore);

      bookingOrderStore.toOrderView();
    }
  });
}
</script>

<template>
  <div class="container">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="5">
          <v-date-input
            label="選擇入住日期"
            v-model="selectedCheckInDate"
            :min="new Date().toISOString().split('T')[0]"
            @update:modelValue="onSelectCheckInDate"
          ></v-date-input>
        </v-col>
        <v-col cols="12" md="5">
          <v-date-input
            label="選擇退房日期"
            v-model="selectedCheckOutDate"
            :min="new Date().toISOString().split('T')[0]"
            :allowed-dates="(date) => date >= selectedCheckInDate"
          ></v-date-input>
        </v-col>

        <v-col cols="2">
          <v-btn
            color="indigo"
            prepend-icon="mdi-home-search"
            size="x-large"
            @click="searchRoomTypeByDate"
            >查詢</v-btn
          >
        </v-col>
      </v-row>
    </v-container>

    <hr />


    <v-container v-if="searchRoomTypes.length > 0">
      <v-row>
        <!-- 遍历 list 生成 v-card -->
        <v-col
          v-for="item in searchRoomTypes"
          :key="item.typeId"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card>
            <!-- 插入图片 -->
            <v-img
              :src="item.prImg.imgUrl"
              alt="Card Image"
              class="white--text align-end"
              height="200px"
              v-if="item.prImg.imgUrl"
            >
            </v-img>
            <div v-else>沒有圖片</div>
            <v-card-title class="bg-gradient"
              >{{ item.typeName }} NT${{ item.price }}</v-card-title
            >
            <br />
            <v-card-text>可入住人數：{{ item.maxCapacity }} 人</v-card-text>
            <v-card-text>剩餘房間數：{{ item.roomCount }} 間</v-card-text>

            <v-card-actions>
              <v-btn
                color="purple-accent-1"
                prepend-icon="mdi-home-search"
                @click="seeRoomTypeDetail(item)"
                >查看</v-btn
              >
              <v-btn color="primary" @click="bookingRoomTypeConfirm(item)"
                >訂房</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <div style="width: 100%; height: 50vh; display: flex; align-items: center; justify-content: center;" v-else><div><h1>請選擇日期並點擊查詢</h1></div></div>

    <div class="pa-4 text-center">
      <v-dialog v-model="roomTypeDialog" max-width="600">
        <v-card>
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-carousel
                  v-if="roomTypeDetail.imgsUrl"
                  show-arrows="hover"
                  hide-delimiter-background
                  height
                >
                  <v-carousel-item
                    v-for="(item, index) in roomTypeDetail.imgsUrl"
                    :key="index"
                    :src="item"
                  ></v-carousel-item>
                </v-carousel>
                <div v-else>沒有圖片</div>
              </v-col>

              <v-col cols="12">
                <h2>{{ roomTypeDetail.typeName }}</h2>
              </v-col>

              <v-col cols="12">
                <h5>
                  <label class="roomLabel">每晚房價：</label>NT${{
                    roomTypeDetail.price
                  }}
                </h5>
              </v-col>

              <v-col cols="12">
                <label class="roomLabel">房間描述：</label>
                <br />
                <pre style="white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">{{ roomTypeDetail.typeDesc }}</pre>
              </v-col>

              <v-col cols="12">
                <label class="roomLabel">可入住人數：</label
                >{{ roomTypeDetail.maxCapacity }} 人
                <p></p>
              </v-col>

              <v-col cols="12">
                <label class="roomLabel">剩餘房間數：</label>
                {{ roomTypeDetail.roomCount }} 間
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="關閉視窗"
              variant="plain"
              @click="roomTypeDialog = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<style lang="css" scoped>
.container {
  height: 200vh;
}

.roomLabel {
  font-size: 20px;
  font-weight: bold;
}
</style>
