<template>
  <footer class="hotel-footer">
    <div class="footer-content">
      <p>
        <strong>Cloud Serenity Hotel 雲澄旅館©</strong>
      </p>
      <p>
        <strong>Email：</strong>
        <a href="mailto:cloud.serenity.hotel@gmail.com">
          cloud.serenity.hotel@gmail.com
        </a>
      </p>
    </div>
  </footer>
</template>

<script setup>
// 這個組件目前沒有使用到 props 或任何程式邏輯，
// 因此在 script 區塊中留白即可。
</script>

<style scoped>
.hotel-footer {
  background-color: #f8f8f8;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #ddd;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content p {
  margin: 0.5rem 0;
  color: #555;
}
</style>
