<script setup>
import axios from "axios";
import Swal from "sweetalert2";
import { onMounted, ref, watchEffect } from "vue";

const headers = [
  { title: "房型ID", key: "typeId" },
  { title: "房型名稱", key: "typeName" },
  { title: "容納人數", key: "maxCapacity" },
  { title: "新增時間", key: "createdDate" },
  { title: "修改時間", key: "updatedDate" },
  { title: "操作", key: "actions" },
];

const roomTypeTable = ref([]);

async function loadTable() {
  const { data } = await axios.get("/api/room/type");
  console.log(data);

  roomTypeTable.value = data;
}

onMounted(async () => {
  loadTable();
});

const updateRoomType = ref({
  typeId: null,
  typeName: "",
  typeDesc: "",
  maxCapacity: null,
});

const updateDialog = ref(false);

const updatePrImg = ref(null);

const updateOtherImg = ref([]);

function editItem(item) {
  updateDialog.value = true;
  updateRoomType.value = item;
  console.log(item.imgs[0]);
}

function deleteItem(item) {
  console.log(item.typeName);
  Swal.fire({
    title: `確定要刪除 ${item.typeName} 嗎?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { data } = await axios.delete(`/api/room/type/${item.typeId}`);

      if (data > 0) {
        Swal.fire({
          title: "刪除成功",
          icon: "success",
          confirmButtonText: "確定",
        }).then(() => {
          loadTable();
        });
      } else {
        Swal.fire({
          title: "刪除失敗",
          icon: "error",
          confirmButtonText: "確定",
        }).then(() => {
          loadTable();
        });
      }
    }
  });
}

const insertDialog = ref(false);

const insertRoomType = ref({
  typeId: null,
  typeName: "",
  maxCapacity: null,
  typeDesc: "",
});

const insertPrImg = ref(null);
const insertOtherImg = ref([]);
const previewUrl = ref(null); // 存储图片预览的 URL
const previewUrls = ref([]);

watchEffect(() => {
  //監視主圖片是否改變
  if (insertPrImg.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target.result; // 设置预览 URL
    };
    reader.readAsDataURL(insertPrImg.value);
  } else {
    previewUrl.value = "";
  }

  //監視其他圖片是否改變
  if (insertOtherImg.value.length === 0) {
    previewUrls.value = [];
  } else {
    // 读取每个文件并生成预览
    previewUrls.value = [];
    Array.from(insertOtherImg.value).forEach((file) => {
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewUrls.value.push(e.target.result); // 添加预览 URL
        };
        reader.readAsDataURL(file); // 读取文件
      }
    });
  }
});

async function insertRoomTypeHandler() {
  console.log(insertRoomType.value);

  Swal.fire({
    title: "確定要新增此房型?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then(async (res) => {
    if (res.isConfirmed) {
      const formData = new FormData();

      formData.append("roomTypeJson", JSON.stringify(insertRoomType.value));

      // 添加主圖片
      if (insertPrImg.value) {
        formData.append("typePrimaryImg", insertPrImg.value);
      }

      // 添加其他圖片（多個文件）
      if (insertOtherImg.value && insertOtherImg.value.length > 0) {
        insertOtherImg.value.forEach((file, index) => {
          // 將每個文件都添加到 FormData 中
          formData.append("typeImg", file); // 可以根據需要調整 key 的命名
        });
      }

      console.log(formData);

      const { data } = await axios.post("/api/room/type", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (data !== 0) {
        Swal.fire({
          title: "新增成功",
          icon: "success",
          confirmButtonText: "確定",
        }).then(() => {
          loadTable();
          insertDialog.value = false;
        });
      } else {
        Swal.fire({
          title: "新增失敗",
          icon: "error",
          confirmButtonText: "確定",
        }).then(() => {
          loadTable();
          insertDialog.value = false;
        });
      }
    }
  });
}
</script>

<template>
  <div>
    <div class="pa-4 text-center">
      <v-dialog v-model="insertDialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            class="text-none font-weight-regular"
            prepend-icon="mdi-account"
            text="新增房型"
            variant="tonal"
            v-bind="activatorProps"
          ></v-btn>
        </template>

        <v-card prepend-icon="mdi-account" title="新增房型">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  label="房型名稱*"
                  v-model="insertRoomType.typeName"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  hint="請輸入大於0的數字"
                  v-model="insertRoomType.maxCapacity"
                  label="容納人數*"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  label="房型主圖片"
                  v-model="insertPrImg"
                  :multiple="false"
                  accept="image/*"
                >
                </v-file-input>

                <v-img
                  v-if="previewUrl"
                  :src="previewUrl"
                  max-height="200"
                  max-width="200"
                  class="mt-4"
                ></v-img>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  label="房型其他圖片"
                  accept="image/*"
                  v-model="insertOtherImg"
                  multiple
                >
                </v-file-input>

                <v-row v-if="previewUrls.length > 0" class="mt-4">
                  <v-col
                    v-for="(url, index) in previewUrls"
                    :key="index"
                    cols="4"
                  >
                    <v-img :src="url" max-height="200" max-width="200"></v-img>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="房型描述"
                  v-model="insertRoomType.typeDesc"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Close"
              variant="plain"
              @click="insertDialog = false"
            ></v-btn>

            <v-btn
              color="primary"
              text="Save"
              variant="tonal"
              @click="insertRoomTypeHandler"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div class="pa-4 text-center">
      <v-dialog v-model="updateDialog" max-width="600">
        <v-card prepend-icon="mdi-account" title="修改房型">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  label="房型名稱*"
                  v-model="updateRoomType.typeName"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6" sm="6">
                <v-text-field
                  hint="請輸入大於0的數字"
                  v-model="updateRoomType.maxCapacity"
                  label="容納人數*"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  label="房型主圖片"
                  v-model="updatePrImg"
                  :multiple="false"
                  accept="image/*"
                >
                </v-file-input>

                <v-img
                  v-if="previewUrl"
                  :src="previewUrl"
                  max-height="200"
                  max-width="200"
                  class="mt-4"
                ></v-img>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  label="房型其他圖片"
                  accept="image/*"
                  v-model="updateOtherImg"
                  multiple
                >
                </v-file-input>

                <v-row v-if="previewUrls.length > 0" class="mt-4">
                  <v-col
                    v-for="(url, index) in previewUrls"
                    :key="index"
                    cols="4"
                  >
                    <v-img :src="url" max-height="200" max-width="200"></v-img>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="房型描述"
                  v-model="updateRoomType.typeDesc"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Close"
              variant="plain"
              @click="updateDialog = false"
            ></v-btn>

            <v-btn
              color="primary"
              text="Save"
              variant="tonal"
              @click="insertRoomTypeHandler"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-data-table
      :items="roomTypeTable"
      :headers="headers"
      item-value="typeName"
      show-expand
    >
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="3">照片</td>
          <td :colspan="4">房型描述</td>
        </tr>
        <tr>
          <td :colspan="3">
            <img :src="item.imgs[0].imgUrl" alt="" />
          </td>
          <td :colspan="3">
            {{ item.typeDesc }}
          </td>
        </tr>
      </template>

      <template #item.actions="{ item }">
        <v-btn color="primary" class="mr-2" @click="editItem(item)">
          修改
        </v-btn>
        <v-btn color="error" @click="deleteItem(item)"> 删除 </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<style lang="css" scoped>
td img {
  height: 200px;
}

.v-dialog {
  z-index: 1000 !important;
}

.swal2-container {
  z-index: 9999 !important;
}
</style>
