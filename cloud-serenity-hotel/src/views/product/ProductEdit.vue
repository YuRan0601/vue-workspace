<script setup>
import { ref } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import Swal from 'sweetalert2';


const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;
const router = useRouter()
const route = useRoute()
const productId = route.params.id

const product = ref({
  productName: "",
  price: "",
  specialPrice: "",
  description: "",
  categories: [],
});

const shortcutKey = () => {
  product.value = {
    productName: "星願禮盒 ( 12入 )",
    price: "1500",
    specialPrice: "1499",
    description: `商品介紹
採用天然酒釀發酵，蛋香濃郁 🍶
夾入美國蔓越莓果乾，酸甜平衡 🍒
手工慢火烘焙，口感酥脆，層次豐富 🍪
典雅禮盒設計，送禮體面，年節首選 🎁
食品資訊
成分：雞蛋、奶油、砂糖、酒釀、蔓越莓果乾
淨重：12入 / 24入
保存期限：常溫 20 天
保存方式：避免潮濕與陽光直射，開封後請密封保存
銷售描述
🍶 酒釀獨特香氣，搭配蔓越莓果乾，酸甜不膩！
🎁 精美禮盒設計，送禮體面，年節最應景！
🛒 快來選購，品味手工烘焙的細緻口感！`,
categories: [],
OneToManyProductImages: product.value.OneToManyProductImages // 保留原始的圖片
  };
};

const categoryOptions = ref([]); // 來自資料庫的分類
const selectedCategories = ref([]); // 存放使用者選擇的分類
const files = ref([]); //存放檔案
const imagePreview = ref([]); //存放顯示圖片
const CoverImagePreview = ref(null);
const CoverFile = ref(null);


// const getOneProduct = async () => {
//   const GETONE_URL = ${BASE_URL}Product/select/${productId};
//   const GETCAT_URL = ${BASE_URL}Product/getUpdate/categories/${productId};

//   try {
//     // 獲取商品主要資訊
//     const response = await fetch(GETONE_URL);
//     const data = await response.json();
//     product.value = { ...data[0] };

//     // 獲取商品的分類
//     const catResponse = await fetch(GETCAT_URL);
//     const catData = await catResponse.json();

//     // 確保 categories 存在並且轉換為名稱陣列
//     product.value.categories = catData.map(cat => cat.categoriesName);

//     // 將分類同步到 selectedCategories，讓 v-select 自動打勾
//     selectedCategories.value = [...product.value.categories];

//     // 讓 v-select 只顯示打勾的分類
//     // selectedCategories.value = catData.map(cat => cat.categoriesName);

//   } catch (error) {
//     console.error("獲取商品資料失敗:", error);
//   }
// };

// 顯示此商品的資料
const getOneProduct = async () => {
  const GETONE_URL = `${BASE_URL}Product/select/${productId};`

  try {
    // 獲取商品主要資訊（包含分類、圖片）
    const response = await fetch(GETONE_URL);
    const data = await response.json();
    product.value = data[0]
    // product.value = { ...data[0] };


    // 顯示封面圖片 (找到 isPrimary: true 的圖片)
    const primaryImage = product.value.OneToManyProductImages.find(img => img.isPrimary);
    if (primaryImage) {
      CoverImagePreview.value = `${BASE_URL}${primaryImage.imageUrl}`;
    }

    // 顯示其他商品圖片 (排除 isPrimary: true 的圖片)
    if (product.value.OneToManyProductImages.length > 0) {
      imagePreview.value = product.value.OneToManyProductImages
        .filter(img => !img.isPrimary)
        .map(img => `${BASE_URL}${img.imageUrl}`);
    }

    // 將 categories 轉換為名稱陣列
    if (product.value.ManyToManyCategories) {
      // 讓 v-select 可以選  因為v-select只能用[]，例如["測試", "熱門"]，不能用{}
      product.value.categories = product.value.ManyToManyCategories.map(cat => cat.categoriesName);
      // vue無法偵測陣列的變化(?，所以要展開，才能有響應式
      selectedCategories.value = [...product.value.categories]; 
    }

  } catch (error) {
    console.error("獲取商品資料失敗:", error);
  }
};

getOneProduct()

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
// const CoverRemoveImage = async () => {
//    // 確認是否為已上傳的封面圖片
//    if (CoverImagePreview.value && product.value.OneToManyProductImages) {
//     const primaryImage = product.value.OneToManyProductImages.find(img => `${BASE_URL}${img.imageUrl}` === CoverImagePreview.value);

//   if (primaryImage) {
//     const DELETE_COVER_URL = `${BASE_URL}Product/delete/image/${primaryImage.imageId}`
//     console.log(DELETE_COVER_URL);
    

//     try {

//       const response = await fetch(DELETE_COVER_URL, {
//       method: 'DELETE',
//     });

