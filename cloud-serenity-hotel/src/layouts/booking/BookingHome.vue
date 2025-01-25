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
    <div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#bookingHomeNavbar"
            aria-controls="bookingHomeNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="bookingHomeNavbar">
            <div class="navbar-nav">
              <RouterLink class="nav-link" :to="{ name: 'bookingSearch' }"
                >訂房</RouterLink
              >
              <!-- <RouterLink class="nav-link" :to="{ name: 'back' }">後台</RouterLink> -->
            </div>
          </div>
        </div>
      </nav>
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
