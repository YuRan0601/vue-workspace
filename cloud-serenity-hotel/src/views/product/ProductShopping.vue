<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL
const GETALL_URL = `${BASE_URL}Product/selectAll`

const products = ref([])

// .push用
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

// 顯示全部商品
const loadProduct = async () => {
  const response = await fetch(GETALL_URL)
  products.value = await response.json()
  console.log(products.value)
}
loadProduct()

function goToCart() {
  // 前往購物車頁面
  router.push({ name: 'cart' });
}
</script>

<template>
  <section class="header">
    <div>
      <h2 class="page-cover-tittle">商城</h2>
    </div>
  </section>

  <!-- 購物車圖示容器 -->
  <div class="cart-icon-container">
    <!-- FontAwesome Icon -->
    <i class="fas fa-shopping-cart" @click="goToCart"></i>
    <!-- 若有購物車數量 (可選) 
         <span class="cart-count">3</span>
    -->
  </div>

  <div class="product-list-wrapper">
    <div class="products-container">
      <div
        v-for="product in products"
        :key="product.productId"
        class="product-card"
        @click="goToProduct(product.productId)"
      >
        <!-- 商品圖片 -->
        <div class="product-image-wrapper">
          <img
            class="product-image"
            :src="BASE_URL + product.OneToManyProductImages.find(img => img.isPrimary).imageUrl"
            alt=""
          />
        </div>

        <!-- 商品名稱 -->
        <div class="product-name">
          {{ product.productName }}
        </div>

        <!-- 價格 -->
        <div class="product-price">
          <span v-if="product.specialPrice">
            <span class="original-price"> ${{ product.price }} </span>
            <span class="discount-price"> ${{ product.specialPrice }} </span>
          </span>
          <span v-else>
            ${{ product.price }}
          </span>
        </div>

        <!-- 加入購物車 -->
        <button
          class="add-to-cart-button"
          @click.stop="addToCart(product)"
        >
          加入購物車
        </button>
      </div>
    </div>
  </div>
</template>


<style lang="css" scoped>
/* 頂部大圖 */
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

.product-list-wrapper {
  padding: 16px;
}

/* 商品外層容器 */
.products-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* 每個商品卡片之間的間距 */
}

/* 商品卡片：整體固定寬度 220px，不設左右 padding */
.product-card {
  width: 220px;
  border: none;
  cursor: pointer;
  display: flex;           /* 垂直排版 */
  flex-direction: column;
  align-items: flex-start; /* 讓內部元素預設向左對齊 */
  /* 若想上下留點空間，可在這加上 padding-top / padding-bottom */
}

/* 圖片區塊保持正方形，寬度占滿 .product-card */
.product-image-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  margin-bottom: 12px; /* 與下方文字保持距離 */
}
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 商品名稱（可考慮左右留點 margin 以內縮） */
.product-name {
  margin: 0 8px 8px 8px; /* 依需要調整 */
  font-weight: 500;
}

/* 價格：同樣左右留一點 margin，使文字別太貼邊 */
.product-price {
  margin: 0 8px 12px 8px;
}

/* 若有特價，原價劃線 */
.original-price {
  text-decoration: line-through;
  margin-right: 8px;
  color: #555;
}
.discount-price {
  color: red;
  font-weight: bold;
}

/* 加入購物車按鈕：寬度占滿整個卡片、深藍底+白字 */
.add-to-cart-button {
  width: 100%;            /* 使按鈕左右與商品圖片對齊 */
  background-color: #003366;
  color: #fff;
  border: none;
  padding: 8px 0;         /* 只控制上下內距，保持與圖片同寬 */
  cursor: pointer;
  margin-bottom: 8px;     /* 與下方或卡片底部保持一點距離(選擇性) */
  text-align: center;     /* 文字置中(選擇性) */
}

/* 滑過按鈕時可再稍微變色 */
.add-to-cart-button:hover {
  background-color: #004080;
}


/* 對應於購物車 icon 容器 */
.cart-icon-container {
  /* 讓它寬度 100%（佔整行）或自訂寬度 */
  width: 100%;
  /* 與背景圖之間留一點距離 */
  margin-top: 10px; 
  /* 依需求選擇對齊方式 (這裡示範靠右) */
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 16px; /* 左右預留一些空間 */
}

/* 如果是使用 FontAwesome icon 的話，可以再稍微調整大小、顏色 */
.cart-icon-container i {
  font-size: 24px;     /* icon 大小 */
  color: #333;         /* icon 顏色 */
  cursor: pointer;     /* 滑鼠變手指 */
  position: relative;  /* 若要加個角標可用 */
}

/* hover 效果 (選擇性) */
.cart-icon-container i:hover {
  color: #555;
}

/* 若要加個數字角標 (購物車內商品數量) 可用 span 來定位 */
.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: red;
  color: #fff;
  font-size: 12px;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 18px;
  font-weight: bold;
}

</style>
