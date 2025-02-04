<script setup>
import Start from '@/components/common/Start.vue'
</script>

<template>
  <div>
    <div class="content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import '@/assets/common/css/style.css';

  .content {
    margin-top: 0px;
  }

  * {
    margin: 0;
    padding: 0;
  }
</style>