<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';


const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;
const router = useRouter()

const product = ref({
  productName: "",
  price: "",
  specialPrice: "",
  description: "",
  categories: []
});

const shortcutKey = () => {
  product.value = {
    productName: "星願禮盒",
    price: "999",
    specialPrice: "899",
    description: `商品介紹
精選堅果與台灣蜂蜜，口感香脆甜潤
低溫烘焙，保留堅果原始香氣與營養
桂花香氣淡雅，搭配酥脆塔皮，層次豐富
每顆獨立包裝，方便攜帶與分享

食品資訊
成分：核桃、杏仁、腰果、蜂蜜、桂花、麵粉、奶油
淨重：8入 / 12入
保存期限：常溫 14 天 / 冷藏 30 天
保存方式：請存放於陰涼處，避免陽光直射

銷售描述
甜而不膩，蜂蜜與堅果的黃金搭配！
獨立包裝，送禮大方，輕鬆分享美味！
快速下單，品味香酥濃郁的手工堅果塔！`,
    categories: ["新品", "禮盒"]
  };
};

const categoryOptions = ref([]); // 來自資料庫的分類
const selectedCategories = ref([]); // 存放使用者選擇的分類
const files = ref([]); //存放檔案
const imagePreview = ref([]); //存放顯示圖片
const CoverImagePreview = ref(null);
const CoverFile = ref(null);

