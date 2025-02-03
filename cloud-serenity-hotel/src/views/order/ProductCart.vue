<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import axios from "axios";
import { useAuthStore } from "@/stores/authStore"; // 引入Pinia的authStore
import { useCartStore } from "@/stores/cartStore"; // 引入Pinia的cartStore
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;
const router = useRouter();

// 引入Pinia store來獲取用戶資料
const authStore = useAuthStore();
const cartStore = useCartStore();  // 使用 Pinia store

const cartItems = ref([]); // 購物車商品列表
const cartTotal = ref(0); // 購物車總金額

// 確保用戶已經登入
const userId = authStore.user?.userId;

if (!userId) {
    Swal.fire({
        icon: 'warning',
        title: '請先登入',
        text: '您需要先登入才能查看購物車！',
        confirmButtonColor: "#6a0dad",
        confirmButtonText: '去登入',
        allowOutsideClick: false, // 禁止點擊外部關閉
        customClass: {
            confirmButton: "btn text-white me-2",
        },
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/login'; // 重定向到登入頁
        }
    });
}

// 獲取購物車內容
const fetchCartItems = async () => {
    try {
        const response = await axios.get(`/api/Cart/findAllCartItems`, {
            params: { userId },
        });
        cartItems.value = response.data.map(item => ({
            ...item,
            isSelected: false, // 初始化每個商品的選擇狀態
        }));
        calculateTotal(); // 計算總金額
    } catch (error) {
        console.error("無法載入購物車資料：", error);
    }
};

// 計算購物車總金額
const calculateTotal = () => {
    cartTotal.value = cartItems.value.reduce((total, item) => {
        if (item.isSelected) {
            return total + item.subtotal; // 累加選中的商品金額
        }
        return total;
    }, 0);
};

// 刪除商品
const removeFromCart = async (cartItemId, productId) => {
    try {
        // 傳遞 userId 和 productId 參數
        await axios.delete(`/api/Cart/delete`, {
            params: { userId, productId }
        });
        cartItems.value = cartItems.value.filter((item) => item.cartItemId !== cartItemId); // 更新購物車列表
        Swal.fire({
            icon: 'success',
            title: '商品已刪除',
            confirmButtonText: "OK",
            confirmButtonColor: "#6c757d",
            allowOutsideClick: false, // 禁止點擊外部關閉
            customClass: {
                confirmButton: "btn text-white me-2",
            },
        });
    } catch (error) {
        Swal.fire("刪除失敗", "請稍後再試", "error");
    }
};

// 更新選擇商品狀態
const updateSelection = () => {
    calculateTotal();  // 每次選擇變更後，重新計算總金額
};

// 更新數量
const updateQuantity = async (cartItemId, quantity) => {
    console.log("cartItemId:", cartItemId, "quantity:", quantity); // Debugging log

    if (quantity <= 0) {
        Swal.fire({
            title: '確定要刪除此商品嗎?',
            text: "數量為0時將自動刪除此商品。",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#d33", // 確認按鈕顏色
            cancelButtonColor: "#6c757d", // 取消按鈕顏色
            confirmButtonText: '刪除',
            cancelButtonText: '取消',
            buttonsStyling: false, // 停用 SweetAlert2 預設樣式
            customClass: {
                confirmButton: "btn btn-danger text-white me-2", // 自定義確認按鈕
                cancelButton: "btn btn-secondary text-white", // 自定義取消按鈕
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                await removeFromCart(cartItemId);
            } else {
                fetchCartItems(); // 恢復商品列表
            }
        });
        return;
    }

    const index = cartItems.value.findIndex(item => item.cartItemId === cartItemId);
    if (index !== -1) {
        cartItems.value[index].quantity = quantity;
        cartItems.value[index].subtotal = quantity * cartItems.value[index].unitPrice;

        try {
            // 記錄更新商品的請求
            console.log("Updating cartItemId:", cartItemId, "with quantity:", quantity); // Debugging log

            await axios.put(`/api/Cart/update`, null, {
                params: {
                    userId,
                    productId: cartItems.value[index].productId,
                    newQuantity: quantity
                }
            });

            calculateTotal();

            cartItems.value = [...cartItems.value]; // 讓 Vue 重新渲染商品
        } catch (error) {
            console.error("更新購物車數量失敗", error);
        }
    }
};

