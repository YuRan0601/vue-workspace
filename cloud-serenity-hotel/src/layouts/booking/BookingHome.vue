<script setup></script>

<template>
  <div class="background">
    <div>
      <section class="breadcrumb_area header">
        <div
          class="overlay bg-parallax"
          data-stellar-ratio="0.8"
          data-stellar-vertical-offset="0"
          data-background=""
        ></div>
        <div class="container-fluid">
          <div class="page-cover text-center">
            <h2 class="page-cover-tittle">訂房</h2>
          </div>
        </div>
      </section>
    </div>

    <div class="container bg-white">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style lang="css" scoped>
.header {
  background-image: url("../../assets//common/header_bg.jpg");
  width: 100%;
  height: 200px;
  background-position: right top;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

* {
  padding: 0;
}

.background {
  background-color: #6dc6d6;
  min-height: 100vh; /* 让背景覆盖整个视窗高度 */
  box-sizing: border-box; /* 确保 padding 不影响背景宽度 */
}
</style>
