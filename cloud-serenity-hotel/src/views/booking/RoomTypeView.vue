<script setup>
import axios from "axios";
import { rule } from "postcss";
import Swal from "sweetalert2";
import { onMounted, ref, watchEffect } from "vue";

const insertForm = ref(null);
const isValidInsert = ref(false);
const updateForm = ref(null);
const isValidUpdate = ref(false);

const rules = {
  required: (value) => !!value || "此欄位為必填",
  number: (value) => /^\d+$/.test(value) || "必須是數字",
  positive: (value) => value > 0 || "數字必須大於 0",
};

function resetInsert() {
  insertRoomType.value.typeName = "";
  insertRoomType.value.typeId = null;
  insertRoomType.value.maxCapacity = null;
  insertRoomType.value.typeDesc = "";
  insertRoomType.value.price = null;
  insertPrImg.value = null;
  insertOtherImg.value = [];
  insertPreviewUrl.value = null;
  insertPreviewUrls.value = [];
}

function resetUpdate() {
  updatePrImg.value = null;
  updateOtherImg.value = [];
  updatePreviewUrl.value = null;
  updatePreviewUrls.value = [];
}

const headers = [
  { title: "房型ID", key: "typeId" },
  { title: "房型名稱", key: "typeName" },
  { title: "容納人數", key: "maxCapacity" },
  { title: "每晚房價", key: "price" },
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

const search = ref("");

const updateRoomType = ref({
  typeId: null,
  typeName: "",
  typeDesc: "",
  maxCapacity: null,
  price: null,
});

const updateDialog = ref(false);
const updatePrImg = ref(null);
const updateOtherImg = ref([]);

const updatePreviewUrl = ref(null); // 存储图片预览的 URL
const updatePreviewUrls = ref([]);

const selectPrImg = ref(null);
const selectOtherImg = ref([]);

const deletePrImgIdAndUrl = ref(null);
const deleteOtherImgsIdAndUrl = ref([]);

function editItem(item) {
  console.log(item);
  updateDialog.value = true;
  updateRoomType.value.typeId = item.typeId;
  updateRoomType.value.typeName = item.typeName;
  updateRoomType.value.typeDesc = item.typeDesc;
  updateRoomType.value.price = item.price;
  updateRoomType.value.maxCapacity = item.maxCapacity;
  selectPrImg.value = item.prImg;
  selectOtherImg.value = item.imgs;
}

function checkUpdateRoomType(value) {
  if (!value) return "房型名稱為必填";

  for (let i = 0; i < roomTypeTable.value.length; i++) {
    if (updateRoomType.value.typeId === roomTypeTable.value[i].typeId) {
      continue;
    }

    if (value === roomTypeTable.value[i].typeName) {
      return "房型名稱已存在";
    }
  }

  return true;
}

async function updateRoomTypeHandler() {
  const { valid } = await updateForm.value.validate();

  if (!valid) {
    await Swal.fire({
      title: "請確定輸入的內容符合規則!",
      icon: "error",
      confirmButtonText: "確定",
    });

    return;
  }

  Swal.fire({
    title: `確定要修改 ${updateRoomType.value.typeName} 房型?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then(async (res) => {
    if (res.isConfirmed) {
      const formData = new FormData();
      console.log("123" + updateRoomType.value);

      formData.append("roomTypeJson", JSON.stringify(updateRoomType.value));

      // 添加主圖片
      if (updatePrImg.value) {
        formData.append("typePrimaryImg", updatePrImg.value);
      }

      // 添加其他圖片（多個文件）
      if (updateOtherImg.value && updateOtherImg.value.length > 0) {
        updateOtherImg.value.forEach((file, index) => {
          // 將每個文件都添加到 FormData 中
          formData.append("typeImg", file); // 可以根據需要調整 key 的命名
        });
      }

      if (deletePrImgIdAndUrl.value) {
        formData.append("deletePrImgIdAndUrl", deletePrImgIdAndUrl.value);
      }

      if (
        deleteOtherImgsIdAndUrl.value &&
        deleteOtherImgsIdAndUrl.value.length > 0
      ) {
        deleteOtherImgsIdAndUrl.value.forEach((item, index) => {
          // 將每個文件都添加到 FormData 中
          formData.append("deleteOtherImgsIdAndUrl", item); // 可以根據需要調整 key 的命名
        });
      }

      console.log(formData.getAll("deleteOtherImgsIdAndUrl"));

      const { data } = await axios.put("/api/room/type", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (data !== 0) {
        Swal.fire({
          title: "修改成功",
          icon: "success",
          confirmButtonText: "確定",
        }).then(() => {
          loadTable();
          updateDialog.value = false;
        });
      } else {
        Swal.fire({
          title: "修改失敗",
          icon: "error",
          confirmButtonText: "確定",
        }).then(() => {
          loadTable();
          updateDialog.value = false;
        });
      }
    }
  });
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
  price: null,
});

const insertPrImg = ref(null);
const insertOtherImg = ref([]);
const insertPreviewUrl = ref(null); // 存储图片预览的 URL
const insertPreviewUrls = ref([]);

function checkInsertRoomType(value) {
  if (!value) return "房型名稱為必填";

  for (let i = 0; i < roomTypeTable.value.length; i++) {
    if (value === roomTypeTable.value[i].typeName) {
      return "房型名稱已存在";
    }
  }

  return true;
}

async function insertRoomTypeHandler() {
  console.log(insertRoomType.value);

  const { valid } = await insertForm.value.validate();

  console.log(valid);

  if (!valid) {
    Swal.fire({
      title: "請確定輸入的內容符合規則!",
      icon: "error",
      confirmButtonText: "確定",
    });
    return;
  }

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

function quickInsert() {
  insertRoomType.value.typeName = "豪華雙床房";
  insertRoomType.value.maxCapacity = 2;
  insertRoomType.value.price = 7000;
  insertRoomType.value.typeDesc = `床墊尺寸 ：2 張單人床。
客房寬敞度：38 平方公尺。
本飯店最寬敞的客房，裝潢黑色與灰色石面牆、大型雙層窗戶和寧靜的室內設計。 可日夜欣賞城市美景。
  `;
}

function quickUpdate() {
  updateRoomType.value.typeName = "豪華大床房";
  updateRoomType.value.maxCapacity = 2;
  updateRoomType.value.price = 6500;
  updateRoomType.value.typeDesc = `床墊尺寸 ：1 張雙人床。
客房寬敞度：22 平方公尺。
豪華大床房配色清爽溫潤，柔和的光線有助放鬆心情。
  `;
}

watchEffect(() => {
  if (!insertDialog.value) {
    resetInsert();
  }

  if (!updateDialog.value) {
    resetUpdate();
  }

  //監視主圖片是否改變
  if (insertPrImg.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      insertPreviewUrl.value = e.target.result; // 设置预览 URL
    };
    reader.readAsDataURL(insertPrImg.value);
  } else {
    insertPreviewUrl.value = "";
  }

  //監視其他圖片是否改變
  if (insertOtherImg.value.length === 0) {
    insertPreviewUrls.value = [];
  } else {
    // 读取每个文件并生成预览
    insertPreviewUrls.value = [];
    Array.from(insertOtherImg.value).forEach((file) => {
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          insertPreviewUrls.value.push(e.target.result); // 添加预览 URL
        };
        reader.readAsDataURL(file); // 读取文件
      }
    });
  }

  if (deletePrImgIdAndUrl.value) {
    console.log(deletePrImgIdAndUrl);
  }

  if (deleteOtherImgsIdAndUrl.value) {
    console.log(deleteOtherImgsIdAndUrl);
  }

  //監視主圖片是否改變
  if (updatePrImg.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      updatePreviewUrl.value = e.target.result; // 设置预览 URL
    };
    reader.readAsDataURL(updatePrImg.value);
  } else {
    updatePreviewUrl.value = "";
  }

  //監視其他圖片是否改變
  if (updateOtherImg.value.length === 0) {
    updatePreviewUrls.value = [];
  } else {
    // 读取每个文件并生成预览
    updatePreviewUrls.value = [];
    Array.from(updateOtherImg.value).forEach((file) => {
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          updatePreviewUrls.value.push(e.target.result); // 添加预览 URL
        };
        reader.readAsDataURL(file); // 读取文件
      }
    });
  }
});
</script>

<template>
  <div>
    <div class="pa-4 text-center">
      <v-dialog v-model="insertDialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            class="text-none font-weight-regular"
            text="新增房型"
            color="green"
            v-bind="activatorProps"
          ></v-btn>
        </template>

        <v-card prepend-icon="mdi-account" title="新增房型">
          <v-card-text>
            <v-form ref="insertForm" v-model="isValidInsert">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    label="房型名稱*"
                    v-model="insertRoomType.typeName"
                    :rules="[rules.required, checkInsertRoomType]"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" sm="6">
                  <v-text-field
                    hint="請輸入大於0的數字"
                    v-model="insertRoomType.maxCapacity"
                    :rules="[rules.required, rules.number, rules.positive]"
                    label="容納人數*"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" sm="6">
                  <v-text-field
                    hint="請輸入大於0的數字"
                    v-model="insertRoomType.price"
                    :rules="[rules.required, rules.number, rules.positive]"
                    label="每晚房價*"
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
                    v-if="insertPreviewUrl"
                    :src="insertPreviewUrl"
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

                  <v-row v-if="insertPreviewUrls.length > 0" class="mt-4">
                    <v-col
                      v-for="(url, index) in insertPreviewUrls"
                      :key="index"
                      cols="4"
                    >
                      <v-img
                        :src="url"
                        max-height="200"
                        max-width="200"
                      ></v-img>
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
            </v-form>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="關閉"
              variant="plain"
              @click="insertDialog = false"
            ></v-btn>

            <v-btn text="一鍵代入" variant="plain" @click="quickInsert"></v-btn>

            <v-btn
              color="primary"
              text="確定新增"
              variant="tonal"
              @click="insertRoomTypeHandler"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div class="pa-4 text-center">
      <v-dialog v-model="updateDialog" max-width="1000">
        <v-card title="修改房型">
          <v-card-text>
            <v-form ref="updateForm" v-model="isValidUpdate">
              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    label="房型名稱*"
                    v-model="updateRoomType.typeName"
                    :rules="[rules.required, checkUpdateRoomType]"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" sm="6">
                  <v-text-field
                    hint="請輸入大於0的數字"
                    v-model="updateRoomType.maxCapacity"
                    :rules="[rules.required, rules.number, rules.positive]"
                    label="容納人數*"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6" sm="6">
                  <v-text-field
                    hint="請輸入大於0的數字"
                    v-model="updateRoomType.price"
                    :rules="[rules.required, rules.number, rules.positive]"
                    label="每晚房價*"
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
                    v-if="updatePreviewUrl"
                    :src="updatePreviewUrl"
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

                  <v-row v-if="updatePreviewUrls.length > 0" class="mt-4">
                    <v-col
                      v-for="(url, index) in updatePreviewUrls"
                      :key="index"
                      cols="4"
                    >
                      <v-img
                        :src="url"
                        max-height="200"
                        max-width="200"
                      ></v-img>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col v-if="selectPrImg" cols="12">
                  <div id="prImgDiv">
                    <span>選取刪除已有的房型主圖片：</span><br />
                    <div>
                      <v-checkbox
                        :value="selectPrImg.imgId + '，' + selectPrImg.imgUrl"
                        v-model="deletePrImgIdAndUrl"
                      >
                        <template #label>
                          <div class="prImg">
                            <img :src="selectPrImg.imgUrl" />
                          </div>
                        </template>
                      </v-checkbox>
                    </div>
                  </div>
                </v-col>

                <v-col
                  v-if="
                    selectOtherImg !== undefined && selectOtherImg.length > 0
                  "
                  cols="12"
                >
                  <div id="otherImgsDiv">
                    <span>選取刪除已有的其他房型圖片：</span><br />
                    <div v-for="img in selectOtherImg" :key="img.imgId">
                      <v-checkbox
                        :value="img.imgId + '，' + img.imgUrl"
                        v-model="deleteOtherImgsIdAndUrl"
                      >
                        <template #label>
                          <div class="prImg">
                            <img :src="img.imgUrl" />
                          </div>
                        </template>
                      </v-checkbox>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    label="房型描述"
                    v-model="updateRoomType.typeDesc"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="關閉"
              variant="plain"
              @click="updateDialog = false"
            ></v-btn>

            <v-btn text="一鍵代入" variant="plain" @click="quickUpdate"></v-btn>

            <v-btn
              color="primary"
              text="確定修改"
              variant="tonal"
              @click="updateRoomTypeHandler"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-text-field v-model="search" label="查詢"></v-text-field>

    <v-data-table
      :items="roomTypeTable"
      :headers="headers"
      item-value="typeName"
      class="roomTypeTable"
      :search="search"
      show-expand
    >
      <template v-slot:expanded-row="{ item }">
        <tr>
          <th :colspan="3">照片</th>
          <th :colspan="4">房型描述</th>
        </tr>
        <tr>
          <td :colspan="3">
            <div v-if="item.prImg">
              <img :src="item.prImg.imgUrl" alt="" />
            </div>
            <div v-else>沒有圖片</div>
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

.prImg img {
  height: 100px;
}

.v-dialog {
  z-index: 1000 !important;
}

.swal2-container {
  z-index: 9999 !important;
}

th {
  background-color: #5df5e8;
}

.v-data-table thead {
  background-color: #ff5722 !important;
}

.v-data-table-header {
  background-color: #5df5e8 !important;
}
</style>
