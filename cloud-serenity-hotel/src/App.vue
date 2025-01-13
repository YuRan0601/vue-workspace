<script setup>
import Start from '@/components/common/Start.vue'
</script>

<template>
  <div>
    <Start class="header"></Start>
    <div class="content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style lang="css" scoped>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }

  .content {
    margin-top: 55px;
  }

  * {
    margin: 0;
    padding: 0;
  }
</style>