<script setup>
import { reactive, ref, onMounted, watch } from "vue";
import axios from "axios"; // 引入 axios 用於 API 請求
import Swal from "sweetalert2"; // 引入 SweetAlert2

// ===== 1. 數據定義 =====
const order = reactive({
    userId: "",
    receiveName: "",
    email: "",
    phoneNumber: "",
    address: "",
    status: "", // 訂單狀態預設為空白
    paymentMethod: "", // 付費方式
    totalAmount: 0,
    discountPoints: 0, // 點數
    discount: 0, // 折扣金額
    finalAmount: 0,
});

const orderItems = reactive([
    { productId: null, quantity: 1, price: 0, discount: 0, subtotal: 0 },
]);

const products = ref([]); // 商品清單使用 ref 來動態更新

// ===== 2. 數據加載與初始化 =====
const loadProducts = async () => {
    try {
        const response = await axios.get("http://localhost:8080/CloudSerenityHotel/Product/selectAll");
        products.value = response.data.map((product) => ({
            id: product.productId, // 產品 ID
            name: product.productName, // 修正為 productName
            price: product.price, // 單價
        }));
    } catch (error) {
        console.error("無法加載商品數據：", error);
        alert("無法加載商品數據，請稍後再試！");
    }
};

onMounted(() => {
    loadProducts(); // 動態加載商品數據
});

// ===== 3. 數據更新邏輯 =====
const updatePrice = (index) => {
    const product = products.value.find((p) => p.id === orderItems[index].productId);
    orderItems[index].price = product ? Math.round(product.price) : 0; // 確保單價為整數
    updateSubtotal(index);
};

const updateSubtotal = (index) => {
    const item = orderItems[index];
    // 計算小計，並四捨五入到整數
    item.subtotal = Math.round(item.price * item.quantity - item.discount);
    updateTotalAmount();
};

const updateTotalAmount = () => {
    // 累加所有小計，並四捨五入到整數
    order.totalAmount = Math.round(
        orderItems.reduce((sum, item) => sum + item.subtotal, 0)
    );
    updateFinalAmount();
};

const updateFinalAmount = () => {
    // 確保最終金額為整數
    order.finalAmount = Math.round(order.totalAmount - order.discount);
};

// ===== 4. 訂單明細操作 =====
// 新增一行商品明細
const addItem = () => {
    orderItems.push({
        productId: null, // 預設未選擇商品
        quantity: 1, // 預設數量為 1
        price: 0, // 單價預設為 0
        discount: 0, // 折扣預設為 0
        subtotal: 0, // 小計預設為 0
    });
};

// 刪除指定商品行，並更新總金額
const removeItem = (index) => {
    orderItems.splice(index, 1); // 刪除指定的商品行
    updateTotalAmount(); // 刪除後更新總金額
};

// ===== 5. 表單驗證與訂單提交 =====
const validateForm = () => {
    if (!order.userId) {
        showErrorAlert("使用者ID未填寫！", "請輸入使用者ID！");
        return false;
    }
    if (!order.status) { // 新增的檢查邏輯
        showErrorAlert("訂單狀態未選擇！", "請選擇訂單狀態！");
        return false;
    }
    if (!order.paymentMethod) {
        showErrorAlert("付費方式未選擇！", "請選擇付費方式！");
        return false;
    }
    if (!order.receiveName) {
        showErrorAlert("收件人姓名未填寫！", "請輸入收件人姓名！");
        return false;
    }
    if (!order.email) {
        showErrorAlert("收件人email！", "請輸入收件人email！");
        return false;
    }
    if (!order.phoneNumber) {
        showErrorAlert("收件人電話號碼未填寫！", "請輸入收件人電話號碼！");
        return false;
    }
    if (!order.address) {
        showErrorAlert("收件人收貨地址未填寫！", "請輸入收件人收貨地址！");
        return false;
    }
    if (orderItems.length === 0) {
        showErrorAlert("訂單明細為空！", "請至少新增一項商品！");
        return false;
    }
    for (const item of orderItems) {
        if (!item.productId) {
            showErrorAlert("商品未選擇！", "請選擇一個商品！");
            return false;
        }
        if (item.quantity <= 0) {
            showErrorAlert("商品數量有誤！", "數量必須大於 0！");
            return false;
        }
    }
    return true;
};



