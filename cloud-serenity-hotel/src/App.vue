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
@import '@/assets/css/style.css';

  .content {
    margin-top: 0px;
  }

  * {
    margin: 0;
    padding: 0;
  }
</style>

<script>
import AttractionComponent from './components/Attraction/AttractionComponent.vue';

export default {
  components: {
    AttractionComponent,
  },
};
</script>