<script setup>
import { useAuthStore } from "@/stores/authStore";
import { ref, watch } from "vue";
const useStores = useAuthStore();
const isLogin = ref();
const userData = ref({
  userId: null,
  userName: "",
  userIdentity: null,
});
//檢查前先取資料
useStores.fetchUser();
watch(
  () => useStores.user,
  () => {
    //檢查是否已有登入
    if (useStores.user != null) {
      isLogin.value = true;
      userData.value.userId = useStores.user.userId;
      userData.value.userName = useStores.user.userName;
      userData.value.userIdentity = useStores.user.userIdentity;
    } else {
      isLogin.value = false;
    }
    // console.log(isLogin.value);
  },
  { immediate: true }
);

function logout() {
  useStores.logout();
  window.location.href = "/front";
}
</script>

<template>
  <div>
    <header class="header_area bg-header">
      <div class="container">
        <nav class="navbar navbar-expand-lg navbar-light">
          <!-- Brand and toggle get grouped for better mobile display -->
          <a class="navbar-brand logo_h" href="index.html"
            ><img src="../../assets/common/logo.png" alt=""
          /></a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <!-- Collect the nav links, forms, and other content for toggling -->
          <div
            class="collapse navbar-collapse offset"
            id="navbarSupportedContent"
          >
            <ul class="nav navbar-nav menu_nav ml-auto">
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'index' }"
                  >首頁</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'memberOverview' }"
                  >會員中心</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'roomFront' }"
                  >房型介紹</RouterLink
                >
              </li>
              <li class="nav-item active">
                <RouterLink class="nav-link" :to="{ name: 'productShopping' }"
                  >商城</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'attractionFront' }"
                  >周邊介紹</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'CarRentalHome' }"
                  >租車服務</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'bookingSearch' }"
                  >立即訂房</RouterLink
                >
              </li>
              <li class="nav-item">
                <div v-if="isLogin" class="nav-link active">
                  <span
                    ><span v-if="userData.userIdentity === 'admin'"
                      >管理員</span
                    >
                    <span v-if="userData.userIdentity === 'user'"
                      >一般會員</span
                    >
                    {{ userData.userName }}</span
                  >
                </div>
                <div v-else>
                  <RouterLink class="nav-link" :to="{ name: 'login' }"
                    >登入會員</RouterLink
                  >
                </div>
              </li>
              <li v-if="isLogin" class="nav-item">
                <a href="#" @click="logout()" class="nav-link">登出帳號</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
    <RouterView></RouterView>
  </div>
</template>

<style lang="css" scoped>
nav a img {
  height: 50px;
}

.bg-header {
  background-color: #ecf0d6;
}
</style>