const showAddOrderAlert = () => {
    if (validateForm()) {
        Swal.fire({
            title: "確定要新增此訂單嗎？",
            text: "確認後將提交訂單！",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "新增",
            cancelButtonText: "取消",
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn btn-success text-white me-2",
                cancelButton: "btn btn-secondary text-white",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                // 注意：需要將 `order` 和 `orderItems` 合併為一個物件發送給後端
                addOrder({ ...order, orderItems });
            }
        });
    }
};

// 新增訂單的邏輯
const addOrder = async () => {
    try {
        // 整理訂單數據
        const orderPayload = {
            userId: order.userId,
            receiveName: order.receiveName,
            email: order.email,
            phoneNumber: order.phoneNumber,
            address: order.address,
            orderStatus: order.status,
            paymentMethod: order.paymentMethod, // 付費方式
            orderItemsBeans: orderItems.map((item) => ({
                quantity: item.quantity,
                unitPrice: item.price,
                discount: item.discount || 0,
                products: { productId: item.productId },
            })),
        };

        // 發送新增請求
        const response = await axios.post(
            "/api/Order/add",
            orderPayload,
            { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.success) {
            // 新增成功的提示
            Swal.fire({
                icon: "success",
                title: "新增成功！",
                text: `訂單已成功新增！訂單編號：${response.data.orderId}`,
                confirmButtonText: "確認",
                allowOutsideClick: false, // 禁止點擊外部關閉
                customClass: {
                    confirmButton: "btn btn-success text-white",
                },
            }).then(() => {
                // 確認後導回查詢單筆畫面
                window.location.href = `/order/orderdetail?orderId=${response.data.orderId}`;
            });
        } else {
            // 新增失敗的提示
            Swal.fire({
                icon: "error",
                title: "新增失敗！",
                text: response.data.message || "請稍後再試！",
                confirmButtonText: "確認",
                customClass: {
                    confirmButton: "btn btn-danger text-white",
                },
            });
        }
    } catch (error) {
        console.error("訂單新增失敗：", error);

        // 新增失敗的提示
        Swal.fire({
            icon: "error",
            title: "新增失敗！",
            text: "請稍後再試！",
            confirmButtonText: "確認",
            customClass: {
                confirmButton: "btn btn-danger text-white",
            },
        });
    }
};



// ===== 6. 通用方法 =====
const resetForm = () => {
    order.userId = "";
    order.receiveName = "";
    order.email = "";
    order.phoneNumber = "";
    order.address = "";
    order.status = "";
    order.totalAmount = 0;
    order.discountPoints = 0;
    order.discount = 0;
    order.finalAmount = 0;
    orderItems.splice(0, orderItems.length, {
        productId: null,
        quantity: 1,
        price: 0,
        discount: 0,
        subtotal: 0,
    });
};

const showErrorAlert = (title, text) => {
    Swal.fire({
        title,
        text,
        icon: "error",
        confirmButtonText: "確定",
        confirmButtonColor: "#dc3545",
    });
};
</script>


<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">訂單新增表單</h2>

        <!-- 訂單基本資訊 -->
        <div class="mb-4">
            <h4 class="mb-3">訂單基本資訊</h4>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="userId" class="form-label">使用者ID</label>
                    <input type="text" class="form-control" v-model="order.userId" placeholder="請輸入使用者ID" />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="orderStatus" class="form-label">訂單狀態</label>
                    <select class="form-select" v-model="order.status" id="orderStatus">
                        <option value="">請選擇訂單狀態</option>
                        <option value="處理中">處理中</option>
                        <option value="已出貨">已出貨</option>
                        <option value="已取消">已取消</option>
                        <option value="到物流">到物流</option>
                    </select>
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="paymentMethod" class="form-label">付費方式</label>
                    <select class="form-select" v-model="order.paymentMethod" id="paymentMethod">
                        <option value="">請選擇付費方式</option>
                        <option value="信用卡">信用卡</option>
                        <option value="貨到付款">貨到付款</option>
                        <option value="銀行轉帳">銀行轉帳</option>
                    </select>
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="totalAmount" class="form-label">總金額</label>
                    <input type="text" id="totalAmount" class="jelly-input" :value="order.totalAmount" readonly />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="discountPoints" class="form-label">點數折抵</label>
                    <input type="number" class="form-control" v-model.number="order.discountPoints"
                        placeholder="若無點數折抵,可略過" min="0" />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="discount" class="form-label">折扣金額</label>
                    <input type="text" class="jelly-input" :value="order.discount" readonly />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="finalAmount" class="form-label">最終金額</label>
                    <input type="text" class="jelly-input" :value="order.finalAmount" readonly />
                </div>
            </div>
        </div>

        <!-- 收件人資訊 -->
        <div class="mb-4">
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="receiveName" class="form-label">收件人</label>
                    <input type="text" class="form-control" id="receiveName" placeholder="請輸入收件人姓名"
                        v-model="order.receiveName" />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="email" class="form-label">Email</label>
                    <input type="text" class="form-control" id="email" placeholder="請輸入Email" v-model="order.email" />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="phoneNumber" class="form-label">電話號碼</label>
                    <input type="text" class="form-control" id="phoneNumber" placeholder="請輸入電話號碼"
                        v-model="order.phoneNumber" />
                </div>
            </div>
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="address" class="form-label">收貨地址</label>
                    <input type="text" class="form-control" id="address" placeholder="請輸入收貨地址"
                        v-model="order.address" />
                </div>
            </div>
        </div>

        <!-- 商品明細 -->
        <div class="mb-4">
            <h4 class="mb-3">訂單明細</h4>
            <table class="table table-hover table-bordered">
                <thead class="table-light text-center">
                    <tr>
                        <th>產品名稱</th>
                        <th>數量</th>
                        <th>單價</th>
                        <th>折扣</th>
                        <th>小計</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in orderItems" :key="index">
                        <td>
                            <select v-model="item.productId" @change="updatePrice(index)" class="form-select">
                                <option value="">請選擇產品</option>
                                <option v-for="product in products" :key="product.id" :value="product.id">{{
                                    product.name }}</option>
                            </select>
                        </td>
                        <td>
                            <input type="number" v-model.number="item.quantity" @input="updateSubtotal(index)"
                                class="form-control" min="1" />
                        </td>
                        <td>
                            <input type="text" :value="item.price" readonly class="form-control" />
                        </td>
                        <td>
                            <input type="number" v-model.number="item.discount" @input="updateSubtotal(index)"
                                class="form-control" />
                        </td>
                        <td>{{ item.subtotal }}</td>
                        <td>
                            <button @click="removeItem(index)" class="btn btn-danger btn-sm">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button @click="addItem" class="btn btn-primary "><i class="bi bi-bag me-2"></i>新增商品</button>
        </div>

        <!-- 按鈕區 -->
        <div class="d-flex justify-content-between align-items-center mt-5 mb-4 py-3 border-top">
            <!-- 返回按鈕 -->
            <RouterLink :to="{ name: 'orderList' }" class="btn btn-secondary">
                <i class="bi bi-arrow-left"></i> 返回
            </RouterLink>
            <div>
                <!-- 新增訂單按鈕 -->
                <button class="button-29" role="button" @click="showAddOrderAlert">
                    <i class="bi bi-journal-text me-2"></i>新增訂單確認
                </button>
            </div>
        </div>

    </div>
</template>
<style lang="css" scoped>
/* 共用樣式 */
.jelly-input {
    background-color: #f1f3f5;
    /* 更淡的灰色背景 */
    border: 1px solid #dee2e6;
    /* 更柔和的邊框顏色 */
    border-radius: 6px;
    /* 稍小的圓角 */
    padding: 10px 15px;
    /* 內邊距 */
    font-size: 16px;
    /* 字體大小 */
    font-weight: 500;
    /* 字體粗細 */
    color: #495057;
    /* 深灰色文字 */
    width: 100%;
    /* 寬度與其他欄位一致 */
    box-shadow: inset 0px 1px 2px rgba(0, 0, 0, 0.1);
    /* 更柔和的內部陰影 */
    outline: none;
    /* 移除聚焦時的外框 */
}

.jelly-input[readonly]:hover {
    background-color: #e9ecef;
    /* hover 時背景稍微變深 */
}

/* 表格樣式 */
.table th,
.table td {
    text-align: center;
    /* 水平置中 */
    vertical-align: middle;
    /* 垂直置中 */
}

/* 只針對訂單明細的數字輸入框樣式 */
.table tbody input[type="number"] {
    text-align: center;
    /* 數字置中 */
    border: 1px solid #dee2e6;
    /* 與其他欄位一致 */
    border-radius: 6px;
    width: 100%;
}

/* 只針對訂單明細的下拉選單 */
.table tbody select.form-select {
    text-align: center;
    text-align-last: center;
    /* 選中後的文字也置中 */
    border: 1px solid #dee2e6;
    border-radius: 6px;
}

/* 除了操作欄之外，其他欄位平分 */
.table th:not(:last-child),
.table td:not(:last-child) {
    width: calc((100% - 8%) / 5);
    /* 平分剩下的寬度 */
}

/* 固定操作欄寬度 */
.table th:last-child,
.table td:last-child {
    width: 8%;
    /* 操作欄固定 10% */
}

/* 單價與小計欄位一致 */
.table td input[readonly],
.table td input[readonly]:hover {
    background-color: #f1f3f5;
    /* 保持一致的果凍風格 */
    text-align: center;
    /* 水平置中 */
    border: 1px solid #dee2e6;
    /* 同一樣式 */
    font-size: 16px;
    /* 與小計一致 */
    width: 100%;
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

/* 新增訂單確認按鈕 */
/* CSS */
.button-29 {
    align-items: center;
    appearance: none;
    background-image: radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%);
    border: 0;
    border-radius: 6px;
    box-shadow: rgba(45, 35, 66, .4) 0 2px 4px, rgba(45, 35, 66, .3) 0 7px 13px -3px, rgba(58, 65, 111, .5) 0 -3px 0 inset;
    box-sizing: border-box;
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    font-family: "JetBrains Mono", monospace;
    height: 48px;
    justify-content: center;
    line-height: 1;
    list-style: none;
    overflow: hidden;
    padding-left: 16px;
    padding-right: 16px;
    position: relative;
    text-align: left;
    text-decoration: none;
    transition: box-shadow .15s, transform .15s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    will-change: box-shadow, transform;
    font-size: 18px;
}

.button-29:focus {
    box-shadow: #3c4fe0 0 0 0 1.5px inset, rgba(45, 35, 66, .4) 0 2px 4px, rgba(45, 35, 66, .3) 0 7px 13px -3px, #3c4fe0 0 -3px 0 inset;
}

.button-29:hover {
    box-shadow: rgba(45, 35, 66, .4) 0 4px 8px, rgba(45, 35, 66, .3) 0 7px 13px -3px, #3c4fe0 0 -3px 0 inset;
    transform: translateY(-2px);
}

.button-29:active {
    box-shadow: #3c4fe0 0 3px 7px inset;
    transform: translateY(2px);
}
</style>
