<script setup>
import { RouterView } from 'vue-router';
import { useRouter, useRoute } from 'vue-router'
import { useProductStore } from '@/stores/productStore';

// 共享分類、與商品的資料( 用來顯示資料 )
const store = useProductStore()
// .push用
const router = useRouter()

const route = useRoute()

//第一次進入首頁讀取
store.loadProduct()
store.loadCategories()

//處理非首頁，點分類無反應(點全部商品)
function goToAllProducts() {

  store.loadProduct()//顯示全部

  // 如果當前頁面不是 ProductShopping.vue，則到首頁
  if (route.name !== 'productShopping') {
    router.push({ name: 'productShopping' })
  }
}

//處理非首頁，點分類無反應(點其他分類商品)
function selectCategory(categoryId) {

  store.filterByCategory(categoryId)

  if (route.name !== 'productShopping') {
    router.push({ name: 'productShopping', query: { category: categoryId } })
  }
}

function goToCart() {
  // 前往購物車頁面
  router.push({ name: 'productCart' });
}


</script>

<template>
  <div>
    <section class="header">
      <div>
        <!-- <h2 class="page-cover-tittle">商城</h2> -->
      </div>
    </section>

    <!-- 分類區塊 (包含購物車 icon) -->
    <div class="category-bar">
      <!-- "全部" 選項 -->
      <button class="category-button" @click="goToAllProducts">全部</button>

      <!-- 動態渲染分類按鈕 -->
      <button v-for="category in store.categories" :key="category.categoryId" class="category-button"
        @click="selectCategory(category.categoryId)">
        {{ category.categoriesName }}
      </button>

      <!-- <button
      v-for="category in categories"
      :key="category.categoryId"
      class="category-button"
      :class="{ active: selectedCategory === category.categoryId }"
      @click="filterByCategory(category.categoryId)"
    >
      {{ category.categoriesName }}
    </button> -->

      <!-- 購物車 icon -->
      <div class="cart-icon-container">
        <!-- <i class="fas fa-shopping-cart" @click="goToCart"></i> -->
        <!-- <i class="bi bi-bag" @click="goToCart"></i> -->
        <i class="bi bi-cart4" @click="goToCart"></i>
      </div>
    </div>
    <RouterView></RouterView>
  </div>
</template>

<style lang="css" scoped>
/* 頂部大圖 */
.header {
  background-image: url("../../assets/product/ProductShopping.jpg");
  width: 100%;
  height: 400px;
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
  gap: 16px;
  /* 每個商品卡片之間的間距 */
}

/* 商品卡片：整體固定寬度 220px，不設左右 padding */
.product-card {
  width: 220px;
  border: none;
  cursor: pointer;
  display: flex;
  /* 垂直排版 */
  flex-direction: column;
  align-items: flex-start;
  /* 讓內部元素預設向左對齊 */
  /* 若想上下留點空間，可在這加上 padding-top / padding-bottom */
}

/* 圖片區塊保持正方形，寬度占滿 .product-card */
.product-image-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  margin-bottom: 12px;
  /* 與下方文字保持距離 */
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 商品名稱（可考慮左右留點 margin 以內縮） */
.product-name {
  margin: 0 8px 8px 8px;
  /* 依需要調整 */
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
  width: 100%;
  /* 使按鈕左右與商品圖片對齊 */
  background-color: #003366;
  color: #fff;
  border: none;
  padding: 8px 0;
  /* 只控制上下內距，保持與圖片同寬 */
  cursor: pointer;
  margin-bottom: 8px;
  /* 與下方或卡片底部保持一點距離(選擇性) */
  text-align: center;
  /* 文字置中(選擇性) */
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
  padding: 0 16px;
  /* 左右預留一些空間 */
}

/* 如果是使用 FontAwesome icon 的話，可以再稍微調整大小、顏色 */
.cart-icon-container i {
  font-size: 24px;
  /* icon 大小 */
  color: #333;
  /* icon 顏色 */
  cursor: pointer;
  /* 滑鼠變手指 */
  position: relative;
  /* 若要加個角標可用 */
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


/* 分類區塊與購物車 icon */
.category-bar {
  display: flex;
  align-items: center;
  /* 讓分類按鈕與購物車 icon 垂直置中 */
  justify-content: flex-start;
  /* 讓內容靠左對齊 */
  background-color: white;
  padding: 10px 16px;
  /* 增加左右內距，讓內容不會貼邊 */
  gap: 16px;
  /* 設定分類與購物車 icon 之間的間距 */
}

/* 分類按鈕 */
.category-button {
  background-color: white;
  color: black;
  border: none;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s ease-in-out;
  flex-shrink: 0;
  /* 防止按鈕縮小 */
}

.category-button:hover {
  background-color: #f2f2f2;
}

/* 當按鈕被選中時的樣式 */
.category-button.active {
  background-color: rgb(232, 232, 232);
  /* 讓選中按鈕變灰 */
  color: black;
  /* 文字變黑 */
}

/* 購物車 icon */
.cart-icon-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.cart-icon-container i {
  font-size: 24px;
  color: #333;
  position: relative;
}

.cart-icon-container i:hover {
  color: #555;
}
</style>