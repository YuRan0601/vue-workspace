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
            <RouterLink class="nav-link" :to="{ name: 'front' }">前台</RouterLink>
            <RouterLink class="nav-link" :to="{ name: 'back' }">後台</RouterLink>
             <!-- <a class="nav-link" href="http:localhost:8080/static/common/adminPage.html" target="_blank">後台</a> -->
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const feature = ref();
</script>

<style lang="css" scoped></style>
