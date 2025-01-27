<script setup>
</script>
<template>
  <div>
    <section class="hero">
      <div class="hero-content">
        <h1>探索城市，隨時出發</h1>
        <h2>讓您的旅程更加自由與便捷</h2>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 600px; /* 設定區域的高度 */
  background-image: url("@/assets/images/CarHomeHeader.jpg"); /* 引入背景圖片 */
  background-size: cover; /* 讓圖片填滿區域 */
  background-position: center; /* 讓圖片保持居中 */
}

.hero-content {
  position: absolute;
  top: 120px;
  right: -30px;
  transform: translate(-50%, -50%);
  color: rgb(87, 87, 87);
  text-align: center;
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: bold;
}
</style>