<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL

const route = useRoute()
const productId = route.params.id

const product = ref(null)

const getOneProduct = async () => {
  const GETONE_URL = `${BASE_URL}Product/select/${productId}`
  const response = await fetch(GETONE_URL)
  const data = await response.json()
  product.value = data[0] //不用會是[{ ... }] (陣列) 取不到資料，要有data[0]會是{ ... } (物件) 才能取到資料
}
getOneProduct()


function addToCart(product) {
  Swal.fire({
    icon: 'success',
    title: '加入購物車',
    text: `已將「${product.productName}」加入購物車！`,
  })
}


function shopping(product) {
  Swal.fire({
    icon: 'success',
    title: '直接購買',
    text: `已將「${product.productName}」購買！`,
  })
}

</script>

<template>
  <div v-if="product" class="product-detail-wrapper">
    <h2>{{ product.productName }}</h2>
        <div v-for="(img, index) in product.OneToManyProductImages" :key="index">
            <img :src="BASE_URL + img.imageUrl" alt="商品圖片" />
        </div>
    <p>價格：{{ product.price }}</p>
    <p v-if="product.specialPrice">特價：{{ product.specialPrice }}</p>
    <p>描述：{{ product.description }}</p>
    <button @click="shopping(product)">直接購買</button>
    <button @click="addToCart(product)">加入購物車</button>
  </div>
  <div v-else>
    載入中...
  </div>
</template>

<style scoped>
.product-detail-wrapper {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}
</style>
