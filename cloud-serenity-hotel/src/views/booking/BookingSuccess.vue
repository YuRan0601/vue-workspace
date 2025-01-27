<script setup>
    
</script>

<template>
  <div class="container">
    <div class="content">
      <h1>訂單建立成功</h1>
      <br />
      <v-btn color="blue" @click="payHandler"> 去付款 </v-btn>
      <br />
      <br />
      <v-btn color="green" @click="goMemberCenter"> 回會員中心查看 </v-btn>
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
  padding: 50px;
  text-align: center;
}
</style>
