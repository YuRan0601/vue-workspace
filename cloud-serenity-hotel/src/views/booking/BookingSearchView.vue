<script setup>
import axios from "axios";
import { ref } from "vue";

const checkInDate = ref(null);
const checkOutDate = ref(null);
const roomTypeDialog = ref(false);

const roomTypeDetail = ref({
  imgsUrl : [],
  typeName : "",
  typeDesc : "",
  typeId : null,
  roomCount : null,
  price : null
});

function seeRoomTypeDetail(item) {
  roomTypeDialog.value = true;

  const detail = roomTypeDetail.value;

  let imgArray = [];

  if(item.prImg) {
    imgArray.push(item.prImg.imgUrl);
  }
  
  for(let i = 0; i < item.imgs.length; i++) {
    imgArray.push(item.imgs[i].imgUrl);
  }

  detail.imgsUrl = imgArray;

  detail.typeName = item.typeName;

  detail.typeId = item.typeId;
  detail.price = item.price;
  detail.typeDesc = item.typeDesc;
  detail.roomCount = item.roomCount;

  roomTypeDialog = true;
  
} 

const searchRoomTypes = ref([]);

function onSelectCheckInDate() {
  if (checkInDate.value) {
    checkOutDate.value = new Date(checkInDate.value);
    checkOutDate.value.setDate(checkOutDate.value.getDate() + 1);
  }
}

async function searchRoomTypeByDate() {
  if(checkInDate.value == null || checkOutDate.value == null) {
    alert('請選擇日期!')
    return;
  }
  

  // const {data} = await axios.get(`http://localhost:8080/CloudSerenityHotel/room/${checkInDate.value.toISOString().split('T')[0]}/${checkOutDate.value.toISOString().split('T')[0]}`);
  const {data} = await axios.get(`http://localhost:8080/CloudSerenityHotel/room/${checkInDate.value.toLocaleDateString('en-CA')}/${checkOutDate.value.toLocaleDateString('en-CA')}`);

  console.log(data);
  searchRoomTypes.value = data;
  
}
</script>

<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="5">
          <v-date-input
            label="選擇入住日期"
            v-model="checkInDate"
            :min="new Date().toISOString().split('T')[0]"
            @update:modelValue="onSelectCheckInDate"
          ></v-date-input>
        </v-col>
        <v-col cols="12" md="5">
          <v-date-input
            label="選擇退房日期"
            v-model="checkOutDate"
            :min="new Date().toISOString().split('T')[0]"
            :allowed-dates="(date) => date >= checkInDate"
          ></v-date-input>
        </v-col>

        <v-col cols="2">
          <v-btn color="indigo" prepend-icon="mdi-home-search" size="x-large" @click="searchRoomTypeByDate">查詢</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <hr>

    <v-container>
    <v-row>
      <!-- 遍历 list 生成 v-card -->
      <v-col
        v-for="item in searchRoomTypes"
        :key="item.typeId"
        cols="12" sm="6" md="3"
      >
        <v-card>
          <!-- 插入图片 -->
          <v-img
            :src="item.prImg.imgUrl"
            alt="Card Image"
            class="white--text align-end"
            height="200px"
          >
          </v-img>
          <v-card-title class="bg-gradient">{{ item.typeName }}    NT${{ item.price }}</v-card-title>
          <v-card-text>剩餘房間數：{{ item.roomCount }}</v-card-text>

          <v-card-actions>
            <v-btn color="purple-accent-1" prepend-icon="mdi-home-search" @click="seeRoomTypeDetail(item)">查看</v-btn>
            <v-btn color="primary" @click="handleClick(item)">查看</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
   <div class="pa-4 text-center">
      <v-dialog v-model="roomTypeDialog" max-width="600">
        <v-card>
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-img :src="roomTypeDetail.imgsUrl[0]"></v-img>
              </v-col>

              <v-col cols="12">
                <h2>{{ roomTypeDetail.typeName }}</h2>
              </v-col>

              <v-col cols="12">
                <h5>每晚房價： NT${{roomTypeDetail.price}}</h5>
              </v-col>

              <v-col cols="12">
                <p></p>
              </v-col>

              <v-col cols="12">
                <p></p>
              </v-col>

              <v-col cols="12">
                <p></p>
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

            <v-btn
              color="primary"
              text="訂房"
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
