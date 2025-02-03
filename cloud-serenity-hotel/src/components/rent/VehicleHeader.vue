<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

// 表單資料
const formData = ref({
  carModelId: "",
  carId: "",
  colorOptions: "",
  licensePlate: "",
  year: "",
  status: "",
  createdAt: "",
  updatedAt: "",
  status: "",
});

// 對話框顯示狀態
const dialogVisible = ref(false);

// 車型資料
const carModels = ref([]);

const colorOptions = [
  { value: "紅色", name: "紅色" },
  { value: "藍色", name: "藍色" },
  { value: "黑色", name: "黑色" },
  { value: "白色", name: "白色" },
];

// 開啟對話框並載入車型資料
const openDialog = async () => {
  dialogVisible.value = true;
  await fetchCarModels(); // 開啟對話框時，執行此函數來載入車型資料
};

// 關閉對話框
const closeDialog = () => {
  dialogVisible.value = false;
  formData.value = {}; // 清空表單資料
};

// 點擊對話框外部時也清空內容
const onClickOutside = () => {
  closeDialog();
};

const fetchCarModels = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/CloudSerenityHotel/CarModel/queryAll"
    );
    carModels.value = response.data;
  } catch (error) {
    console.error("查詢車型資料失敗:", error);
  }
};

// 當車型改變時觸發
const onCarModelChange = () => {
  if (formData.value.carModelId) {
    fetchCarModelCount(formData.value.carModelId);
  }
};

// 請求車型數量
const fetchCarModelCount = async (carModelId) => {
  console.log(formData.value);

  try {
    const response = await axios.get(
      `http://localhost:8080/CloudSerenityHotel/CarModel/countByCarModel/${formData.value.carModelId}`
    );
    console.log("車型數量:", response.data);
    // 這裡可以根據需求進行處理，可能是顯示結果或更新狀態等
    const selectedCarModel = carModels.value.find(
      (model) => model.carModelId === carModelId
    );
    formData.value.carId = `${selectedCarModel.carModel}${
      parseInt(response.data) + 1
    }`.replace(/\s+/g, "");
  } catch (error) {
    console.error("查詢失敗:", error);
  }
};

// 提交表單的方法
const submitForm = async () => {
  try {
    // 發送 POST 請求到後端 API
    const response = await axios.post(
      "http://localhost:8080/CloudSerenityHotel/CarDetails/add",
      formData.value
    );
    console.log("車型資料已新增:", response.data);

    // 提交成功後隱藏對話框並重置表單數據
    dialogVisible.value = false;
    formData.value = {
      carId: "",
      carModelId: "",
      licensePlate: "",
      colorOptions: "",
      year: "",
    };

    Swal.fire({
      icon: "success",
      title: "車型資料已新增！",
      text: "資料已成功提交。",
    }).then(() => {
      // 提交成功後刷新頁面
      window.location.reload(); // 這樣會重新加載當前頁面
      // 或者，若要導向某個頁面，可以使用 Vue Router
      // router.push({ name: 'modelOperate' });
    });
  } catch (error) {
    console.error("提交表單失敗:", error);
  }
};
</script>

<template>
  <div>
    <div>
      <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div class="navbar-nav">
                <RouterLink class="nav-link" :to="{ name: 'vehicleDetails' }"
                  >車輛管理</RouterLink
                >
              </div>
            </div>
            <!-- 新增按鈕 -->
            <button type="button" class="btn btn-success" @click="openDialog">
              <i class="bi bi-plus-lg"></i> 新增
            </button>
          </div>
        </nav>
      </div>
    </div>
    <div>
      <!-- 使用 v-dialog 顯示表單 -->
      <v-dialog
        v-model="dialogVisible"
        max-width="500px"
        persistent
        @click:outside="onClickOutside"
      >
        <v-card>
          <v-card-title>
            <span class="headline">新增車輛資料</span>
          </v-card-title>
          <v-card-text>
            <form @submit.prevent="submitForm">
              <!-- 車型選擇 -->
              <v-select
                v-model="formData.carModelId"
                :items="carModels"
                item-value="carModelId"
                item-title="carModel"
                label="選擇車型"
                :rules="[(v) => !!v || '車型為必填']"
                required
                @update:modelValue="onCarModelChange"
              ></v-select>

              <v-text-field
                label="車輛編號"
                v-model="formData.carId"
                required
                :rules="[(v) => !!v || '車輛編號為必填']"
                readonly
              />

              <v-text-field
                label="車牌號碼"
                v-model="formData.licensePlate"
                required
                :rules="[
                  (v) => !!v || '車牌號碼為必填',
                  (v) => /^[A-Z]{3}-\d{4}$/.test(v) || '車牌號碼格式不正確',
                ]"
                @input="
                  formData.licensePlate = formData.licensePlate.toUpperCase() // 強制大寫
                "
              />

              <v-select
                label="顏色選項"
                v-model="formData.colorOptions"
                :items="colorOptions"
                required
                item-text="name"
                item-title="value"
                :rules="[(v) => !!v || '顏色選項為必填']"
              />

              <!-- 汽車年份 -->
              <v-text-field
                label="汽車年份"
                v-model="formData.year"
                required
                type="number"
                :rules="[(v) => !!v || '汽車年份為必填']"
              />
            </form>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="closeDialog">取消</v-btn>
            <v-btn color="primary" type="submit" @click="submitForm"
              >送出</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<style scoped>
/* 設置按鈕的背景顏色及樣式 */
.btn-success {
  background-color: var(
    --bs-success-bg-subtle-hover,
    #8ebe8e
  ); /* 使用 CSS 變數來設置背景顏色 */
  border: none; /* 取消按鈕邊框 */
  color: rgb(0, 0, 0); /* 設置文字顏色 */
  padding: 10px 15px; /* 設定內邊距 */
  font-size: 15px; /* 調整按鈕字體大小 */
  border-radius: 10px; /* 設置圓角 */
  transition: background-color 0.3s ease, transform 0.2s ease; /* 增加背景顏色變化和縮放的過渡效果 */
}

/* 當滑鼠懸停在按鈕上時 */
.btn-success:hover {
  background-color: var(
    --bs-success-bg-subtle-hover,
    #a9dfa9
  ); /* 假設你有定義 hover 顏色，否則可以直接寫 #4cae4c 或使用其他顏色 */
  transform: scale(1.03); /* 按鈕放大效果 */
}

/* 當按鈕被點擊時，按鈕稍微縮小 */
.btn-success:active {
  transform: scale(0.98); /* 按鈕縮小效果 */
}
</style>