//     if (response.ok) {
//       Swal.fire("成功", "封面圖片已刪除", "success");
//       CoverImagePreview.value = null;
//       CoverFile.value = null;
//       product.value.OneToManyProductImages = product.value.OneToManyProductImages.filter(img => img.id !== primaryImage.imageId);
//     }else{
//       Swal.fire("錯誤", "封面圖片刪除失敗", "error");
//     }

//     } catch (error) {
//       console.error("封面圖片刪除失敗:", error);
//     }

//     }
//   }

//   CoverImagePreview.value = null;
//   CoverFile.value = null;
// };
const CoverRemoveImage = async () => {
  if (CoverImagePreview.value && product.value.OneToManyProductImages) {
    const primaryImage = product.value.OneToManyProductImages.find(img => `${BASE_URL}${img.imageUrl}` === CoverImagePreview.value);

    if (primaryImage) {
      const DELETE_COVER_URL = `${BASE_URL}Product/delete/image/${primaryImage.imageId}`;

      try {
        const response = await fetch(DELETE_COVER_URL, {
          method: 'DELETE',
        });

        if (response.ok) {
          Swal.fire("成功", "封面圖片已刪除", "success");
          CoverImagePreview.value = null;
          CoverFile.value = null;

          // **確保從 `OneToManyProductImages` 移除這張圖片**
          product.value.OneToManyProductImages = product.value.OneToManyProductImages.filter(img => img.imageId !== primaryImage.imageId);
        } else {
          Swal.fire("錯誤", "封面圖片刪除失敗", "error");
        }
      } catch (error) {
        console.error("封面圖片刪除失敗:", error);
      }
    }
  }

  CoverImagePreview.value = null;
  CoverFile.value = null;
};



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
// const removeImage = async (index, imageUrl) => {
//   const otherImage = product.value.OneToManyProductImages.find(img => `${BASE_URL}${img.imageUrl}` === imageUrl);

//   if (otherImage) {
//     const DELETE_IMAGE_URL = `${BASE_URL}Product/delete/image/${otherImage.imageId}`

//     try {

//       const response = await fetch(DELETE_IMAGE_URL, {
//        method: 'DELETE',
//     });

//     if (response.ok) {
//       Swal.fire("成功", "圖片已刪除", "success");
//       product.value.OneToManyProductImages = product.value.OneToManyProductImages.filter(img => img.id !== otherImage.imageId);
//       imagePreview.value.splice(index,1);
//       files.value.splice(index,1);
//     } else {
//       Swal.fire("錯誤", "圖片刪除失敗", "error");
//     }

//     } catch (error) {
//       console.error("圖片刪除失敗:", error);
//     }
//   }else{
//     imagePreview.value.splice(index,1);
//     files.value.splice(index,1);
//   }


