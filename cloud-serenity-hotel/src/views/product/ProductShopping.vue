<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL
const GETALL_URL = `${BASE_URL}Product/selectAll`

const products = ref([])

// Router 實例 (方便導頁)
const router = useRouter()

// 加入購物車 跳出視窗
function addToCart(product) {
  Swal.fire({
    icon: 'success',
    title: '加入購物車',
    text: `已將「${product.productName}」加入購物車！`,
  })
}

// 前往商品詳細頁
function goToProduct(id) {
  router.push({ name: 'productDetail', params: { id } })
}

//顯示全部商品
const loadProduct = async () => {
    const response = await fetch(GETALL_URL)
    products.value = await response.json()

    console.log(products.value);
}
loadProduct()
</script>

<template>
      <section class="header" >
        <div >
            <h2 class="page-cover-tittle">商城</h2>
        </div>
      </section>
      <div class="product-list-wrapper">
    <h1>全部商品</h1>
    <!-- 這邊示範使用 Vuetify Grid 進行商品排版 -->
    <v-row>
      <v-col
        v-for="product in products"
        :key="product.productId"
        class="d-flex"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card class="ma-2" max-width="344">
          <!-- 商品主圖 -->
          <v-img
            :src="BASE_URL + product.OneToManyProductImages.find(img => img.isPrimary).imageUrl"
            height="200"
            cover
          />
          <!-- 商品資訊 -->
          <v-card-title>{{ product.productName }}</v-card-title>
          <v-card-text>
            <div>價格：{{ product.price }}</div>
            <div v-if="product.specialPrice">特價：{{ product.specialPrice }}</div>
          </v-card-text>
          <!-- 卡片下方按鈕 -->
          <v-card-actions>
            <v-btn color="primary" @click="goToProduct(product.productId)">
              詳細
            </v-btn>
            <v-btn color="secondary" @click="addToCart(product)">
              加入購物車
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="css" scoped>
.header {
  background-image: url("../../assets/product/ProductShopping.jpg");
  width: 100%;
  height: 200px;
  background-position: right center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>