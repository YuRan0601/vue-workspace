<script setup>
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

const headers = [
    { title: "商品ID", key: 'productId' },
    { title: "主圖", key: 'imageUrl' },
    { title: "商品名稱", key: 'productName' },
    { title: "價格", key: 'price' },
    { title: "特價", key: 'specialPrice' },
    { title: "新增時間", key: 'createdAt' },
    { title: "修改時間", key: 'updatedAt' },
    { title: "上架狀態", key: 'listingStatus' },
    { title: "操作", key: "actions" }
]

const product = ref([]);

// 顯示全部商品
const loadProduct = async () => {
    const GETALL_URL = `${BASE_URL}Product/selectAll`
    const response = await fetch(GETALL_URL)
    product.value = await response.json()

    console.log(product.value);
}
loadProduct()

// 查詢單筆
const getOne = ref('');
const getOneProduct = async () => {
    const GETONE_URL = `${BASE_URL}Product/select/${getOne.value}`
    const response = await fetch(GETONE_URL)

    // getOne.value = await response.json()
    // console.log(getOne.value);
    // product.value = getOne.value

    const data = await response.json()
    console.log(data);
    product.value = data
    
}

// 處理圖片 URL
function getImageUrl(item ) {
    const imgurl = item.OneToManyProductImages.find(img => img.isPrimary).imageUrl
    const Url = `${BASE_URL}${imgurl}`;
    return Url;
    
    // return ${BASE_URL}${imageUrl};
}

//變更上下架狀態
async function updateListingStatus(productId, newStatus) {
    const url = `${BASE_URL}Product/updateStatus/${productId}?status=${newStatus}`;
    
    const response = await fetch(url, {
        method: 'PUT',  
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        loadProduct();
    }
}

//點按鈕更改(變更上下架狀態)
function listingStatus(item){
    console.log('上架狀態:',item);
    const newStatus = item.status === 1 ? 0 : 1;
    updateListingStatus(item.productId, newStatus);
    
}


function editItem(item) {
    console.log('编辑项目：', item);
    Swal.fire('123');
}


const deleteItem = async(item) => {
const result = await Swal.fire({
    title: `確定要刪除 ${item.productName} 嗎?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#E0E0E0",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  })

  if (result.isConfirmed) {
    const response = await fetch(`${BASE_URL}Product/delete/${item.productId}` ,{
    method:'DELETE'
  })

  if (response.ok) {
    loadProduct()

    Swal.fire({
        title: "已刪除!",
        text:`${item.productName} 已成功刪除`,
        icon: "success",
        confirmButtonColor: "#3085d6",
    })
  } else{
    Swal.fire({
        title:"錯誤",
        text:"刪除失敗，請稍後再試",
        icon:"error",
        confirmButtonColor: "#3085d6",
    })
  }

  }
}

</script>

<template>
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <div class="input-group mb-4">
                <input type="text" class="form-control" placeholder="請輸入商品編號" v-model="getOne" />
                <button class="btn btn-primary" @click="getOneProduct">
                    查詢
                </button>
            </div>
            <RouterLink :to="{ name: 'productAdd' }">
                <button class="text">新增商品</button>
            </RouterLink>
             

        </div>
    <div>
        <v-data-table :items="product" :headers="headers" item-value="typeName">

            <template #item.imageUrl="{ item }">
                <img :src="getImageUrl(item )" alt="Product Image" style="height: 100px; width: 100px; object-fit: cover;" />
            </template>

            <template #item.listingStatus="{ item }">
                <v-btn :color="item.status === 0 ? 'grey' : 'primary'"  class="mr-2" @click="listingStatus(item)">
                {{ item.status === 0 ? '下架' : '上架' }} 
                </v-btn>
            </template>

            <template #item.actions="{ item }">
                <v-btn color="primary" class="mr-2" @click="editItem(item)">
                    修改
                </v-btn>
                <!-- <v-btn color="error" @click="deleteItem(item)">
                    删除
                </v-btn> -->
            </template>

        </v-data-table>

    </div>
</template>

<style lang="css" scoped>
td img {
    height: 200px;
}
</style>