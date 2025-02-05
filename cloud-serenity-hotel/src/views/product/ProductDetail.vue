<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'; // 引入 Pinia 的 authStore

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL

const route = useRoute()
const productId = route.params.id

const product = ref(null)
const selectedImage = ref('')
const quantity = ref(1) // 設定商品數量

// 使用 Pinia 的 authStore 來獲取動態 userId
const authStore = useAuthStore();

const getOneProduct = async () => {
  const GETONE_URL = `${BASE_URL}Product/select/${productId}`
  const response = await fetch(GETONE_URL)
  const data = await response.json()
  product.value = data[0] //不用會是[{ ... }] (陣列) 取不到資料，要有data[0]會是{ ... } (物件) 才能取到資料
  if (product.value.OneToManyProductImages.length > 0) {
    selectedImage.value = BASE_URL + product.value.OneToManyProductImages[0].imageUrl
  }
}

getOneProduct()

/*function addToCart(product) {
  Swal.fire({
    icon: 'success',
    title: '加入購物車',
    text: `已將「${product.productName}」加入購物車！ 數量：${quantity.value}`,
  })
}*/

function shopping(product) {
  Swal.fire({
    icon: 'success',
    title: '直接購買',
    text: `已將「${product.productName}」購買！ 數量：${quantity.value}`,
  })
}

function changeImage(imageUrl) {
  selectedImage.value = BASE_URL + imageUrl
}

// 加入購物車
async function addToCart(product) {
  const userId = authStore.user?.userId; // 獲取當前用戶 ID

  if (!userId) {
    // 用戶未登入，提示要求登入
    Swal.fire({
      icon: 'warning',
      title: '請先登入',
      text: '您需要先登入才能將商品加入購物車！',
      confirmButtonColor: "#6a0dad",
      confirmButtonText: '去登入',
      allowOutsideClick: false, // 禁止點擊外部關閉
      customClass: {
        confirmButton: "btn text-white me-2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // 引導用戶跳轉到登入頁面
        window.location.href = '/login'; // 導向正確的登入頁
      }
    });
    return; // 阻止繼續執行
  }

  try {
    await axios.post(`/api/Cart/add`, null, {
      params: {
        userId, // 動態傳入用戶 ID
        productId: product.productId,
        quantity: quantity.value, // 使用輸入的數量
      },
    });

    Swal.fire({
      icon: 'success',
      title: '加入購物車',
      text: `已將「${product.productName}」加入購物車！ 數量：${quantity.value}`,
      confirmButtonColor: "#6a0dad",
      confirmButtonText: "OK",
      allowOutsideClick: false, // 禁止點擊外部關閉
      customClass: {
        confirmButton: "btn text-white me-2",
      },
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '錯誤',
      text: '加入購物車失敗，請稍後再試！',
    });
  }
}
</script>

<template>
  <div v-if="product" class="product-detail-wrapper">
    <div class="product-content">
      <div class="product-image">
        <img :src="selectedImage" alt="商品圖片" class="large-image" />
        <div class="thumbnail-container">
          <img v-for="(img, index) in product.OneToManyProductImages" :key="index" :src="BASE_URL + img.imageUrl"
            alt="商品縮圖" class="thumbnail" @click="changeImage(img.imageUrl)" />
        </div>
      </div>
      <div class="product-info">
        <h2>{{ product.productName }}</h2>
        <p v-if="product.specialPrice" class="price-container">
          <span class="original-price">${{ product.price }}</span>
          <span class="special-price">${{ product.specialPrice }}</span>
        </p>
        <p v-else class="normal-price">${{ product.price }}</p>
        <div class="quantity-container">
          <label for="quantity">數量</label>
          <input id="quantity" type="number" v-model="quantity" min="1" />
        </div>
        <div class="button-container">
          <!-- <button class="buy-btn" @click="shopping(product)">直接購買</button> -->
          <button class="cart-btn" @click="addToCart(product)">加入購物車</button>
        </div>
      </div>
    </div>
    <div v-if="product.description" class="product-description">
      <h3>商品描述</h3>
      <p>{{ product.description }}</p>
    </div>
  </div>

</template>

<style scoped>
.product-detail-wrapper {
  max-width: 1200px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-content {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  width: 100%;
}

.product-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.large-image {
  width: 500px;
  height: 500px;
  object-fit: cover;
  margin-bottom: 10px;
}

.thumbnail-container {
  display: flex;
  gap: 10px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  border: 1px solid #ccc;
}

.product-info {
  flex: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

h2 {
  font-size: 26px;
  margin-bottom: 10px;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
}

.normal-price {
  font-size: 22px;
  color: black;
}

.original-price {
  font-size: 20px;
  color: black;
  text-decoration: line-through;
}

.special-price {
  font-size: 24px;
  color: red;
  font-weight: bold;
}

.quantity-container {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
}

.quantity-container input {
  width: 50px;
  padding: 5px;
  font-size: 16px;
  text-align: center;
}

.button-container {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
}

.buy-btn {
  background-color: #e74c3c;
  color: white;
}

.cart-btn {
  /* background-color: #004080; */
  background-color: #e74c3c;
  color: white;
}

.product-description {
  width: 100%;
  margin-top: 20px;
  text-align: left;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 5px;
}
</style>
