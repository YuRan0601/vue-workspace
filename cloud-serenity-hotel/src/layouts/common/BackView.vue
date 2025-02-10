<script setup>
import Start from "@/components/common/Start.vue";
import { RouterView } from "vue-router";
// import './sidebars';

import { useAuthStore } from "@/stores/authStore";
const useStores = useAuthStore();

function logout() {
  useStores.logout();
  window.location.href = "/login";
}
</script>

<template>
  <div>
    <div
      class="aside flex-shrink-0 p-3 bg-light text-white"
      style="width: 280px"
    >
      <a
        href="/"
        class="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom"
      >
        <img id="logo" src="../../assets/common/logo.png" alt="" />
      </a>
      <ul class="list-unstyled ps-0">
        <li class="mb-1">
          <button
            class="btn btn-toggle align-items-center rounded collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#chart-collapse"
            aria-expanded="true"
          >
            統計資料
          </button>
          <div class="collapse show" id="chart-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <RouterLink class="link-dark rounded" :to="{ name: 'chart' }"
                  >房型、訂房圖表</RouterLink
                >
              </li>
            </ul>
          </div>
        </li>

        <li class="mb-1">
          <button
            class="btn btn-toggle align-items-center rounded collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#user-collapse"
            aria-expanded="true"
          >
            會員
          </button>
          <div class="collapse show" id="user-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <RouterLink
                  class="link-dark rounded"
                  :to="{ name: 'memberBack' }"
                  >Overview</RouterLink
                >
              </li>
            </ul>
          </div>
        </li>

        <li class="mb-1">
          <button
            class="btn btn-toggle align-items-center rounded collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#booking-collapse"
            aria-expanded="false"
          >
            訂房
          </button>
          <div class="collapse" id="booking-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <RouterLink class="link-dark rounded" :to="{ name: 'roomType' }"
                  >房型、房間</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  class="link-dark rounded"
                  :to="{ name: 'bookingOrderTable' }"
                  >訂房訂單</RouterLink
                >
              </li>
            </ul>
          </div>
        </li>

        <li class="mb-1">
          <button
            class="btn btn-toggle align-items-center rounded collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#product-collapse"
            aria-expanded="false"
          >
            商品
          </button>
          <div class="collapse" id="product-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <RouterLink
                  class="link-dark rounded"
                  :to="{ name: 'productBack' }"
                  >商品上架</RouterLink
                >
              </li>
            </ul>
          </div>
        </li>

        <li class="mb-1">
          <button
            class="btn btn-toggle align-items-center rounded collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#order-collapse"
            aria-expanded="false"
          >
            訂單
          </button>
          <div class="collapse" id="order-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <RouterLink
                  class="link-dark rounded"
                  :to="{ name: 'orderBack' }"
                  >訂單總表</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  class="link-dark rounded"
                  :to="{ name: 'orderExport' }"
                  >匯出訂單</RouterLink
                >
              </li>
            </ul>
          </div>
        </li>

        <li class="mb-1">
          <button
            class="btn btn-toggle align-items-center rounded collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#attraction-collapse"
            aria-expanded="false"
          >
            景點
          </button>
          <div class="collapse" id="attraction-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <a
                  href="http://localhost:8080/CloudSerenityHotel/static/attraction/GetAllAttractions.html"
                  class="link-dark rounded"
                  >查詢所有景點</a
                >
              </li>
            </ul>
          </div>
        </li>

        <li class="mb-1">
          <button
            class="btn btn-toggle align-items-center rounded collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#rent-collapse"
            aria-expanded="false"
          >
            租車
          </button>
          <div class="collapse" id="rent-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <RouterLink class="link-dark rounded" :to="{ name: 'carHome' }"
                  >車型管理</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  class="link-dark rounded"
                  :to="{ name: 'vehicleDetails' }"
                  >車輛管理</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  class="link-dark rounded"
                  :to="{ name: 'CarRentalHistory' }"
                  >訂單管理</RouterLink
                >
              </li>
            </ul>
          </div>
        </li>

        <li class="border-top my-3"></li>
        <li class="mb-1">
          <button
            class="btn btn-toggle align-items-center rounded collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#account-collapse"
            aria-expanded="false"
          >
            Account
          </button>
          <div class="collapse" id="account-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li>
                <RouterLink
                  class="link-dark rounded"
                  :to="{ name: 'adminBack' }"
                  >管理員列表</RouterLink
                >
              </li>
              <li><a class="link-dark rounded" @click="logout()">登出</a></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <div class="container">
      <div class="content">
        <RouterView></RouterView>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import url("./sidebars.css");

.content {
  margin-left: 280px;
  margin-top: 10px;
}

.container {
  max-width: 1500px;
}

.aside {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
}

#logo {
  width: 200px;
  margin-left: 20px;
}
</style>
