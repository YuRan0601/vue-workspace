<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import Swal from "sweetalert2"; // 引入 SweetAlert2

// 接收從父組件傳遞的 orderId
const props = defineProps({
    orderId: {
        type: String,
        required: true,
    },
});

// 訂單詳細資料
const orderDetail = ref({});
const errorMessage = ref(""); // 錯誤訊息，用於顯示錯誤
// 各欄位的錯誤訊息
const errors = ref({
    receiveName: "",
    email: "",
    phoneNumber: "",
    address: "",
});

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

// 表單驗證邏輯
const validateForm = () => {
    let isValid = true;

    // 驗證收件人
    if (!orderDetail.value.receiveName || !orderDetail.value.receiveName.trim()) {
        errors.value.receiveName = "收件人欄位不得為空！";
        isValid = false;
    } else {
        errors.value.receiveName = "";
    }

    // 驗證 Email
    if (!orderDetail.value.email || !orderDetail.value.email.trim()) {
        errors.value.email = "Email 欄位不得為空！";
        isValid = false;
    } else {
        errors.value.email = "";
    }

    // 驗證電話號碼
    if (!orderDetail.value.phoneNumber || !orderDetail.value.phoneNumber.trim()) {
        errors.value.phoneNumber = "電話號碼欄位不得為空！";
        isValid = false;
    } else {
        errors.value.phoneNumber = "";
    }

    // 驗證收貨地址
    if (!orderDetail.value.address || !orderDetail.value.address.trim()) {
        errors.value.address = "收貨地址欄位不得為空！";
        isValid = false;
    } else {
        errors.value.address = "";
    }

    return isValid;
};


// SweetAlert2 更新警告
const showUpdateAlert = () => {
    if (validateForm()) { // 表單驗證
        Swal.fire({
            title: "確定要修改此訂單嗎？",
            text: "確認後將保存更改！",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "確定",
            cancelButtonText: "取消",
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn btn-primary text-white me-2",
                cancelButton: "btn btn-secondary text-white",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                updateOrder(); // 執行更新操作
            }
        });
    }
};

// 更新訂單的邏輯
const updateOrder = async () => {
    try {
        // 整理數據，避免空值
        prepareOrderData();

        // 發送更新請求
        await axios.put(
            `/api/Order/update/${orderDetail.value.orderId}`,
            orderDetail.value, // 傳遞整理後的訂單數據
            { headers: { "Content-Type": "application/json" } }
        );

        // 更新成功的提示
        Swal.fire({
            icon: "success",
            title: "修改成功！",
            text: "訂單已成功更新！",
            confirmButtonText: "確認",
            allowOutsideClick: false, // 禁止點擊外部關閉
            customClass: {
                confirmButton: "btn btn-primary text-white",
            },
        }).then(() => {
            // 確認後導回查詢單筆畫面
            window.location.href = `/order/orderdetail?orderId=${orderDetail.value.orderId}`;
        });
    } catch (error) {
        console.error("訂單更新失敗：", error);

        // 更新失敗的提示
        Swal.fire({
            icon: "error",
            title: "修改失敗！",
            text: "請稍後再試！",
            confirmButtonText: "確認",
            customClass: {
                confirmButton: "btn btn-danger text-white",
            },
        });
    }
};

// 整理訂單數據，避免空值
const prepareOrderData = () => {
    // 確保其他欄位有合理預設值
    orderDetail.value.pointsDiscount = orderDetail.value.pointsDiscount || 0;
    orderDetail.value.discountAmount = orderDetail.value.discountAmount || 0;
    orderDetail.value.finalAmount = orderDetail.value.finalAmount || 0;
    // 處理 orderItemsBeans
    if (orderDetail.value.orderItemsBeans) {
        orderDetail.value.orderItemsBeans.forEach((item) => {
            // 如果 unitPrice 或 discount 是 null，補成 0
            item.unitPrice = item.unitPrice || 0;
            item.discount = item.discount || 0;
            // 如果 subtotal 是 null，也補成 0（此處假設後端不計算 subtotal）
            item.subtotal = item.subtotal || 0;
        });
    }
};


// 根據傳遞的 orderId 拉取訂單資料
const fetchOrderDetail = async () => {
    if (!props.orderId) {
        errorMessage.value = "缺少訂單 ID，無法獲取訂單資料。";
        return;
    }
    try {
        errorMessage.value = ""; // 清除之前的錯誤訊息
        const response = await axios.get(`/api/Order/getUpdateOrderById/${props.orderId}`);
        // 按細項編號排序 orderItemsBeans
        response.data.orderItemsBeans.sort((a, b) => a.orderitemId - b.orderitemId);
        orderDetail.value = response.data;
    } catch (error) {
        console.error("無法取得訂單資料：", error);
        errorMessage.value = "無法取得訂單資料，請稍後再試。";
    }
};

// 初始化時拉取資料
onMounted(() => {
    fetchOrderDetail();
});

// 監控 orderId 的變化，確保組件重新加載資料
watch(() => props.orderId, (newOrderId) => {
    if (newOrderId) {
        fetchOrderDetail();
    }
});
</script>


