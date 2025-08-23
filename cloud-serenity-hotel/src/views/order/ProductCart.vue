<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import Swal from 'sweetalert2';

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL
const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const userId = authStore.user?.userId;

const cartItems = ref([]);
const cartTotal = ref(0);
const selectAll = ref(false);

// 取得購物車列表
const fetchCartItems = async () => {
    try {
        const { data } = await axios.get("/api/cart/items", { params: { userId } });
        cartItems.value = data.data.map(item => ({
            ...item,
            isSelected: false,
            // 計算小計，如果後端沒提供
            subtotal: (item.unitPrice - (item.discount || 0)) * item.quantity
        }));
        calculateTotal();
    } catch (error) {
        console.error("取得購物車失敗", error);
    }
};

// 計算總金額
const calculateTotal = () => {
    cartTotal.value = cartItems.value
        .filter(item => item.isSelected)
        .reduce((sum, item) => sum + item.subtotal, 0);
};

// 更新商品數量
const updateQuantity = async (productId, newQuantity) => {
    // 如果減到 0 或 1，先確認是否刪除
    if (newQuantity <= 0) {
        const result = await Swal.fire({
            title: '確認刪除',
            text: '數量已降到 0，是否要從購物車移除該商品？',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '刪除',
            cancelButtonText: '取消',
            customClass: {
                confirmButton: 'btn btn-danger text-white me-2', // 紅底白字
                cancelButton: 'btn btn-secondary text-white'     // 灰底白字
            },
            buttonsStyling: false
        });
        if (result.isConfirmed) {
            removeFromCart(productId);
        }
        return;
    }

    try {
        await axios.put(`/api/cart/items/${productId}`, null, { params: { userId, newQuantity } });
        fetchCartItems();
    } catch (error) {
        console.error("更新數量失敗", error);
    }
};

