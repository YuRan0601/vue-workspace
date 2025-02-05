<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

function goToAllProducts() {
router.push({ name: 'productShopping' })

}


</script>

<template>
  <div>
    <div class="header">
        <h2>伴手禮商城</h2>
        <v-btn color="primary" @click="goToAllProducts">點我購買</v-btn>
    </div>
  </div>
</template>

<style lang="css" scoped>
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

</style>