<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">訂單修改表單</h2>

        <!-- 錯誤訊息 -->
        <div v-if="errorMessage" class="alert alert-danger text-center">
            {{ errorMessage }}
        </div>

        <!-- 訂單基本資訊 -->
        <div class="mb-4">
            <h4 class="mb-3">訂單基本資訊</h4>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="orderId" class="form-label">訂單ID</label>
                    <input type="text" class="form-control" id="orderId" :value="orderDetail.orderId" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="userId" class="form-label">使用者ID</label>
                    <input type="text" class="form-control" id="userId" :value="orderDetail.userId" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="orderStatus" class="form-label">訂單狀態</label>
                    <select class="form-select" id="orderStatus" v-model="orderDetail.orderStatus">
                        <option value="處理中">處理中</option>
                        <option value="已出貨">已出貨</option>
                        <option value="已取消">已取消</option>
                        <option value="已取消">到物流</option>
                    </select>
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="paymentMethod" class="form-label">付款方式</label>
                    <input type="text" class="form-control" id="paymentMethod" :value="orderDetail.paymentMethod"
                        disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="totalAmount" class="form-label">總金額</label>
                    <input type="text" class="form-control" id="totalAmount" :value="orderDetail.totalAmount"
                        disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="pointsDiscount" class="form-label">點數折抵</label>
                    <input type="text" class="form-control" id="pointsDiscount" v-model="orderDetail.pointsDiscount"
                        disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="discountAmount" class="form-label">折扣金額</label>
                    <input type="text" class="form-control" id="discountAmount" v-model="orderDetail.discountAmount"
                        disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="finalAmount" class="form-label">最終金額</label>
                    <input type="text" class="form-control" id="finalAmount" :value="orderDetail.finalAmount"
                        disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="orderDate" class="form-label">訂單創建日期</label>
                    <input type="text" class="form-control" id="orderDate"
                        :value="formatDateTime(orderDetail.orderDate)" disabled />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="updatedAt" class="form-label">訂單更新日期</label>
                    <input type="text" class="form-control" id="updatedAt"
                        :value="formatDateTime(orderDetail.updatedAt)" disabled />
                </div>
            </div>
        </div>
        <!-- 收件人資訊 -->
        <div class="mb-4">
            <h4 class="mb-3">收件人資訊</h4>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="receiveName" class="form-label">收件人
                        <small v-if="errors.receiveName" class="text-danger ms-2">{{ errors.receiveName }}</small>
                    </label>
                    <input type="text" class="form-control" id="receiveName" v-model="orderDetail.receiveName"
                        @blur="validateForm" />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="email" class="form-label">Email
                        <small v-if="errors.email" class="text-danger ms-2">{{ errors.email }}</small>
                    </label>
                    <input type="email" class="form-control" id="email" v-model="orderDetail.email"
                        @blur="validateForm" />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="phoneNumber" class="form-label">電話號碼
                        <small v-if="errors.phoneNumber" class="text-danger ms-2">{{ errors.phoneNumber }}</small>
                    </label>
                    <input type="text" class="form-control" id="phoneNumber" v-model="orderDetail.phoneNumber"
                        @blur="validateForm" />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="address" class="form-label">收貨地址
                        <small v-if="errors.address" class="text-danger ms-2">{{ errors.address }}</small>
                    </label>
                    <input type="text" class="form-control" id="address" v-model="orderDetail.address"
                        @blur="validateForm" />
                </div>
            </div>
        </div>
        <!-- 商品明細 -->
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
                    <tr v-for="item in orderDetail.orderItemsBeans" :key="item.orderitemId"
                        class="text-center align-middle">
                        <!-- 細項編號 -->
                        <td>{{ item.orderitemId }}</td>
                        <input type="hidden" :name="'order_item_id_' + item.orderitemId" :value="item.orderitemId" />
                        <!-- 產品名稱 -->
                        <td>{{ item.products.name }}</td>
                        <input type="hidden" :name="'product_id_' + item.orderitemId"
                            :value="item.products.productId" />
                        <!-- 數量（顯示不可編輯，並隱藏回傳原數量） -->
                        <td>{{ item.quantity }}</td>
                        <input type="hidden" :name="'quantity_' + item.orderitemId" :value="item.quantity" />
                        <!-- 單價 -->
                        <td>{{ item.products.price }}</td> <!-- 使用 products.price 來顯示單價 -->
                        <input type="hidden" :name="'unit_price_' + item.orderitemId" :value="item.products.price" />
                        <!-- 折扣（顯示不可編輯，並隱藏回傳原折扣） -->
                        <td>{{ item.discount || 0 }}</td>
                        <input type="hidden" :name="'discount_' + item.orderitemId" :value="item.discount || 0" />
                        <!-- 小計（顯示並回傳隱藏欄位） -->
                        <td>{{ item.subtotal.toFixed(2) }}</td>
                        <input type="hidden" :name="'subtotal_' + item.orderitemId" :value="item.subtotal.toFixed(2)" />
                    </tr>
                </tbody>
            </table>
            <!-- 按鈕區 -->
            <div class="d-flex justify-content-between align-items-center mt-5 mb-4 py-3 border-top">
                <!-- 返回按鈕 -->
                <RouterLink :to="{ name: 'orderList' }" class="btn btn-secondary">
                    <i class="bi bi-arrow-left"></i> 返回
                </RouterLink>
                <div>
                    <!-- 編輯按鈕 -->
                    <button class="btn btn-warning" @click="showUpdateAlert">
                        <i class="bi bi-pencil-square"></i> 編輯確認
                    </button>
                    <!-- 刪除按鈕 -->
                    <!-- <button class="btn btn-danger" @click="showDeleteAlert">
                    <i class="bi bi-trash"></i> 刪除
                </button> -->
                </div>
            </div>
        </div>

    </div>
</template>


<style lang="css" scoped>
.column-width {
    width: 12%;
    /* 或者根據需求設定適合的百分比 */
    text-align: center;
}

input[type="number"] {
    text-align: center;
    /* 數字置中 */
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

small.text-danger {
    font-size: 0.875rem;
    /* 調整字體大小 */
    margin-left: 0.5rem;
    /* 與標籤的間距 */
}
</style>