// 刪除商品
const removeFromCart = async (productId) => {
    Swal.fire({
        title: "確定要刪除這個商品嗎？",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "刪除",
        cancelButtonText: "取消",
        customClass: {
            confirmButton: 'btn btn-danger text-white me-2', // 紅底白字
            cancelButton: 'btn btn-secondary text-white'     // 灰底白字
        },
        buttonsStyling: false
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/cart/items/${productId}`, { params: { userId } });
                Swal.fire("已刪除!", "", "success");
                fetchCartItems(); // 更新購物車列表
            } catch (error) {
                console.error("刪除商品失敗", error);
                Swal.fire("刪除失敗", "請稍後再試", "error");
            }
        }
    });
};

const deleteAll = async () => {
    const result = await Swal.fire({
        title: '確定要清空購物車嗎？',
        text: '這將會移除所有商品！',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '清空',
        cancelButtonText: '取消',
        customClass: {
            confirmButton: 'btn btn-danger text-white me-2',
            cancelButton: 'btn btn-secondary text-white'
        },
        buttonsStyling: false
    });

    if (result.isConfirmed) {
        try {
            await axios.delete('/api/cart/items', { params: { userId } });
            Swal.fire('購物車已清空!', '', 'success');
            fetchCartItems(); // 重新載入購物車
        } catch (error) {
            console.error('清空購物車失敗', error);
            Swal.fire('清空失敗', '請稍後再試', 'error');
        }
    }
};

// 勾選全部購物車商品
const toggleSelectAll = () => {
    cartItems.value.forEach(item => {
        item.isSelected = selectAll.value;
    });
    calculateTotal();
};

// 監聽-> 勾選全部
watch(
    cartItems,
    (newItems) => {
        // 如果全部勾選，selectAll = true；否則 false
        selectAll.value = newItems.length > 0 && newItems.every(item => item.isSelected);
        calculateTotal();
    },
    { deep: true }
);


// 去結帳
const goToCheckout = () => {
    const selectedItems = cartItems.value.filter(item => item.isSelected);
    if (!selectedItems.length) return; // 避免空陣列
    cartStore.setSelectedItems(selectedItems); // 更新 Pinia
    router.push({ name: "productRecipient" }); // 不再傳 params
};

onMounted(() => {
    fetchCartItems();
});
</script>
<template>
    <div>
        <v-container>
            <h2 class="cart-title">購物車清單</h2>
            <!-- 全選 + 清空購物車 -->
            <v-row>
                <v-col cols="12">
                    <v-card class="product-card cart-controls-card d-flex align-center justify-space-between">
                        <!-- 左邊：全選 -->
                        <v-checkbox v-model="selectAll" label="全選" @change="toggleSelectAll" class="checkbox-align" />

                        <!-- 右邊：清空購物車 -->
                        <v-btn color="deep-orange-darken-4" @click="deleteAll">
                            <i class="bi bi-trash"></i> 清空購物車
                        </v-btn>
                    </v-card>
                </v-col>
            </v-row>

            <v-row v-for="item in cartItems" :key="item.cartItemId" class="cart-item">
                <v-col cols="12" sm="6" md="12">
                    <v-card class="product-card d-flex align-center">

                        <!-- 勾選商品 -->
                        <v-checkbox v-model="item.isSelected" @change="calculateTotal" label="選擇購買" />

                        <!-- 商品圖片 -->
                        <v-img :src="BASE_URL + item.imageUrl" alt="product image" class="product-image"></v-img>

                        <!-- 商品名稱與價格 -->
                        <v-card-title class="product-name">{{ item.productName }}</v-card-title>
                        <v-card-subtitle>
                            <span v-if="item.discount > 0">
                                <span class="original-price">${{ item.unitPrice }}</span>
                                <span class="special-price">${{ (item.unitPrice - item.discount).toFixed(0) }}</span>
                            </span>
                            <span v-else class="normal-price">${{ item.unitPrice }}</span>
                        </v-card-subtitle>

                        <!-- 數量與小計 -->
                        <v-card-actions class="d-flex align-center justify-end">
                            <v-btn @click="updateQuantity(item.productId, item.quantity - 1)" small>-</v-btn>
                            <span class="quantity">{{ item.quantity }}</span>
                            <v-btn @click="updateQuantity(item.productId, item.quantity + 1)" small>+</v-btn>
                            <span class="subtotal">${{ item.subtotal }}</span>

                            <!-- 刪除按鈕 -->
                            <v-btn color="red-lighten-2" @click="removeFromCart(item.productId)"
                                class="font-weight-bold">刪除</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>

            <!-- 總金額 -->
            <v-row>
                <v-col class="text-center">
                    <h3>總金額：${{ cartTotal }}</h3>
                </v-col>
            </v-row>

            <!-- 結帳按鈕 -->
            <v-row>
                <v-col class="text-center">
                    <v-btn color="primary" @click="goToCheckout" :disabled="!cartItems.some(item => item.isSelected)">
                        去結帳
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<style scoped>
.cart-title {
    margin-left: 60px;
    text-align: left;
}

.product-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 90%;
    margin: 10px auto;
    padding: 10px;
}

.product-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    margin-right: 10px;
}

.product-name {
    flex: 1;
    font-weight: bold;
    margin-right: 10px;
}

.v-card-subtitle {
    font-size: 14px;
    color: gray;
}

.v-card-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
}

.original-price {
    text-decoration: line-through;
    color: #9e9e9e;
    /* 淺灰色 */
    margin-right: 5px;
}

.special-price {
    font-weight: bold;
    color: red;
}

.normal-price {
    color: black;
    font-weight: bold;
}

.quantity {
    margin: 0 5px;
}

.subtotal {
    margin-left: 10px;
}

.cart-controls-card {
    border: none;
    /* 隱藏邊框 */
    box-shadow: none;
    /* 移除陰影 */
    padding: 10px 0;
    /* 保留上下空間感 */
    margin: 0 auto;
    /* 中心對齊 */
}

/* 統一勾選框左邊距 */
.checkbox-align {
    margin-left: 10px;
    /* 調整成商品卡片勾選框起點 */
}
</style>