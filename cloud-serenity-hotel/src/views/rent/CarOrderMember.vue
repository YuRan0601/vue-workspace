<script setup>
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import { onMounted, ref } from "vue";
import Swal from "sweetalert2";

const userStore = useAuthStore();
const userId = userStore.user.userId;
console.log(userId);

const CarUser = ref([]);

onMounted(async () => {
  try {
    // 發送會員訂單資料請求
    const userResponse = await axios.get(
      `http://localhost:8080/CloudSerenityHotel/car-reservation/query/user/${userId}`
    );

    // 輸出回應以便調試
    console.log("API 回應狀態:", userResponse.status);
    console.log("API 回應資料:", userResponse.data);

    // 檢查回應狀態碼是否為 200 且資料存在
    if (userResponse.status === 200) {
      // 檢查資料是否存在並且不是空陣列
      if (
        userResponse.data &&
        userResponse.data.data &&
        Array.isArray(userResponse.data.data) &&
        userResponse.data.data.length > 0
      ) {
        // 更新車型資料
        CarUser.value = userResponse.data.data; // 從 userResponse.data.data 取得資料
        console.log("會員資料已加載", CarUser.value);
      } else {
        // 資料為空的情況
        console.log("會員訂單資料為空");
      }
    } else {
      // 如果狀態碼不是 200，顯示錯誤提示
      Swal.fire({
        icon: "error",
        title: "訂單資料載入失敗",
        text: "無法載入會員訂單資料，請稍後再試",
      });
    }
  } catch (error) {
    // 捕捉網絡或其他錯誤
    console.error("會員訂單資料請求失敗:", error);
    Swal.fire({
      icon: "error",
      title: "訂單資料載入失敗",
      text: "無法載入會員訂單資料，請稍後再試",
    });
  }
});

// 取消訂單的功能
const cancelOrder = async (reservationId) => {
  console.log("reservationId為", reservationId);

  try {
    // 發送刪除請求
    const response = await axios.post(
      `http://localhost:8080/CloudSerenityHotel/car-reservation/delete/${reservationId}`
    );

    if (response.data.status === "SUCCESS") {
      // 取消成功後，移除當前訂單
      const index = CarUser.value.findIndex(
        (order) => order.id === reservationId
      );
      if (index !== -1) {
        CarUser.value.splice(index, 1);
      }

      // 顯示成功訊息
      Swal.fire({
        icon: "success",
        title: "訂單取消成功",
        text: "您的訂單已成功取消。",
      });
    } else {
      throw new Error("取消訂單失敗");
    }
  } catch (error) {
    console.error(error);

    // 顯示錯誤訊息
    Swal.fire({
      icon: "error",
      title: "訂單取消失敗",
      text: "無法取消訂單，請稍後再試。",
    });
  }
};
</script>

<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">訂單編號</th>
          <th scope="col">車輛編號</th>
          <th scope="col">訂單狀態</th>
          <th scope="col">取車時間</th>
          <th scope="col">還車時間</th>
          <th scope="col">操作</th>
        </tr>
      </thead>
      <tbody>
        <!-- 使用 v-for 迴圈來顯示 CarUser 中的每筆訂單 -->
        <tr v-for="(order, index) in CarUser" :key="index">
          <td>{{ order.id }}</td>
          <td>{{ order.carId }}</td>
          <td>{{ order.rentalStatus }}</td>
          <td>{{ order.rentalStart }}</td>
          <td>{{ order.rentalEnd }}</td>
          <td class="text-center align-middle">
            <button @click="cancelOrder(order.id)">取消訂單</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<style scoped>
/* 設置表格的外觀 */
table {
  width: 100%;
  border-collapse: collapse; /* 去除表格邊框間的間隙 */
  margin: 20px 0; /* 設置表格的上下外距 */
  font-family: Arial, sans-serif; /* 設置表格字體 */
}

/* 表格頭部 */
th {
  background-color: #f8f9fa; /* 淺灰色背景 */
  padding: 12px 15px; /* 內邊距 */
  text-align: center; /* 文字置中 */
  border: 1px solid #ddd; /* 邊框 */
  font-weight: bold; /* 加粗字體 */
  color: #495057; /* 文字顏色 */
}

/* 表格內容 */
td {
  padding: 12px 15px; /* 內邊距 */
  text-align: center; /* 文字置中 */
  border: 1px solid #ddd; /* 邊框 */
  color: #495057; /* 文字顏色 */
  word-wrap: break-word; /* 防止內容超出單元格 */
}

/* 行與行之間的背景交替顯示 */
tr:nth-child(odd) {
  background-color: #f2f2f2; /* 淺灰色 */
}

tr:nth-child(even) {
  background-color: #ffffff; /* 白色 */
}

/* 按鈕樣式 */
button {
  background-color: #007bff; /* 藍色背景 */
  color: white; /* 白色文字 */
  border: none; /* 無邊框 */
  padding: 8px 12px; /* 內邊距 */
  cursor: pointer; /* 滑鼠樣式 */
  border-radius: 4px; /* 圓角 */
  transition: background-color 0.3s ease; /* 變化過渡 */
}

button:hover {
  background-color: #0056b3; /* 滑鼠懸停時顏色 */
}

/* 表格邊框 */
table,
th,
td {
  border: 1px solid #ddd; /* 邊框顏色 */
}

/* 設置表格內部的垂直對齊方式 */
td,
th {
  vertical-align: middle; /* 使文字垂直居中 */
}

/* 設置表格標題 */
th {
  font-size: 16px; /* 字體大小 */
  font-weight: bold; /* 加粗字體 */
}

/* 設定表格邊框的顏色 */
table {
  border: 1px solid #ddd;
}
</style>