<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL

const route = useRoute()
const productId = route.params.id

const product = ref(null)
const selectedImage = ref('')
const quantity = ref(1) // 設定商品數量

const getOneProduct = async () => {
  const GETONE_URL = `${BASE_URL}Product/select/${productId}`
  const response = await fetch(GETONE_URL)
  const data = await response.json()
  product.value = data[0]
  if (product.value.OneToManyProductImages.length > 0) {
    selectedImage.value = BASE_URL + product.value.OneToManyProductImages[0].imageUrl
  }
}

getOneProduct()

function addToCart(product) {
  Swal.fire({
    icon: 'success',
    title: '加入購物車',
    text: `已將「${product.productName}」加入購物車！ 數量：${quantity.value}`,
  })
}

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
          <button class="buy-btn" @click="shopping(product)">直接購買</button>
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
  background-color: #004080;
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
