<script setup>
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { onMounted, ref, defineProps } from "vue";

import { useRoute } from "vue-router";

// 定義接收 `carModelId` 和 `bookingNumber` 的 props
const props = defineProps({
  carModelId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
});
console.log("接收到的 carModelId:", props.carModelId);
console.log("接收到的 orderId:", props.orderId);

const carModels = ref([]); // 車型資料
const carUser = ref([]); //使用者資料
const image = ref([]); //圖片資料

const form = ref({
  personalIdNo: "",
  userName: "",
  email: "",
  phone: "",
  birthday: "",
  gender: "",
  licenseNumber: "",
  passportNumber: "",
  carType: "",
  pickupTime: "",
  returnTime: "",
});

const formatDate = (dateString) => {
  // 將 "2024-11-24 00:00" 格式的日期轉換為 "2024-11-24" 格式
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是從 0 開始，需加 1
  const day = String(date.getDate()).padStart(2, "0"); // 確保日期是兩位數字
  return `${year}-${month}-${day}`;
};

// 發送車型資料和車輛資料的請求
onMounted(async () => {
  try {
    // 發送車型資料請求
    const carResponse = await axios.get(
      `http://localhost:8080/CloudSerenityHotel/CarModel/queryOne/${props.carModelId}`
    );
    // 更新車型資料
    carModels.value = carResponse.data;
    console.log("車型資料已加載", carModels.value);
  } catch (error) {
    console.error("車型資料請求失敗:", error);
    Swal.fire({
      icon: "error",
      title: "車型資料載入失敗",
      text: "無法載入車型資料，請稍後再試",
    });
  }

  try {
    // 發送車型資料請求
    const imageResponse = await axios.get(
      `http://localhost:8080/CloudSerenityHotel/ImageCar/queryOne/${props.carModelId}`
    );
    // 更新車型資料
    image.value = imageResponse.data;
    console.log("圖片資料已加載", image.value);
  } catch (error) {
    console.error("圖片資料請求失敗:", error);
  }

  try {
    // 發送車型資料請求
    const orderResponse = await axios.get(
      `http://localhost:8080/CloudSerenityHotel/CarModel/UserDetailByOrderId/${props.orderId}`
    );
    // 更新車型資料
    carUser.value = orderResponse.data;
    console.log("使用者資料已加載", carUser.value);
    form.value.personalIdNo = carUser.value.personalIdNo || "";
    form.value.userName = carUser.value.userName || "";
    form.value.email = carUser.value.email || "";
    form.value.phone = carUser.value.phone || "";
    form.value.birthday = carUser.value.birthday
      ? formatDate(carUser.value.birthday)
      : "";
    form.value.gender = carUser.value.gender || "";
    form.value.licenseNumber = carUser.value.licenseNumber || "";
    form.value.passportNumber = carUser.value.passportNumber || "";
  } catch (error) {
    console.error("車型資料請求失敗:", error);
  }
});
</script>
<template>
  <div class="color-div">
    <div class="grid-container">
      <form class="row g-2" @submit="handleSubmit">
        <!-- 顯示車型圖片 -->
        <div class="row">
          <div class="col-md-6 center-img">
            <label for="carImage" class="form-label">車型圖片</label>
            <img
              v-if="image && image.length > 0"
              :src="'data:image/jpeg;base64,' + image[0]"
              alt="車型圖片"
              class="center-img"
            />
            <div v-else>無法顯示圖片</div>
          </div>
        </div>

        <!-- 顯示車型名稱 -->
        <div class="row">
          <div class="col-md-6">
            <label for="carModelName" class="form-label">租用的車型名稱</label>
            <input
              type="text"
              class="form-control"
              id="carModelName"
              :value="carModels?.carModel || ''"
              readonly
            />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <label for="personalIdNo" class="form-label">身份證字號</label>
            <input
              type="text"
              class="form-control"
              id="personalIdNo"
              v-model="form.personalIdNo"
              required
              pattern="^[A-Za-z][0-9]{9}$"
              readonly
            />
            <div class="invalid-feedback">請輸入有效的身份證字號。</div>
          </div>
          <div class="col-md-6">
            <label for="userName" class="form-label">姓名</label>
            <input
              type="text"
              class="form-control"
              id="userName"
              v-model="form.userName"
              required
            />
            <div class="invalid-feedback">姓名為必填項。</div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <label for="email" class="form-label">電子郵件</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="form.email"
              required
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            />
            <div class="invalid-feedback">請輸入有效的電子郵件地址。</div>
          </div>
          <div class="col-md-6">
            <label for="phone" class="form-label">電話號碼</label>
            <input
              type="tel"
              class="form-control"
              id="phone"
              v-model="form.phone"
              required
              pattern="^\d{10}$"
            />
            <div class="invalid-feedback">請輸入有效的電話號碼。</div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <label for="birthday" class="form-label">生日</label>
            <input
              type="date"
              class="form-control"
              id="birthday"
              v-model="form.birthday"
              required
              readonly
            />
            <div class="invalid-feedback">生日為必填項。</div>
          </div>
          <div class="col-md-6">
            <label for="gender" class="form-label">性別</label>
            <select
              class="form-control"
              id="gender"
              v-model="form.gender"
              required
            >
              <option value="" disabled selected>選擇性別</option>
              <option value="Male">男性</option>
              <option value="Female">女性</option>
              <option value="Other">其他</option>
            </select>
            <div class="invalid-feedback">性別為必填項。</div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <label for="licenseNumber" class="form-label">駕照編號</label>
            <input
              type="text"
              class="form-control"
              id="licenseNumber"
              v-model="form.licenseNumber"
              required
            />
            <div class="invalid-feedback">駕照編號為必填項。</div>
          </div>
          <div class="col-md-6">
            <label for="passportNumber" class="form-label">護照號碼</label>
            <input
              type="text"
              class="form-control"
              id="passportNumber"
              v-model="form.passportNumber"
              required
            />
          </div>
        </div>

        <div class="row">
          <div class="col-md-10">
            <label for="formFile" class="form-label">請上傳駕照照片</label>
            <input class="form-control" type="file" id="formFile" required />
            <div class="invalid-feedback">必須上傳駕照照片。</div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <label for="pickupTime" class="form-label">取車時間</label>
            <input
              type="datetime-local"
              class="form-control"
              id="pickupTime"
              required
            />
            <div class="invalid-feedback">取車時間為必填項。</div>
          </div>
          <div class="col-md-6">
            <label for="returnTime" class="form-label">還車時間</label>
            <input
              type="datetime-local"
              class="form-control"
              id="returnTime"
              required
            />
            <div class="invalid-feedback">還車時間為必填項。</div>
          </div>
        </div>

        <div class="col-4">
          <div class="button-container">
            <button type="submit" class="btn btn-primary me-2">確認</button>
            <!-- me-2 設定右邊間距 -->
            <button type="submit" class="btn btn-primary">取消</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  background-color: #ddd3d3; /* 背景顏色 */
  border-radius: 10px; /* 圓角邊框 */
  padding: 30px; /* 內邊距 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 陰影效果 */
  width: 100%; /* 讓表單容器佔滿 100% 寬度 */
  max-width: 700px; /* 設定最大寬度 */
  margin-top: 500px;
}

