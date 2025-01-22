<script setup>
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const showDialog = ref(false); // 控制顯示與隱藏對話框

const formData = ref({
  carModelId: null,
  licensePlate: "",
  colorOptions: "",
  year: "",
  status: "",
  createdAt: "", // 假設創建時間為當前時間
  updatedAt: "", // 假設更新時間為當前時間
});
const carModels = ref([]); // 車型資料

// 開啟對話框並查詢車型資料
const openDialog = () => {
  showDialog.value = true;
  fetchCarModels(); // 查詢車型資料
};

// 生成當前的日期時間字串，格式：yyyy-MM-dd HH:mm:ss
const getCurrentDateTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const fetchCarModels = async () => {
  try {
    const response = await axios.get("/api/CarModel/queryAll");
    carModels.value = response.data;
    console.log(carModels.value);
    console.log(object);
  } catch (error) {
    console.error("查詢車型資料失敗:", error);
  }
};

// 提交表單的方法
const submitForm = async () => {
  try {
    // 發送 POST 請求到後端 API
    const response = await axios.post("/api/CarModel/add", formData.value);
    console.log("車型資料已新增:", response.data);

    // 提交成功後隱藏對話框並重置表單數據
    showDialog.value = false;
    formData.value = {
      carId: "",
      carMadelId: "",
      licensePlate: "",
      colorOptions: "",
      year: "",
      status: " 可租用 ",
      createdAt: getCurrentDateTime(), // 重設為當前時間
      updatedAt: getCurrentDateTime(), // 重設為當前時間
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
    <table class="table table table-striped">
      <thead>
        <tr>
          <th scope="col">車輛編號</th>
          <th scope="col">車輛型號</th>
          <th scope="col">車輛品牌</th>
          <th scope="col">顏色</th>
          <th scope="col">狀態</th>
          <th scope="col">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
          <td>@mdo</td>
        </tr>
      </tbody>
    </table>

    <!-- 使用 v-dialog 顯示表單 -->
    <v-dialog v-model="showDialog" max-width="500px">
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
            ></v-select>

            <!-- 車牌號碼 -->
            <v-text-field
              label="車牌號碼"
              v-model="formData.licensePlate"
              required
              :rules="[(v) => !!v || '車牌號碼為必填']"
            />

            <!-- 顏色選項 -->
            <v-text-field
              label="顏色選項"
              v-model="formData.colorOptions"
              required
              type="text"
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

            <!-- 車輛狀態 -->
            <v-text-field label="車輛狀態" v-model="formData.status" required />

            <!-- 隱藏創建時間欄位 -->
            <v-text-field
              v-model="formData.createdAt"
              style="display: none"
              :value="formData.createdAt"
            />

            <!-- 隱藏更新時間欄位 -->
            <v-text-field
              v-model="formData.updatedAt"
              style="display: none"
              :value="formData.updatedAt"
            />
          </form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="showDialog = false">取消</v-btn>
          <v-btn color="primary" @click="submitForm">送出</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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