<script setup>
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { onMounted, ref, defineProps } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

// 定義 props，這裡我們期待傳遞一個 `id`
defineProps({
    id:String
  })

// 使用 onMounted 來處理組件掛載後的邏輯
const route = useRoute(); // 使用 useRoute 來取得當前路由的參數

onMounted(async () => {
  try {
    // 從路由的 `params` 取得 `id`
    const carModelId = route.params.id;
    const response = await axios.get(`/api/CarModel/queryOne/${carModelId}`);  // 使用 `carModelId` 來請求資料
    carData.value = response.data;  // 將資料存儲到 `carDate`
  } catch (error) {
    console.error('Error fetching data:', error);
    Swal.fire({
      icon: 'error',
      title: '資料載入失敗',
      text: '無法載入車輛資料'
    });
  }
});

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從0開始，所以加1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const dialog = ref(false);
const valid = ref(false);
const carData = ref({
  carId: '', 
  brand: '', 
  engineDisplacement: '', 
  seatCount: '', 
  carType: '', 
  carSize: '',
  updatedAt:''
});

// 預設的表單驗證規則
const rules = {
  required: value => !!value || '此欄位為必填'
};

// 點擊按鈕後開啟對話框並加載資料
const editCarData = (carData) => {
  // 將車輛資料賦值給 carData，並顯示對話框
  carData.value = { ...carData.value };
  dialog.value = true;
};

// 提交表單
const submitForm = () => {
  if (valid.value) {
    // 先更新車型資料
    const currentData = formatDate(new Date()); 
    carData.value.updatedAt = currentData;
    axios.post('/api/CarModel/update', carData.value, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      // 車型資料更新成功
      Swal.fire('修改成功', '車型資料已成功修改！', 'success');
      closeDialog();
      updateCarData();
    })
    .catch(error => {
      console.error("車型資料更新失敗", error);
      Swal.fire('修改失敗', '車型資料更新失敗，請稍後再試！', 'error');
    });
  }
};
// 關閉對話框
const closeDialog = () => {
  dialog.value = false;
};

// 更新車型資料
const updateCarData = () => {
  // 假設你有一個方法來從 API 拉取資料
  axios.get(`/api/CarModel/queryOne/${carData.value.carId}`)
    .then(response => {
      // 更新 carDate 來顯示最新的資料
      carData.value = response.data;
    })
    .catch(error => {
      console.error('獲取資料失敗:', error.response ? error.response.data : error);
    });
};


const showDialog = ref(false); // 控制對話框顯示/隱藏
const imageUrls = ref([]); // 用來儲存多張圖片的 URL
const imageUrlsDB = ref([]); // 用來儲存多張圖片的 URL
const imageFile = ref(null); // 用來儲存選擇的圖片文件
let fileInput = null; // 用來儲存 file input 元素
const imageBase64List = ref([]);

// 使用 onMounted 獲取 DOM 元素
onMounted(() => {
  fileInput = document.querySelector('input[type="file"]'); // 使用 document.querySelector 獲取 input 元素
});



const isSelected = (index) => {
  return selectedIndexes.value.includes(index)
}

// 打開對話框
const openDialog = (data) => {
  carData.value = data;
  showDialog.value = true;  // 顯示對話框
  imageUrls.value = []; // 重置圖片預覽
  imageFile.value = null; // 清空已選圖片檔案
  

  console.log(carData.value);  // 檢查 carData 是否正確
};

// 關閉對話框
const closeDialogimage = () => {
  showDialog.value = false  // 隱藏對話框
  imageFile.value = null    // 清空當前選擇的圖片文件
  imageUrls.value = []      // 清空顯示的圖片
  imageUrlsDB.value = []
}

// 觸發圖片選擇框
const triggerImageUpload = () => {
  if (fileInput) {
    fileInput.click(); // 觸發選擇檔案對話框
  }
};

// 處理圖片選擇
const handleImageChange = (event) => {
  const files = event.target.files; // 取得用戶選擇的所有檔案
  if (files) {
    const imageUrlsArray = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        imageUrlsArray.push(e.target.result); // 預覽圖片
        if (imageUrlsArray.length === files.length) {
          imageUrls.value = imageUrlsArray; // 當所有檔案都處理完成，更新 imageUrls
          imageFile.value = files; // 儲存選中的檔案
        }
      };
      reader.readAsDataURL(file); // 讀取圖片為 base64
    }
  }
};

// 新增圖片
const addImage = () => {
  triggerImageUpload(); // 觸發圖片選擇框
};

