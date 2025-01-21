<script setup>
import Swal from 'sweetalert2';
import { ref } from 'vue';

const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;
const GETALL_URL = `${BASE_URL}Product/selectAll`

const product = ref([]);

const loadProduct = async () => {
    const response = await fetch(GETALL_URL)

    product.value = await response.json()

    console.log(product.value);
}
loadProduct()

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

// 處理圖片 URL

function getImageUrl(imageUrl) {
    const Url = `${BASE_URL}${imageUrl}`;
    return Url;
    
    // return ${BASE_URL}${imageUrl};
}

function editItem(item) {
    console.log('编辑项目：', item);
    Swal.fire('123');
}

// 删除按钮点击事件
function deleteItem(item) {
    console.log('删除项目：', item);
    Swal.fire('123');
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

             <button class="text">新增商品</button>

        </div>
    <div>
        <v-data-table :items="product" :headers="headers" item-value="typeName">

            <template #item.imageUrl="{ item }">
                <img :src="getImageUrl(item.OneToManyProductImages.find(img => img.isPrimary).imageUrl)" alt="Product Image" style="height: 100px; width: 100px; object-fit: cover;" />
            </template>

            <template #item.listingStatus="{ item }">
                <v-btn color="primary" class="mr-2" @click="listingStatus(item)">
                    上架
                </v-btn>
            </template>

            <template #item.actions="{ item }">
                <v-btn color="primary" class="mr-2" @click="editItem(item)">
                    修改
                </v-btn>
                <v-btn color="error" @click="deleteItem(item)">
                    删除
                </v-btn>
            </template>

        </v-data-table>

    </div>
</template>

<style lang="css" scoped>
td img {
    height: 200px;
}
</style>