// }
const removeImage = async (index, imageUrl) => {
  const otherImage = product.value.OneToManyProductImages.find(img => `${BASE_URL}${img.imageUrl}` === imageUrl);

  if (otherImage) {
    const DELETE_IMAGE_URL = `${BASE_URL}Product/delete/image/${otherImage.imageId}`;

    try {
      const response = await fetch(DELETE_IMAGE_URL, {
        method: 'DELETE',
      });

      if (response.ok) {
        Swal.fire("成功", "圖片已刪除", "success");

        // **從 `OneToManyProductImages` 中移除該圖片**
        product.value.OneToManyProductImages = product.value.OneToManyProductImages.filter(img => img.imageId !== otherImage.imageId);
        imagePreview.value.splice(index, 1);
        files.value.splice(index, 1);
      } else {
        Swal.fire("錯誤", "圖片刪除失敗", "error");
      }
    } catch (error) {
      console.error("圖片刪除失敗:", error);
    }
  } else {
    imagePreview.value.splice(index, 1);
    files.value.splice(index, 1);
  }
};


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
  // 修改時如果不動這個值，會出現 請輸入商品名稱 這個BUG，用!String 判斷如果是空字串或只包含空格，條件為 true，進入 if 區塊
  if (!String(product.value.productName).trim()) {
    errorMessages.value.productName = "請輸入商品名稱 !";
    isValid = false; // 如果商品名稱沒填寫，則設為 false
  } else {
    errorMessages.value.productName = ""; //當使用者已經輸入正確資料時，清除錯誤訊息不會顯示。
  }

  console.log(product.value.price);
  
  // 售價
  // 修改時如果不動這個值，會被當作是字串送出，用!String 判斷如果是空字串或只包含空格，條件為 true，進入 if 區塊
  if (!String(product.value.price).trim()) {
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

const formatDateForBackend = () => {
  return new Date().toISOString();
};

// 商品修改
// const productUpdate = async () => {
//   if (!validateForm()) {
//     return; // 如果驗證沒通過，就不繼續執行
//   }

//   product.value.updatedAt = formatDateForBackend();
//   product.value.createdAt = formatDateForBackend();

//   const UPDATE_URL = `${BASE_URL}Product/update/productWithImagesAndCategories/` + productId;
//   console.log(UPDATE_URL);
//   const formData = new FormData();

//   // 構造完整的 categories 結構
//   // const categories = product.value.categories.map((categoryName) => ({
//   //   categoriesName: categoryName,
//   // }));

//   const categories = [
//     ...selectedCategories.value.map(name => ({ categoriesName: name })), // 來自選擇的分類
//     ...product.value.categories.filter(name => name.trim() !== "").map(name => ({ categoriesName: name })) // 來自手動輸入的分類
//   ];

//   const productData = {
//     ...product.value,
//     categories, // 使用結構化的分類
//   };

//   formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
//   formData.append("imageCover", CoverFile.value);
//   if (files.value.length > 0) {
//     files.value.forEach((file) => formData.append("images", file));
//   }
  
//   const response = await fetch(UPDATE_URL, {
//     method: "PUT",
//     body: formData,
//   });

//   if (response.ok) {
//     Swal.fire({
//         title: "修改成功",
//         text:`${product.value.productName} 已修改 !`,
//         icon: "success",
//         confirmButtonColor: "#3085d6",
//     })
//     router.push({ name:'productAll' })
//   } else {
//     console.error("修改失敗", await response.text());
//     Swal.fire({
//         title:"錯誤",
//         text:"修改失敗，請稍後再試",
//         icon:"error",
//         confirmButtonColor: "#3085d6",
//     })
//   }
  
  

// };
const productUpdate = async () => {
  if (!validateForm()) {
    return;
  }

  product.value.updatedAt = formatDateForBackend();
  product.value.createdAt = formatDateForBackend();

  // 過濾掉已刪除的圖片
  product.value.OneToManyProductImages = product.value.OneToManyProductImages.filter(img => img.imageUrl);

  const UPDATE_URL = `${BASE_URL}Product/update/productWithImagesAndCategories/` + productId;
  console.log(UPDATE_URL);
  const formData = new FormData();

  const categories = [
    ...selectedCategories.value.map(name => ({ categoriesName: name })), 
    ...product.value.categories.filter(name => name.trim() !== "").map(name => ({ categoriesName: name })) 
  ];

  const productData = {
    ...product.value,
    categories, 
  };

  formData.append("product", new Blob([JSON.stringify(productData)], { type: "application/json" }));
  formData.append("imageCover", CoverFile.value);
  if (files.value.length > 0) {
    files.value.forEach((file) => formData.append("images", file));
  }

  const response = await fetch(UPDATE_URL, {
    method: "PUT",
    body: formData,
  });

  if (response.ok) {
    Swal.fire({
        title: "修改成功",
        text: `${product.value.productName} 已修改 !`,
        icon: "success",
        confirmButtonColor: "#3085d6",
    });
    router.push({ name:'productAll' });
  } else {
    console.error("修改失敗", await response.text());
    Swal.fire({
        title:"錯誤",
        text:"修改失敗，請稍後再試",
        icon:"error",
        confirmButtonColor: "#3085d6",
    });
  }
};


</script>

<template>
  <!-- <h2 class="text-center mb-4 ">商品新增</h2> -->

  <div class="d-flex justify-content-center">
  <h3 class="title-box">商品修改</h3>
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
        <div v-if="Array.isArray(product.categories)" class="col-lg-8">
          <div v-for="(category, index) in product.categories" :key="index" class="d-flex align-items-center gap-2 mb-2" >
            <!-- v-if="!product.categories[index]" 因為會不小心把是用來新增分類的欄位  當作放此商品的分類名稱而上去 所以用這個做假空值判斷 -->
            <input type="text"class="form-control" v-model="product.categories[index]"placeholder="請輸入分類名稱" v-if="!product.categories[index]" />
            <v-btn color="primary"  elevation="0"  @click="insertCategory" v-if="!product.categories[index]">確認</v-btn>
            <v-btn color="red"  elevation="0"  @click="removeCategory(index)" v-if="!product.categories[index]">刪除</v-btn>
          </div>
          <!-- <v-btn color="primary"  elevation="0"  @click="addCategory" v-if="product.categories.length === 0">
            新增分類
          </v-btn> -->
          <!-- 新增分類按鈕會出不來所以多加如果有分類 就顯示新增( 給有分類商品顯示 ) 這個判斷 -->
          <v-btn color="primary"  elevation="0"  @click="addCategory" v-if="product.categories.length === 0 || product.categories[product.categories.length - 1].trim() !== ''">
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
            <div v-if="CoverImagePreview" class="position-relative" >
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
            @click="removeImage(index, src)"
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
          一鍵修改
        </v-btn>
        <v-btn color="primary"  elevation="0" @click.prevent="productUpdate">
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