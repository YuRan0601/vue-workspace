<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';

    const BASE_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

    const headers = [
        {title: "房型ID", key: 'typeId'},
        {title: "房型名稱", key: 'typeName'},
        {title: "容納人數", key: 'maxCapacity'},
        {title: "新增時間", key: 'createdDate'},
        {title: "修改時間", key: 'updatedDate'},
        {title: "操作", key: "actions"}
    ]
    
    const roomTypeTable = ref([]);

    onMounted(async () => {
        const { data } = await axios.get("/api/room/type");
        console.log(data);
        
        roomTypeTable.value = data;
    })

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
    <div>
        <v-data-table
        :items="roomTypeTable"
        :headers="headers"
        item-value="typeName"
        show-expand
        >
        <template v-slot:expanded-row="{ columns, item }">
            <tr>
            <td :colspan="3">
            照片
            </td>
            <td :colspan="4">
            房型描述
            </td>
        </tr>
        <tr>
            <td :colspan="3">
            <img :src="item.imgs[0].imgUrl" alt="">
            </td>
            <td :colspan="3">
            {{ item.typeDesc }}
            </td>
        </tr>
        </template>
        
        <template #item.actions="{ item }">
        <v-btn
          color="primary"
          class="mr-2"
          @click="editItem(item)"
        >
          修改
        </v-btn>
        <v-btn
          color="error"
          @click="deleteItem(item)"
        >
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