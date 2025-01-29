<script setup>
</script>
<template>
  <div class="color-div">
    <div class="grid-container">
      <form class="row g-2">
        <div class="row">
          <div class="col-md-6">
            <label for="inputPassword4" class="form-label">身份證字號</label>
            <input type="personalIdNo" class="form-control" id="personalIdNo" />
          </div>
          <div class="col-md-6">
            <label for="inputEmail4" class="form-label">姓名</label>
            <input type="userName" class="form-control" id="userName" />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <label for="inputEmail4" class="form-label">電子郵件</label>
            <input type="email" class="form-control" id="email" />
          </div>
          <div class="col-md-6">
            <label for="inputPassword4" class="form-label">電話號碼</label>
            <input type="phone" class="form-control" id="phone" />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <label for="inputEmail4" class="form-label">生日</label>
            <input type="email" class="form-control" id="inputEmail4" />
          </div>
          <div class="col-md-6">
            <label for="inputEmail4" class="form-label">性別</label>
            <input type="gender" class="form-control" id="gender" />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <label for="inputEmail4" class="form-label">駕照編號</label>
            <input type="password" class="form-control" id="inputPassword4" />
          </div>
          <div class="col-md-6">
            <label for="inputPassword4" class="form-label">護照號碼</label>
            <input type="password" class="form-control" id="inputPassword4" />
          </div>
        </div>
        <div class="row">
          <div class="col-md-10">
            <label for="formFile" class="form-label">請上傳駕照照片</label>
            <input class="form-control" type="file" id="formFile" />
          </div>
        </div>

        <div class="col-12">
          <button type="submit" class="btn btn-primary">選擇車輛</button>
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
}

.color-div {
  background-color: #cfafaf; /* 背景顏色 */
  height: 100vh; /* 讓容器的高度填滿視窗 */
  display: flex; /* 啟用 Flexbox */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  padding: 20px; /* 增加內邊距，避免內容太靠邊 */
}

/* 設定表單欄位間距 */
.form-label {
  font-weight: bold; /* 標籤加粗 */
  margin-bottom: 10px; /* 標籤和輸入框之間的間距 */
}

.form-control {
  margin-bottom: 20px; /* 輸入框之間的間距 */
  padding: 12px; /* 增加內部間距 */
  border-radius: 5px; /* 圓角邊框 */
  border: 1px solid #ddd; /* 邊框顏色 */
  width: 100%; /* 確保輸入框佔滿寬度 */
  box-sizing: border-box; /* 使寬度包含內邊距 */
}

/* 設定按鈕樣式 */
.btn-primary {
  background-color: #808386; /* 藍色背景 */
  border: none; /* 移除邊框 */
  color: white; /* 文字顏色為白色 */
  padding: 12px 20px; /* 增加按鈕內邊距 */
  border-radius: 5px; /* 圓角邊框 */
  width: 100%; /* 按鈕佔滿 100% 寬度 */
  font-size: 16px; /* 字體大小 */
  cursor: pointer; /* 增加滑鼠指標 */
  transition: background-color 0.3s; /* 平滑過渡效果 */
}

.btn-primary:hover {
  background-color: #a2abb5; /* 滑鼠懸停時改變背景顏色 */
}
</style>