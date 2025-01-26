<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2"; // 引入 SweetAlert2

// 接收 props 傳遞的 orderId
const props = defineProps({
    orderId: {
        type: String,
        required: true,
    },
});

// 訂單詳細資料
const orderDetail = ref(null);

// 格式化數字為整數
const formatNumberToInteger = (number) => {
    return Math.round(number); // 四捨五入至整數
};

// 格式化時間函數 (24 小時制)
const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    };
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString("zh-TW", options);
};

// 查詢單筆訂單
const fetchOrderDetail = async () => {
    try {
        const response = await axios.get(`/api/Order/findOrderDetails/${props.orderId}`);

        // 確認 orderItemsDtos 存在並為數組
        if (response.data.data?.orderItemsDtos && Array.isArray(response.data.data.orderItemsDtos)) {
            response.data.data.orderItemsDtos.sort((a, b) => a.orderitemId - b.orderitemId);
        }

        // 將排序後的數據賦值給 orderDetail
        orderDetail.value = response.data.data;
        console.log("訂單詳細資料：", response.data.data);
    } catch (error) {
        console.error("查詢單筆訂單失敗：", error);
    }
};



// 初始化
onMounted(() => {
    fetchOrderDetail(props.orderId);
});

// SweetAlert2 刪除警告
const showDeleteAlert = () => {
    Swal.fire({
        title: "確定要刪除此訂單嗎？",
        text: "刪除後將無法恢復！",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33", // 確認按鈕顏色
        cancelButtonColor: "#6c757d", // 取消按鈕顏色
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        buttonsStyling: false, // 停用 SweetAlert2 預設樣式
        customClass: {
            confirmButton: "btn btn-danger text-white me-2", // 自定義確認按鈕
            cancelButton: "btn btn-secondary text-white", // 自定義取消按鈕
        },
    }).then((result) => {
        if (result.isConfirmed) {
            deleteOrder(); // 執行刪除操作
        }
    });
};

// 刪除訂單
const deleteOrder = async () => {
    try {
        await axios.delete(`/api/Order/delete/${orderDetail.value.orderId}`);
        Swal.fire({
            title: "刪除成功！",
            icon: "success",
            confirmButtonText: "確認",
            confirmButtonColor: "#6c757d",
            customClass: {
                confirmButton: "btn text-white me-2", // 自定義確認按鈕
            },
        }).then(() => {
            window.location.href = "/order/orderList";
        });
    } catch (error) {
        console.error("刪除失敗：", error);
        Swal.fire({
            title: "刪除失敗",
            text: "刪除過程中發生錯誤。",
            icon: "error",
            confirmButtonText: "確認",
            confirmButtonColor: "#6c757d",
        });
    }
};
</script>

<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">訂單詳細資料</h2>

        <!-- 訂單基本資訊 -->
        <div class="mb-4">
            <h4 class="mb-3">訂單基本資訊</h4>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label class="form-label">訂單ID</label>
                    <input type="text" class="form-control" :value="orderDetail?.orderId" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label class="form-label">使用者ID</label>
                    <input type="text" class="form-control" :value="orderDetail?.userId" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label class="form-label">訂單狀態</label>
                    <input type="text" class="form-control" :value="orderDetail?.orderStatus" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label class="form-label">付款方式</label>
                    <input type="text" class="form-control" :value="orderDetail?.paymentMethod" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label class="form-label">總金額</label>
                    <input type="text" class="form-control" :value="formatNumberToInteger(orderDetail?.totalAmount)"
                        disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label class="form-label">點數折抵</label>
                    <input type="text" class="form-control" :value="orderDetail?.pointsDiscount || '無'" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label class="form-label">折扣金額</label>
                    <input type="text" class="form-control"
                        :value="formatNumberToInteger(orderDetail?.discountAmount || '無')" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label class="form-label">最終金額</label>
                    <input type="text" class="form-control" :value="formatNumberToInteger(orderDetail?.finalAmount)"
                        disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label class="form-label">訂單創建日期</label>
                    <input type="text" class="form-control" :value="formatDateTime(orderDetail?.orderDate)" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label class="form-label">訂單更新日期</label>
                    <input type="text" class="form-control" :value="formatDateTime(orderDetail?.updatedAt)" disabled />
                </div>
            </div>
        </div>

        <!-- 收件人資訊 -->
        <div class="mb-4">
            <h4 class="mb-3">收件人資訊</h4>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label class="form-label">收件人</label>
                    <input type="text" class="form-control" :value="orderDetail?.receiveName" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" :value="orderDetail?.email" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label class="form-label">電話號碼</label>
                    <input type="text" class="form-control" :value="orderDetail?.phoneNumber" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label class="form-label">收貨地址</label>
                    <input type="text" class="form-control" :value="orderDetail?.address" disabled />
                </div>
            </div>
        </div>

        <!-- 訂品明細 -->
        <div class="mb-4">
            <h4 class="mb-3">訂單明細</h4>
            <table class="table table-hover table-bordered">
                <thead class="table-light text-center">
                    <tr>
                        <th class="column-width">細項編號</th>
                        <th class="column-width">產品名稱</th>
                        <th class="column-width">數量</th>
                        <th class="column-width">單價</th>
                        <th class="column-width">折扣</th>
                        <th class="column-width">小計</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in orderDetail?.orderItemsDtos || []" :key="item.orderitemId"
                        class="text-center align-middle">
                        <td>{{ item.orderitemId }}</td>
                        <td>{{ item.productName || '無產品名稱' }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ item.unitPrice === 0 ? "無" : item.unitPrice }}</td>
                        <td>{{ item.discount || "無" }}</td>
                        <td>{{ item.subtotal === 0 ? "無" : item.subtotal }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- 按鈕區 -->
        <div class="d-flex justify-content-between align-items-center mt-5 mb-4 py-3 border-top">
            <!-- 返回按鈕 -->
            <RouterLink :to="{ name: 'orderList' }" class="btn btn-secondary">
                <i class="bi bi-arrow-left"></i> 返回
            </RouterLink>
            <div>
                <!-- 編輯按鈕 -->
                <RouterLink :to="{ name: 'orderedit', params: { orderId: props.orderId } }"
                    class="btn btn-warning me-2">
                    <i class="bi bi-pencil-square"></i> 編輯
                </RouterLink>
                <!-- 刪除按鈕 -->
                <button class="btn btn-danger" @click="showDeleteAlert">
                    <i class="bi bi-trash"></i> 刪除
                </button>
            </div>
        </div>

    </div>
</template>

<style scoped>
/* 控制輸入框最大寬度，讓畫面更清爽 */
.col-lg-8 {
    max-width: 800px;
    /* 設定固定寬度 */
}

.column-width {
    width: 12%;
    /* 或者根據需求設定適合的百分比 */
    text-align: center;
}

/* 控制按鈕容器與內容之間的間距 */
.d-flex {
    padding-top: 15px;
    padding-bottom: 15px;
    margin-top: 30px;
    margin-bottom: 20px;
}

/* 讓邊界更清晰 */
.border-top {
    border-top: 1px solid #ddd;
    /* 添加一條淡灰色的頂部邊框 */
}
</style>