const fetchCategories = async () => {
  const CATEGORY_URL = `${BASE_URL}Product/select/allCategories`;
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
// 上傳圖片與顯示圖片
const CoverPreviewImages = (event) => {
  const file = event.target.files[0];
  if (!file) return;//如果使用者點選圖片又取消，取得undefined就跳過

  const reader = new FileReader();
  reader.onload = (e) => {
      CoverImagePreview.value = e.target.result; // 將讀取的圖片資料設定給 CoverImagePreview，讓 UI 顯示圖片
      CoverFile.value = file; // 存放檔案，之後會用於上傳
    };
    reader.readAsDataURL(file);// 讀取檔案，並轉換成 Base64
};

// 移除指定圖片
const CoverRemoveImage = () => {
  CoverImagePreview.value = null;
  CoverFile.value = null;
}


// 多張圖片
// 上傳圖片與顯示圖片
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


const insertCategory = async () => {
  const ADD_CATEGORY_URL = `${BASE_URL}Product/insert/category`;
  const newCategory = product.value.categories.filter(name => name.trim() !== "").map(name => ({ categoriesName: name }))
  
  const response = await fetch(ADD_CATEGORY_URL,{
    method:'POST',
    body: JSON.stringify(newCategory),
    headers: {'Content-Type': 'application/json' }
  })

  // if (response.ok) {
  //   product.value.categories = {
  //     categoriesName:""
  //   }
  // }
  
  if (response.ok) {
    Swal.fire("成功", "分類已新增", "success");
    product.value.categories = []; // 清空輸入欄位
    fetchCategories(); // 重新獲取分類選項
  } else {
    console.error("分類新增失敗", await response.text());
    Swal.fire("錯誤", "分類新增失敗，請稍後再試", "error");
  }
}

// 存放錯誤訊息
const errorMessages = ref({
  productName: "",
  price: "",
  coverImage: "",
});

// 先檢查是否有輸入值，如果沒填，就更新 errorMessages 變數，讓錯誤訊息顯示出來
const validateForm = () => {
  let isValid = true; // 預設表單是有效的

  // 商品名稱
  if (!product.value.productName.trim()) {
    errorMessages.value.productName = "請輸入商品名稱 !";
    isValid = false; // 如果商品名稱沒填寫，則設為 false
  } else {
    errorMessages.value.productName = ""; //當使用者已經輸入正確資料時，清除錯誤訊息不會顯示。
  }

  // 售價
  if (!product.value.price.trim()) {
    errorMessages.value.price = "請輸入售價 !";
    isValid = false;
  } else {
    errorMessages.value.price = "";
  }

  // 商品封面
  // if (!CoverFile.value) {
  //   errorMessages.value.coverImage = "請上傳至少一張商品封面 !";
  //   isValid = false;
  // } else {
  //   errorMessages.value.coverImage = "";
  // }

  return isValid;
};



// 商品新增
const productAdd = async () => {
  if (!validateForm()) {
    return; // 如果驗證沒通過，就不繼續執行
  }

  const ADD_URL = `${BASE_URL}Product/insertProductWithImagesAndCategories`;
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
  formData.append("imageCover", CoverFile.value);
  if (files.value.length > 0) {
    files.value.forEach((file) => formData.append("images", file));
  }
  
  const response = await fetch(ADD_URL, {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    Swal.fire({
        title: "新增成功",
        text:`${product.value.productName} 已新增 !`,
        icon: "success",
        confirmButtonColor: "#3085d6",
    })
    router.push({ name:'productAll' })
  } else {
    console.error("新增失敗", await response.text());
    Swal.fire({
        title:"錯誤",
        text:"新增失敗，請稍後再試",
        icon:"error",
        confirmButtonColor: "#3085d6",
    })
  }
  
  

};

</script>

<template>
  <!-- <h2 class="text-center mb-4 ">商品新增</h2> -->

  <div class="d-flex justify-content-center">
  <h3 class="title-box">商品新增</h3>
</div>

  <div class="container mt-5">

  <div class="row mb-3 justify-content-center  section-title">
    <div class="col-lg-8">
      <h4 class="text-start border-bottom pb-2">基本資料</h4>
    </div>
  </div>

    <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <div class="d-flex align-items-center">
            <label for="productName" class="form-label">商品名稱<span class="Required">*</span></label>
            <p v-if="errorMessages.productName" class="error-message ms-2 ">{{ errorMessages.productName }}</p>
          </div>
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
          <div class="d-flex align-items-center">
            <label for="price" class="form-label">售價<span class="Required">*</span></label>
            <p v-if="errorMessages.price" class="error-message ms-2 ">{{ errorMessages.price }}</p>
          </div> 
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


  <div class="row mb-3 justify-content-center  section-title">
    <div class="col-lg-8">
      <h4 class="text-start border-bottom pb-2">分類</h4>
    </div>
  </div>


<!-- 分類標題 + 新增分類按鈕 -->
<!-- <div class="row mb-3 justify-content-center section-title">
  <div class="col-lg-8">
    <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
      <h4 class="text-start mb-0 flex-grow-1">分類</h4>
      <v-btn 
        color="primary" 
        elevation="0" 
        class="add-category-btn"
        @click="addCategory"
      >
        新增分類
      </v-btn>
    </div>
  </div>
</div> -->


    <!-- 選擇分類 -->
     <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <!-- <label class="form-label">選擇分類</label> -->
          <v-select
            v-model="selectedCategories"
            :items="categoryOptions"
            label="選擇分類"
            multiple
            chips
            clearable
            class="category-select"
          ></v-select>
        </div>
      </div>
    </div>

    <!-- 手動新增分類 -->
    <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <div v-for="(category, index) in product.categories" :key="index" class="d-flex align-items-center gap-2 mb-2">
            <input type="text"class="form-control" v-model="product.categories[index]"placeholder="請輸入分類名稱"/>
            <v-btn color="primary"  elevation="0"  @click="insertCategory">確認</v-btn>
            <v-btn color="red"  elevation="0"  @click="removeCategory(index)">刪除</v-btn>
          </div>
          <v-btn color="primary"  elevation="0"  @click="addCategory" v-if="product.categories.length === 0">
            新增分類
          </v-btn>
        </div>
      </div>
    </div>

  <div class="row mb-3 justify-content-center section-title">
    <div class="col-lg-8">
      <h4 class="text-start border-bottom pb-2">圖片</h4>
    </div>
  </div>

    <div class="mb-4">
      <div class="row mb-3 justify-content-center">
        <div class="col-lg-8">
          <div class="d-flex align-items-center">
            <label for="imageUpload" class="form-label">商品封面</label>
            <p v-if="errorMessages.coverImage" class="error-message ms-2">{{ errorMessages.coverImage }}</p>
          </div> 
          
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
          <label for="imageUpload" class="form-label">商品其他圖片</label>
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

  <div class="row mb-3 justify-content-center section-title ">
    <div class="col-lg-8">
      <h4 class="text-start border-bottom pb-2">其他</h4>
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
            style="resize: none;"
          ></textarea>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-5 mb-4 py-3 border-top">
      <RouterLink :to="{ name: 'productAll' }">
        <v-btn color="grey-lighten-3" class="mr-2" elevation="0" >
          <i class="bi bi-arrow-left"></i> 返回
        </v-btn>
      </RouterLink>
      <div class="d-flex gap-2">
        <v-btn color="primary"  elevation="0" @click="shortcutKey">
          一鍵新增
        </v-btn>
        <v-btn color="primary"  elevation="0" @click.prevent="productAdd">
          確認
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 100px; /* 設定寬度 */
  height: 100px; /* 設定高度，確保圖片為正方形 */
  object-fit: cover; /* 確保圖片填滿且不變形 */
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button.position-absolute {
  background-color: rgb(216, 64, 64);
  color: white;
  font-weight: bold;
  border-radius: 20%; /* 確保按鈕是圓形 */
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  border: none;
  
  /* 調整 X 按鈕的位置 */
  top: 6px !important;  /* 向下移動一點 */
  right: 12px !important; /* 向左移動一點 */
  transform: none !important; /* 取消之前的偏移 */
}

/* 必填 */
.Required {
  color: brown;
}

.section-title {
  margin-top: 50px; /* 這裡可以改成更大的數值 */
}

/* 修改底線顏色 */
/* .border-bottom {
  border-bottom: 1px solid rgb(180, 191, 255) !important; 
} */

.add-category-btn {
  height: 40px; /* 與輸入框高度一致 */
  white-space: nowrap; /* 防止按鈕內文字換行 */
}

.category-select {
  margin-bottom: -20px !important; /* 減少底部間距 */
}

/* 錯誤訊息 */
.error-message {
  color: rgb(216, 64, 64);
  font-size: 14px;
  margin-top: 4px;
  font-size: 14px;
}

</style>