.color-div {
  background-color: #ffffff; /* 背景顏色 */
  height: 100vh; /* 讓容器的高度填滿視窗 */
  display: flex; /* 啟用 Flexbox */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  padding: 20px; /* 增加內邊距，避免內容太靠邊 */
}

/* 設定表單欄位間距 */
.form-label {
  font-weight: bold; /* 標籤加粗 */
  margin-bottom: 15px; /* 標籤和輸入框之間的間距 */
  font-size: 16px; /* 字型大小 */
  font-family: "Arial", sans-serif; /* 設定字體 */
}

.form-control {
  margin-bottom: 25px; /* 輸入框之間的間距 */
  padding: 12px; /* 增加內部間距 */
  border-radius: 5px; /* 圓角邊框 */
  border: 1px solid #ddd; /* 邊框顏色 */
  width: 100%; /* 確保輸入框佔滿寬度 */
  box-sizing: border-box; /* 使寬度包含內邊距 */
  font-size: 16px; /* 輸入框字型大小 */
  font-family: "Arial", sans-serif; /* 輸入框字體 */
}

/* 設定按鈕樣式 */
.btn-primary {
  background-color: #808386; /* 藍色背景 */
  border: none; /* 移除邊框 */
  color: white; /* 文字顏色為白色 */
  padding: 12px 20px; /* 增加按鈕內邊距 */
  border-radius: 5px; /* 圓角邊框 */
  width: 48%; /* 設置按鈕的寬度，使它們佔據父容器的 50% */
  font-size: 16px; /* 字體大小 */
  cursor: pointer; /* 增加滑鼠指標 */
  transition: background-color 0.3s; /* 平滑過渡效果 */
}

button:focus {
  outline: none; /* 去除按鈕焦點外框 */
}

.btn-primary:hover {
  background-color: #a2abb5; /* 滑鼠懸停時改變背景顏色 */
}

.button-container {
  display: flex; /* 啟用 Flexbox */
  gap: 10px; /* 設置按鈕之間的間距 */
  justify-content: flex-end; /* 讓按鈕從左側開始 */
}

/* 設置按鈕之間的右邊間距 */
.btn + .btn {
  margin-right: 10px; /* 這裡的 `10px` 代表右邊間距 */
}

.was-validated .form-control:invalid {
  border-color: #e74c3c;
}

.was-validated .form-control:valid {
  border-color: #2ecc71;
}

.invalid-feedback {
  color: #e74c3c;
  font-size: 0.875em;
}

.center-img {
  display: block;
  margin: 0 auto; /* 使圖片居中 */
  width: 100%; /* 使圖片寬度自適應容器 */
  height: auto; /* 保持比例 */
  margin-bottom: 20px; /* 圖片下方間距 */
}
</style>