// 在購物車頁面進行跳轉
const goToCheckout = () => {
    // 篩選選中的商品並儲存至 Pinia store
    const selectedItems = cartItems.value.filter(item => item.isSelected);
    //console.log("Selected Items:", selectedItems);  // 查看選中的商品資料
    cartStore.setSelectedItems(selectedItems); // 使用 Pinia store 設定選中的商品

    router.push({
        name: 'productRecipient', // 跳轉至下一頁
    });
};

onMounted(() => {
    fetchCartItems();
});
</script>

<template>
    <div>
        <v-container>
            <h2 class="cart-title">購物車清單</h2>
            <v-row v-for="item in cartItems" :key="item.cartItemId" class="cart-item">
                <v-col cols="12" sm="6" md="12">
                    <v-card class="d-flex align-center product-card">
                        <!-- 勾選放在最前面 -->
                        <v-checkbox v-model="item.isSelected" label="選擇購買" @change="updateSelection"></v-checkbox>

                        <!-- 圖片與商品名距離更近 -->
                        <v-img :src="BASE_URL + '/' + item.imageUrl" alt="product image" class="product-image"></v-img>
                        <v-card-title class="product-name">{{ item.productName }}</v-card-title>

                        <v-card-subtitle>
                            <span v-if="item.discount > 0">
                                <span class="original-price">${{ item.unitPrice }}</span>
                                <span class="special-price">${{ (item.unitPrice - item.discount).toFixed(0) }}</span>
                            </span>
                            <span v-else class="normal-price">{{ item.unitPrice }}</span>
                        </v-card-subtitle>

                        <v-card-actions class="d-flex justify-space-between">
                            <!-- 顯示數量 -->
                            <v-btn @click="updateQuantity(item.cartItemId, item.quantity - 1)" small>-</v-btn>
                            {{ item.quantity }}
                            <v-btn @click="updateQuantity(item.cartItemId, item.quantity + 1)" small>+</v-btn>

                            <span>${{ item.subtotal }}</span>

                            <!-- 刪除按鈕 -->
                            <v-btn @click="removeFromCart(item.cartItemId, item.productId)" color="red" small>刪除</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-row>
            <v-col class="text-center">
                <h3>總金額：${{ cartTotal }}</h3>
            </v-col>
        </v-row>

        <v-row>
            <v-col class="text-center">
                <v-btn color="primary" @click="goToCheckout" :disabled="!cartItems.some(item => item.isSelected)">
                    去結帳
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<style lang="css" scoped>
.cart-title {
    text-align: left;
    margin-left: 175px;
}

.v-card {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    /* 讓內容靠左顯示 */
    padding: 10px;
    align-items: center;
    width: 70%;
    margin: 0 auto;
}

.product-card {
    width: 80%;
    /* 增大卡片寬度 */
    margin: 10px auto;
    /* 中央對齊 */
}

.v-container {
    text-align: center;
}

.v-row {
    justify-content: center;
}

.v-col {
    display: flex;
    justify-content: center;
}

.product-image {
    width: 80px;
    /* 調整圖片大小 */
    height: 80px;
    object-fit: cover;
    margin-right: 10px;
    /* 降低圖片與商品名之間的間距 */
}

.product-name {
    flex: 1;
    /* 讓商品名稱佔據剩餘空間 */
    font-size: 16px;
    font-weight: bold;
    margin-right: 10px;
    /* 避免商品名和價格擁擠 */
}

.v-card-subtitle {
    font-size: 14px;
    color: gray;
}

.v-card-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.original-price {
    font-size: 16px;
    color: black;
    text-decoration: line-through;
}

.special-price {
    font-size: 18px;
    color: red;
    font-weight: bold;
}

.normal-price {
    font-size: 18px;
    color: black;
}

.v-btn {
    margin: 5px;
}
</style>