// 修改圖片
const editImage = () => {
  if (imageFile.value) {
    uploadImages(); // 使用相同的上傳邏輯來更新圖片
  } else {
    Swal.fire('未選擇圖片', '請選擇要修改的圖片！', 'warning');
  }
  closeDialogimage(); // 操作後關閉對話框
};

// 刪除圖片
const deleteImage = () => {
  Swal.fire({
    title: '確定刪除圖片嗎?',
    text: "這將刪除所選的圖片!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '刪除',
    cancelButtonText: '取消'
  }).then((result) => {
    if (result.isConfirmed) {
      // 這裡添加刪除圖片的邏輯，假設有一個刪除 API
      axios.post('/api/ImageCar/delete', { carId: carData.value.carId })
        .then(() => {
          Swal.fire('刪除成功', '圖片已成功刪除！', 'success');
          updateCarData(); // 更新頁面顯示的資料
        })
        .catch((error) => {
          Swal.fire('刪除失敗', '圖片刪除過程中發生錯誤', 'error');
          console.error(error);
        });
    }
  });
  closeDialogimage(); // 操作後關閉對話框
};

// 觸發圖片選擇框
const triggerImageAdd = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 處理文件選擇
const handleImageChangeAdd = (event) => {
  // 設定選擇的圖片
  imageFile.value = event.target.files[0]; // 假設只選擇一張圖片
};

