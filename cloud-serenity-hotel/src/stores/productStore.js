import { defineStore } from "pinia"
import { ref } from 'vue'

//共享分類、與商品的資料
export const useProductStore = defineStore('product', () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL
    const GETALL_URL = `${BASE_URL}Product/select/productStatus/1`

    const products = ref([])
    const categories = ref([])
    const searchQuery = ref("")
    // const selectedCategory = ref(null) 

    // 顯示全部商品
    const loadProduct = async () => {
        const response = await fetch(GETALL_URL)
        products.value = await response.json()
        console.log(products.value)
    }

    //顯示全部分類
    const loadCategories = async () => {
        const CATEGORY_URL = `${BASE_URL}Product/select/allCategories`
        const response = await fetch(CATEGORY_URL)
        categories.value = await response.json()
    }

    // 根據分類篩選商品
    const filterByCategory = async (categoryId) => {
        const PRODUCT_BY_CATEGORY_URL = `${BASE_URL}Product/select/productCategory/`
        // selectedCategory.value = categoryId // 記錄選中的分類
        const response = await fetch(PRODUCT_BY_CATEGORY_URL + categoryId)
        products.value = await response.json()
    }

    const searchProducts = async () => {

        if (!searchQuery.value.trim()) {
            loadProduct(); // 如果搜尋框是空的，載入全部商品
            return;
        }
        const response = await fetch(`${BASE_URL}/Product/search?name=${encodeURIComponent(searchQuery.value)}`);
        products.value = await response.json();
        console.log("搜尋中:", store.searchQuery);
        console.log("搜尋結果：", JSON.stringify(store.filteredProducts, null, 2));
    };

    return { products, categories, loadProduct, loadCategories, filterByCategory, searchProducts, searchQuery, }

})