<script setup>
import { ref } from 'vue';
const imagePreview = ref(null);

const previewImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      imagePreview.value.src = e.target.result; // 更新圖片的 src
      imagePreview.value.style.display = "block"; // 顯示圖片
    };

    reader.readAsDataURL(file);
  } else {
    if (imagePreview.value) {
      imagePreview.value.style.display = "none"; // 隱藏圖片
    }
  }
};
</script>

<template>
        <div class="container mt-5">
            <h2 class="text-center mb-4">商品新增表單</h2>
        <div class="mb-4">
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="userId" class="form-label">商品名稱</label>
                    <input type="text" class="form-control" />
                </div>
            </div>
        </div>
        <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <label for="imageUpload" class="form-label">商品圖片</label>
        </div>
        <div class="col-lg-8">
          <input class="form-control" type="file" id="imageUpload" accept="image/*" @change="previewImage">
        </div>
        <div class="mb-3 col-lg-8">
          <img ref="imagePreview" src="#" alt="Image Preview" class="img-fluid" style="max-width: 300px; display: none; border: 1px solid #ddd; padding: 5px;">
        </div>
     
    </div>
  </div>
        <div class="mb-4">
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="userId" class="form-label">分類</label>
                    <input type="text" class="form-control" />
                </div>
            </div>
        </div>
        <div class="mb-4">
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="userId" class="form-label">售價</label>
                    <input type="text" class="form-control" />
                </div>
            </div>
        </div>
        <div class="mb-4">
            <div class="row mb-3 justify-content-center">
                <div class="col-lg-8">
                    <label for="userId" class="form-label">特價</label>
                    <input type="text" class="form-control" />
                </div>
            </div>
        </div>
        <div class="mb-4">
            <div class="row mb-3 justify-content-center">
                <!-- class="col-lg-8" 左右邊留大空白 -->
                <div class="col-lg-8">
                <label for="exampleFormControlTextarea1" class="form-label">商品描述</label>
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>
            </div>
        </div>

            <!-- 按鈕區 -->
           <div class="d-flex justify-content-between align-items-center mt-5 mb-4 py-3 border-top">
            <!-- 返回按鈕 -->
            <RouterLink :to="{ name: 'productAll' }" class="btn btn-secondary">
            <i class="bi bi-arrow-left"></i> 返回
            </RouterLink>
            <div>
            <!-- 新增訂單按鈕 -->
                <button class="button-29" role="button" @click="showAddOrderAlert">
                    <i class="bi bi-journal-text me-2"></i>新增商品確認
                </button>
            </div>

        </div>
        </div>
</template>

<style lang="css" scoped>
#imagePreview {
  max-height: 200px;
  margin-top: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>