// 新增車型圖片的方法
const addModelImage = () => {
  if (!imageFile.value) {
    alert("請選擇圖片！");
    return;
  }
  console.log("車型 ID:", carData.value.carId); // 確認 carId 是否有值
    if (!carData.value.carId) {
      alert("車型 ID 無效，無法上傳圖片！");
      return;
    }
  const formData = new FormData();
  formData.append("carId", carData.value.carId);  // 使用 openDialog 設定的 carId
  Array.from(imageFile.value).forEach(file => {
    formData.append("images", file);  // 新增選中的圖片
  });

  // 發送圖片上傳請求
  axios.post("/api/ImageCar/addImage", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
  .then(response => {
    Swal.fire('圖片上傳成功', '圖片已成功上傳！', 'success');
    updateCarData();  // 更新車型資料顯示
  })
  .catch(error => {
    Swal.fire('圖片上傳失敗', '圖片上傳過程中發生錯誤', 'error');
    console.error("圖片上傳錯誤:", error);
  });
};


// 用來追蹤選中的圖片索引
const selectedIndexes = ref([]);

// 切換圖片選擇狀態
const toggleSelection = (index) => {
  if (isSelected(index)) {
    // 如果已經選中，則取消選中
    selectedIndexes.value = selectedIndexes.value.filter(i => i !== index)
  } else {
    // 如果未選中，則選中
    selectedIndexes.value.push(index)
  }
}

// 假設的圖片選擇處理函數
const selectImages = () => {
  console.log("選擇圖片");
  // 這裡可以添加處理圖片選擇的邏輯，例如打開文件選擇框
};

const getImages = async () => { 
  try {
    const carModelId = route.params.id;
    const response = await axios.get(`/api/ImageCar/queryOne/${carModelId}`,{
      params: {
        carId: carData.value.carId  // 將 carId 作為查詢參數
      }
    });  // 從後端獲取圖片 URL
    console.log('API 回應:', response.data); 
      if (response.data) {
    // 如果 response.data 存在，且 response.data.imageUrls 是一個陣列
    imageUrlsDB.value = response.data;  // 更新 imageUrls
  } else {
    console.error('返回的圖片數據格式錯誤', response.data);  // 如果不符合條件，顯示錯誤
  }
  } catch (error) {
    console.error('獲取圖片失敗:', error)
  }
}

const getImageSrc = (base64Str) => {
  console.log('Base64 String (first 100 chars):', base64Str.slice(0, 100));  // 輸出前 100 個字元
  // 檢查 base64 字串的前綴來判斷圖片格式
  if (base64Str.startsWith("/9j/")) {
    // JPEG 格式
    return `data:image/jpeg;base64,${base64Str}`;
  } else if (base64Str.startsWith("iVBOR")) {
    // PNG 格式
    return `data:image/png;base64,${base64Str}`;
  } else {
    // 預設情況，假設是 JPEG
    return `data:image/jpeg;base64,${base64Str}`;
  }
};

//資料庫 圖片勾選欄
const selectedIndexesDB = ref([])

const isSelectedDB = (index) => {
  return selectedIndexesDB.value.includes(index)
}

// 切換某個圖片的選擇狀態
const toggleSelectionDB = (index) => {
  if (isSelectedDB(index)) {
    selectedIndexesDB.value = selectedIndexesDB.value.filter(i => i !== index)
  } else {
    selectedIndexesDB.value.push(index)
  }
}

</script>

<template>

  <div class="car-info-container">
    <h2 class="car-model">{{ carData.carModel }}</h2>
    <div class="car-info">
      <p><strong>車輛編號：</strong>{{ carData.carId }}</p>
      <p><strong>品牌：</strong>{{ carData.brand }}</p>
      <p><strong>排氣量：</strong>{{ carData.engineDisplacement }}</p>
      <p><strong>座位數量：</strong>{{ carData.seatingCapacity }}</p> <!-- 假設 seatCount 為座位數 -->
      <p><strong>車輛類型：</strong>{{ carData.carType }}</p>
      <p><strong>車輛大小：</strong>{{ carData.carSize }}</p>
      <p><strong>總車輛數：</strong>{{ carData.totalVehicles }}</p>
      <p><strong>可使用車輛數：</strong>{{ carData.availableVehicles }}</p>
      <p><strong>創建時間：</strong>{{ carData.createdAt }}</p>
      <p><strong>更新時間：</strong>{{ carData.updatedAt }}</p>
    </div>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">修改車輛資料</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="carData.carId" label="車輛編號" :readonly="true"></v-text-field>
            <v-text-field v-model="carData.brand" label="品牌" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="carData.engineDisplacement" label="排氣量" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="carData.seatingCapacity" label="座位數量" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="carData.carType" label="車輛類型" :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="carData.carSize" label="車輛大小" :rules="[rules.required]"></v-text-field>
          </v-form>
        </v-card-text>
         <v-card-actions>
          <v-btn text @click="closeDialog">取消</v-btn>
          <v-btn color="primary" @click="submitForm" :disabled="!valid">修改</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
     
    <div>  
        <button type="button" class="btn btn-outline-success hover-text-color ms-2" style="background-color: var(--bs-success-bg-subtle);" @click="editCarData(carData)">
          <i class="bi bi-pencil-square icon-size"></i>
        </button>
        <button type="button" class="btn btn-danger hover-text-color ms-2" style="background-color: var(--bs-danger-border-subtle);" @click="deleteImage">
          <i class="bi bi-trash icon-size"></i>
        </button>
        <button type="button" class="btn btn-outline-success hover-text-color ms-2" style="background-color: var(--bs-primary-bg-subtle);" @click="openDialog(carData)">
          <i class="bi bi-card-image icon-size"></i>
        </button>
      </div>

      <!-- 假設這裡是一個圖片操作的對話框 -->
      <div v-if="showDialog" class="modal">
        <div class="modal-content">
            <div class="image-upload-container">
              <h4>選擇圖片操作</h4>
              <button class="btn btn-outline-success btn-lg" @click="addImage">
                <i class="bi bi-plus-circle icon-size-image"></i> 
              </button>
              <button class="btn btn-outline-success btn-lg" @click="getImages">
                <i class="bi bi-images icon-size-image"></i>
              </button>
          </div>
          <div v-if="imageUrls.length">
    <div class="image-preview-container">
      <div v-for="(url, index) in imageUrls" :key="index" class="image-preview-item" @click="toggleSelection(index)">
        <div class="image-preview-wrapper">
          <!-- 顯示圖片 -->
          <img :src="url" alt="preview" class="image-preview" />
          <!-- 勾選框，根據圖片是否被選中顯示 -->
          <input 
            type="checkbox" 
            :checked="isSelected(index)" 
            @change="toggleSelection(index)" 
            class="select-checkbox" 
          />
                </div>
              </div>
            </div>
          </div>
          <div>
          <div v-if="imageUrlsDB.length > 0" class="image-preview-container">
            <div v-for="(image, index) in imageUrlsDB" :key="index" class="image-preview-item">
              <!-- 顯示圖片，並且當圖片被點擊時切換勾選狀態 -->
              <img :src="getImageSrc(image)" alt="Image Preview" class="image-preview" @click="toggleSelectionDB(index)"/>
              <!-- 勾選框 -->
              <input type="checkbox" :checked="isSelectedDB(index)" @change="toggleSelectionDB(index)" class="select-checkbox"/>
            </div>
          </div>
        </div>
          <div class="button-group">
            <button type="button" class="btn btn-outline-success hover-text-color ms-2" style="background-color: var(--bs-success-bg-subtle);" @click="addModelImage">新增圖片</button>
            <input type="file" ref="fileInput" style="display: none;" @change="handleImageChange" accept="image/*" multiple />
          <button type="button" class="btn btn-outline-success hover-text-color ms-2" style="background-color: var(--bs-danger-bg-subtle);" @click="editImage">選擇主圖
          </button>
          <button type="button" class="btn btn-outline-success hover-text-color ms-2" style="background-color: var(--bs-primary-bg-subtle);" @click="deleteImage">刪除選擇
          </button>
          <button 
            type="button" 
            class="btn btn-outline-success hover-text-color ms-2" 
            style="background-color: var(--bs-border-color);" 
            @click="closeDialogimage"
          >關閉</button>
        </div>
        <input type="file" multiple accept="image/*" ref="fileInput"  style="display:none;"  @change="handleImageChange"/>
        
      </div>
  </div>
  </div>
</template>
  
<style scoped>
.image-preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  border: none; /* 移除邊框 */
}

