<script setup>
import { ref } from 'vue';

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;
const ADD_URL = `${BASE_URL}Product/insertProductWithImagesAndCategories`;

const product = ref({
  productName: "",
  price: "",
  specialPrice: "",
  description: "",
  categories: []
});

const files = ref([]);
const imagePreview = ref([]);

const previewImages = (event) => {
  const selectedFiles = Array.from(event.target.files);
  files.value = selectedFiles;

  imagePreview.value = [];
  selectedFiles.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

const productAdd = async () => {
  const formData = new FormData();

  // 構造完整的 categories 結構
  const categories = product.value.categories.map((categoryName) => ({
    categoriesName: categoryName,
  }));

  const productData = {
    ...product.value,
    categories, // 使用結構化的分類
  };

  formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
  files.value.forEach((file) => formData.append("images", file));

  const response = await fetch(ADD_URL, {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    alert("新增成功");
  } else {
    console.error("新增失敗", await response.text());
  }
};

</script>

<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">商品新增表單</h2>
    <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <label for="productName" class="form-label">商品名稱<span class="Required">*</span></label>
          <input
            type="text"
            class="form-control"
            id="productName"
            v-model="product.productName"
          />
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <label for="price" class="form-label">售價<span class="Required">*</span></label>
          <input type="text" class="form-control" id="price" v-model="product.price" />
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <label for="specialPrice" class="form-label">特價</label>
          <input
            type="text"
            class="form-control"
            id="specialPrice"
            v-model="product.specialPrice"
          />
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <label class="form-label">分類<span class="Required">*</span></label>
          <div v-for="(category, index) in product.categories" :key="index" class="mb-2">
            <input
              type="text"
              class="form-control"
              v-model="product.categories[index]"
              placeholder="新增分類"
            />
          </div>
          <button class="btn btn-secondary mt-2" @click="product.categories.push('')">
            新增分類欄位
          </button>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <label for="imageUpload" class="form-label">商品圖片<span class="Required">*</span></label>
          <input
            type="file"
            id="imageUpload"
            class="form-control"
            multiple
            @change="previewImages"
          />
          <div class="mt-3 d-flex flex-wrap">
            <img
              v-for="(src, index) in imagePreview"
              :key="index"
              :src="src"
              alt="Preview"
              class="me-2 mb-2"
              style="max-height: 100px; border-radius: 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <label for="description" class="form-label">商品描述</label>
          <textarea
            class="form-control"
            id="description"
            rows="3"
            v-model="product.description"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-5 mb-4 py-3 border-top">
      <RouterLink :to="{ name: 'productAll' }" class="btn btn-secondary">
        <i class="bi bi-arrow-left"></i> 返回
      </RouterLink>
      <div>
        <button class="btn btn-primary" @click.prevent="productAdd">
          新增商品確認
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  max-height: 100px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.Required{
  color: brown;
}
</style>
