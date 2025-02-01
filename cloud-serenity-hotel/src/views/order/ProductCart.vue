<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore"; // 引入Pinia的authStore
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

// 引入Pinia store來獲取用戶資料
const authStore = useAuthStore();
const cartItems = ref([]); // 購物車商品列表
const cartTotal = ref(0); // 購物車總金額

// 確保用戶已經登入
const userId = authStore.user?.userId;

if (!userId) {
    Swal.fire({
        icon: 'warning',
        title: '請先登入',
        text: '您需要先登入才能查看購物車！',
        confirmButtonText: '去登入',
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
const removeFromCart = async (cartItemId) => {
    try {
        await axios.delete(`/api/Cart/delete`, {
            params: { userId, cartItemId },
        });
        cartItems.value = cartItems.value.filter((item) => item.cartItemId !== cartItemId); // 更新購物車列表
        Swal.fire("商品已刪除", "", "success");
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
    if (quantity <= 0) {
        Swal.fire({
            title: '確定要刪除此商品嗎?',
            text: "數量為0時將自動刪除此商品。",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '刪除',
            cancelButtonText: '取消'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await removeFromCart(cartItemId);
            } else {
                fetchCartItems(); // 恢復商品列表
            }
        });
        return;
    }

    // 找到對應的商品索引
    const index = cartItems.value.findIndex(item => item.cartItemId === cartItemId);
    if (index !== -1) {
        // 直接修改 cartItems.value[index] 確保 Vue 偵測變化
        cartItems.value[index].quantity = quantity;
        cartItems.value[index].subtotal = quantity * cartItems.value[index].unitPrice;

        try {
            // 發送更新請求到後端
            await axios.put(`/api/Cart/update`, null, {
                params: {
                    userId,
                    productId: cartItems.value[index].productId,
                    newQuantity: quantity
                }
            });

            // 更新總金額
            calculateTotal();
        } catch (error) {
            console.error("更新購物車數量失敗", error);
        }
    }
};

onMounted(() => {
    fetchCartItems();
});
</script>

<template>
    <div>
        <h2>購物車清單</h2>
        <v-container>
            <v-row v-for="item in cartItems" :key="item.cartItemId" class="cart-item">
                <v-col cols="12" sm="6" md="12">
                    <v-card class="d-flex align-center">
                        <v-img :src="BASE_URL + '/' + item.imageUrl" alt="product image" class="product-image"></v-img>
                        <v-card-title>{{ item.productName }}</v-card-title>
                        <v-card-subtitle>
                            <span v-if="item.specialPrice"><s>{{ item.price }}</s> {{ item.specialPrice }}</span>
                            <span v-else>{{ item.price }}</span>
                        </v-card-subtitle>
                        <v-card-actions class="d-flex justify-space-between">
                            <v-checkbox v-model="item.isSelected" label="選擇購買" @change="updateSelection"></v-checkbox>

                            <!-- 顯示數量 -->
                            <v-btn @click="updateQuantity(item.cartItemId, item.quantity - 1)" small>-</v-btn>
                            {{ item.quantity }}
                            <v-btn @click="updateQuantity(item.cartItemId, item.quantity + 1)" small>+</v-btn>

                            <span>${{ item.subtotal }}</span>

                            <!-- 刪除按鈕 -->
                            <v-btn @click="removeFromCart(item.cartItemId)" color="red" small>刪除</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-row>
            <v-col class="text-center">
                <v-btn color="primary" @click="goToCheckout" :disabled="!cartItems.some(item => item.isSelected)">
                    去結帳
                </v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col class="text-center">
                <h3>總金額：${{ cartTotal }}</h3>
            </v-col>
        </v-row>
    </div>
</template>

<style lang="css" scoped>
.cart-item {
    margin-bottom: 20px;
}

.v-card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
}

.product-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-right: 15px;
}

.v-card-title,
.v-card-subtitle {
    font-size: 16px;
    font-weight: bold;
}

.v-card-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.v-btn {
    margin: 5px;
}
</style>