.image-preview-item {
  margin: 10px;
  position: relative;
}

.image-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  cursor: pointer; /* 讓圖片可點擊 */
}

.select-checkbox {
  position: absolute;
  top: 5px;
  left: 5px;
}

.image-upload-container {
  display: flex; /* 使用 flex 排列 */
  align-items: center; /* 垂直居中對齊 */
  gap: 10px; /* 設置 h4 和按鈕之間的間距 */
}

h4 {
  display: inline-block; /* 讓 h4 與按鈕在同一行 */
  margin-right: 10px; /* 調整 h4 標籤右側的間距 */
}

icon-size-image {
  font-size: 30px;  /* 設置圖標大小 */
}

.btn-lg {
  padding: 3px 8px; /* 調整按鈕大小 */
  font-size: 20px; /* 調整按鈕文字大小 */
}

.modal-content {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  height: 75%;
}

/* 調整按鈕組為單行並設置適當的間距 */
.button-group {
  display: flex;
  justify-content: flex-end; /* 將按鈕組推到容器的右側 */
  gap: 10px; /* 按鈕之間的間距 */
  justify-self: start;
  margin-top: auto;
}

.button-group button {
  white-space: nowrap; /* 防止文字換行 */
  flex-grow: 1; /* 允許按鈕均勻擴展 */
  max-width: 150px; /* 限制按鈕的最大寬度 */
  max-width: 100px;
}

.modal {
  /* 可以設計對話框的樣式 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  width: 60%
}

.car-info-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
  box-shadow: 0 2px 10px rgba(203, 202, 202, 0.1);
}

.car-model {
  text-align: center;
  font-size: 28px;
  color: #333;
  margin-bottom: 15px;
  font-weight: bold;
}

.car-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 兩列並排 */
  gap: 20px; /* 每列間距 */
}

.car-info p {
  background-color: #fff;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.car-info p strong {
  color: #333;
  font-weight: bold;
}

.product-info {
  margin-top: 20px;
}

.product-info h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

  .product-info {
    margin-top: 20px;
  }
  
  .product-info h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .product-info p {
  font-size: 16px;
}



.hover-text-color {
  color: rgb(64, 56, 56);
  transition: color 0.3s ease, background-color 0.3s ease;
  border: none;
}

  .hover-text-color:hover {
    color: black;  /* 當鼠標移入時，文字顏色變為黑色 */
    background-color: rgb(68, 63, 63); /* 背景顏色改變 */
  }

  .hover-text-color:active {
    color: rgb(128, 128, 134);  /* 當按鈕被點擊時，文字顏色變為藍色 */
  }

  .icon-size {
    font-size: 20px;  /* 調整圖示大小為 30px */
  }

  /* 可選：改變鼠標懸停時的圖示大小 */
.icon-size:hover {
    font-size: 25px;  /* 當鼠標移入時，圖示大小變為 35px */
  }

.image-preview-container {
  display: flex;
  overflow-x: auto; /* 若圖片超過容器寬度則可以水平滾動 */
  gap: 10px; /* 圖片之間的間距 */
  -ms-overflow-style: none;  /* 隱藏 IE 滾動條 */
  scrollbar-width: none;  /* 隱藏 Firefox 滾動條 */
  height: 200px; /* 設定高度 */
}

.image-preview-container::-webkit-scrollbar {
  display: none;  /* 隱藏 Chrome, Safari, Opera 的滾動條 */
}

.image-preview-item {
  width: 150px; /* 設定每張圖片的寬度 */
  height: 100px; /* 設定每張圖片的高度 */
}

.image-preview-item img {
  width: 100%; /* 圖片寬度填滿容器 */
  height: 100%; /* 圖片高度填滿容器 */
  object-fit: cover; /* 保持圖片的比例，並填滿容器 */
  border-radius: 8px; /* 圓角邊框 */
}

</style>