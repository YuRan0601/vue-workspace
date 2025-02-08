<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const orderStatus = ref('');
const fileFormat = ref('');
const filePath = ref('');
const orders = ref([]);

// 獲取路由參數 (假設有訂單狀態參數)
const route = useRoute();
orderStatus.value = route.query.orderStatus || '處理中';

// 獲取訂單資料
const fetchOrders = async () => {
    try {
        const response = await axios.get('/api/orders', {
            params: { orderStatus: orderStatus.value }
        });
        orders.value = response.data;
    } catch (error) {
        console.error('取得訂單資料錯誤:', error);
    }
};

// 匯出訂單資料
const exportOrders = async () => {
    try {
        const response = await axios.post('/api/exportOrders', {
            orderStatus: orderStatus.value,
            format: fileFormat.value,
            filePath: filePath.value
        });
        alert('匯出成功！');
    } catch (error) {
        alert('匯出失敗，請重試！');
        console.error('匯出錯誤:', error);
    }
};

// 初次加載時獲取訂單資料
fetchOrders();
</script>

<template>
    <div>
        <h2>訂單資料匯出</h2>

        <!-- 使用 Vuetify 元件進行訂單資料展示 -->
        <v-container>
            <v-row>
                <v-col cols="12" md="4">
                    <v-select label="訂單狀態" v-model="orderStatus" :items="['未付款', '已付款', '處理中', '已發貨', '已完成', '已取消']"
                        item-text="name" item-value="value" outlined></v-select>
                </v-col>

                <v-col cols="12" md="4">
                    <v-select label="檔案格式" v-model="fileFormat" :items="['csv', 'json']" outlined></v-select>
                </v-col>

                <v-col cols="12" md="4">
                    <v-text-field label="檔案路徑" v-model="filePath" outlined></v-text-field>
                </v-col>
            </v-row>

            <v-btn @click="exportOrders" color="primary" class="mt-4">匯出訂單</v-btn>

            <!-- v-data-table 顯示訂單 -->
            <v-data-table :headers="headers" :items="orders" item-value="id">
                <template v-slot:[`item.orderDate`]="{ item }">
                    <span>{{ item.orderDate }}</span>
                </template>
                <template v-slot:[`item.finalAmount`]="{ item }">
                    <span>{{ item.finalAmount }} 元</span>
                </template>
            </v-data-table>
        </v-container>
    </div>
</template>

<style lang="css" scoped>
/* 自訂樣式 */
</style>
