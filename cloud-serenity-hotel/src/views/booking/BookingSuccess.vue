<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useBookingOrderStore } from '@/stores/bookingOrderStore';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

  const userStore = useAuthStore();
  const router = useRouter();

  onMounted(() => {
    userStore.checkMember();
  })

  function goMemberCenter() {
    router.push({ name: 'memberBookingOrder' });
  }

</script>

<template>
  <div class="container">
    <div class="content">
      <h1>訂單建立成功</h1>
      <br />
      <v-btn color="green" @click="goMemberCenter"> 回會員中心查看訂單並付款 </v-btn>
    </div>
  </div>
</template>

<style lang="css" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  width: 500px;
  border-radius: 10px;
  padding-top: 150px;
  text-align: center;
  min-height: 150vh;
}
</style>
