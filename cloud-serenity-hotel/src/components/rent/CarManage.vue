<script setup>
    import button from '@/components/rent/CarManage.vue'
</script>

<template>
 <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Cloud Serenity Hotel</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <RouterLink class="nav-link" :to="{ name: 'carType' }">車型</RouterLink>
            <RouterLink class="nav-link" :to="{ name: 'back' }">後台</RouterLink>
          </div>
        </div>
      </div>
    </nav>
 </div>
</template>

<style lang="css" scoped>

</style>