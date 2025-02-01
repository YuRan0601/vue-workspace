<script setup>
import { ref } from 'vue';

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;
const CATEGORY_URL = `${BASE_URL}Product/select/allCategories`;
const ADD_URL = `${BASE_URL}Product/insertProductWithImagesAndCategories`;

const product = ref({
  productName: "",
  price: "",
  specialPrice: "",
  description: "",
  categories: []
});

const categoryOptions = ref([]); // 來自資料庫的分類
const selectedCategories = ref([]); // 存放使用者選擇的分類
const files = ref([]); //存放檔案
const imagePreview = ref([]); //存放顯示圖片
const CoverImagePreview = ref(null);
const CoverFile = ref(null);

const fetchCategories = async () => {
  const response = await fetch(CATEGORY_URL);
  const data = await response.json();
  categoryOptions.value = data.map(cat => cat.categoriesName);
}
fetchCategories()

// 點新增分類，增加輸入欄位
const addCategory = () => {
  product.value.categories.push('');
};

// 刪除手動輸入的分類
const removeCategory = (index) => {
  product.value.categories.splice(index,1);
};

// 單張圖片
// 上傳圖片 顯示圖片
const CoverPreviewImages = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
      CoverImagePreview.value = e.target.result;
      CoverFile.value = file;
    };
    reader.readAsDataURL(file);
};

// 移除指定圖片
const CoverRemoveImage = () => {
  CoverImagePreview.value = null;
  CoverFile.value = null;
}


// 多張圖片
// 上傳圖片 顯示圖片
const previewImages = (event) => {
  const selectedFiles = Array.from(event.target.files);
  // files.value = selectedFiles;
  // imagePreview.value = [];

  selectedFiles.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value.push(e.target.result);
      files.value.push(file);
    };
    reader.readAsDataURL(file);
  });
};

// 移除指定圖片
const removeImage = (index) => {
  imagePreview.value.splice(index,1);
  files.value.splice(index,1);
}

// 商品新增
const productAdd = async () => {
  const formData = new FormData();

  // 構造完整的 categories 結構
  // const categories = product.value.categories.map((categoryName) => ({
  //   categoriesName: categoryName,
  // }));

  const categories = [
    ...selectedCategories.value.map(name => ({ categoriesName: name })), // 來自選擇的分類
    ...product.value.categories.filter(name => name.trim() !== "").map(name => ({ categoriesName: name })) // 來自手動輸入的分類
  ];

  const productData = {
    ...product.value,
    categories, // 使用結構化的分類
  };

  formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
  
  if (files.value.length > 0) {
    files.value.forEach((file) => formData.append("images", file));
  }
  
  formData.append("imageCover", CoverFile.value);

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

    <!-- 選擇分類 -->
    <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <label class="form-label">選擇分類</label>
          <v-select
            v-model="selectedCategories"
            :items="categoryOptions"
            label="選擇分類"
            multiple
            chips
            clearable
          ></v-select>
        </div>
      </div>
    </div>

    <!-- 手動新增分類 -->
    <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <div v-for="(category, index) in product.categories" :key="index" class="d-flex align-items-center mb-2">
            <input type="text"class="form-control" v-model="product.categories[index]"placeholder="新增分類"/>
            <button class="btn btn-danger btn-sm" @click="removeCategory(index)">x</button>
          </div>
          <button class="btn btn-secondary mt-2" @click="addCategory">
            新增分類
          </button>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <label for="imageUpload" class="form-label">商品封面<span class="Required">*</span></label>
          <input
            type="file"
            id="imageUpload"
            class="form-control"
            @change="CoverPreviewImages"
          />
          <div class="mt-3 d-flex flex-wrap">
            <div v-if="CoverImagePreview" class="position-relative">
              <img
              :src="CoverImagePreview"
              alt="封面預覽"
              class="me-2 mb-2"
              style="max-height: 100px; border-radius: 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)"
            />
            <button 
            class="btn btn-danger btn-sm position-absolute top-0 end-0" 
            @click="CoverRemoveImage"
            style="transform: translate(50%, -50%);"
            >
            ×
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <label for="imageUpload" class="form-label">商品其他圖片<span class="Required">*</span></label>
          <input
            type="file"
            id="imageUpload"
            class="form-control"
            multiple
            @change="previewImages"
          />
          <div class="mt-3 d-flex flex-wrap">
            <div v-for="(src, index) in imagePreview" :key="index" class="position-relative">
              <img
              :src="src"
              alt="Preview"
              class="me-2 mb-2"
              style="max-height: 100px; border-radius: 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)"
            />
            <button 
            class="btn btn-danger btn-sm position-absolute top-0 end-0" 
            @click="removeImage(index)"
            style="transform: translate(50%, -50%);"
          >
            ×
          </button>
            </div>
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

button.position-absolute {
  background-color: red;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  line-height: 16px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  border: none;
}

.Required {
  color: brown;
}
</style>
