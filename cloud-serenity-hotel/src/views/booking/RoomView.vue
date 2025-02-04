<script setup>
import axiosInstance from "@/axios";
import axios from "axios";
import Swal from "sweetalert2";
import { onMounted, ref, watchEffect } from "vue";

const search = ref("");

const insertForm = ref(null);
const isValidInsert = ref(false);
const updateForm = ref(null);
const isValidUpdate = ref(false);

const rules = {
  required: (value) => !!value || "此欄位為必填",
  number: (value) => /^\d+$/.test(value) || "必須是數字",
  positive: (value) => value > 0 || "數字必須大於 0",
};

function checkInsertRoom(value) {
  if (!value) return "房名為必填";

  for (let i = 0; i < roomTable.value.length; i++) {
    if (value === roomTable.value[i].roomName) {
      return "房名已存在";
    }
  }

  return true;
}

function checkUpdateRoom(value) {
  if (!value) return "房型名稱為必填";

  for (let i = 0; i < roomTable.value.length; i++) {
    if (updateRoom.value.roomId === roomTable.value[i].roomId) {
      continue;
    }

    if (value === roomTable.value[i].roomName) {
      return "房型名稱已存在";
    }
  }

  return true;
}

function resetInsert() {
  insertRoom.value.roomType.typeId = null;
  insertRoom.value.roomId = null;
  insertRoom.value.roomName = "";
  insertRoom.value.roomDescription = "";
  insertRoom.value.status = "";
}

const headers = [
  { title: "房間ID", key: "roomId" },
  { title: "房間名稱", key: "roomName" },
  { title: "房間類型", key: "roomTypeName" },
  { title: "房間狀態", key: "status" },
  { title: "新增時間", key: "createdDate" },
  { title: "修改時間", key: "updatedDate" },
  { title: "操作", key: "actions" },
];

const roomTypeTable = ref([]);

const roomTable = ref([]);

const roomStatus = [
  { name: "空閒中", value: "available" },
  { name: "占用中", value: "occupied" },
  { name: "維修中", value: "maintenance" },
];

async function loadRoomTypeTable() {
  const { data } = await axios.get("/api/room/type");
  roomTypeTable.value = data;
}

async function roomTypeSwitchHandler(typeId) {
  const { data } = await axiosInstance.get(`/room/byType/${typeId}`);
  roomTable.value = data;
}

async function loadRoomTable() {
  const { data } = await axios.get("/api/room");
  roomTable.value = data;
}

onMounted(async () => {
  loadRoomTypeTable();
  loadRoomTable();
});

const insertDialog = ref(false);

const insertRoom = ref({
  roomType: {
    typeId: null,
  },
  roomId: null,
  roomName: "",
  roomDescription: "",
  status: "",
});

async function insertRoomHandler() {
  console.log(insertRoom.value);

  const { valid } = await insertForm.value.validate();

  if (!valid) {
    Swal.fire({
      title: "請確定輸入的內容符合規則!",
      icon: "error",
      confirmButtonText: "確定",
    });
    return;
  }

  Swal.fire({
    title: "確定要新增此房間?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then(async (res) => {
    if (res.isConfirmed) {
      const { data } = await axios.post("/api/room", insertRoom.value, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (data !== 0) {
        Swal.fire({
          title: "新增成功",
          icon: "success",
          confirmButtonText: "確定",
        }).then(() => {
          loadRoomTable();
          insertDialog.value = false;
        });
      } else {
        Swal.fire({
          title: "新增失敗",
          icon: "error",
          confirmButtonText: "確定",
        }).then(() => {
          loadRoomTable();
          insertDialog.value = false;
        });
      }
    }
  });
}

function deleteRoom(room) {
  console.log(room);
  Swal.fire({
    title: `確定要刪除 ${room.roomName} 嗎?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { data } = await axios.delete(`/api/room/${room.roomId}`);

      if (data > 0) {
        Swal.fire({
          title: "刪除成功",
          icon: "success",
          confirmButtonText: "確定",
        }).then(() => {
          loadRoomTable();
        });
      } else {
        Swal.fire({
          title: "刪除失敗",
          icon: "error",
          confirmButtonText: "確定",
        }).then(() => {
          loadRoomTable();
        });
      }
    }
  });
}

const updateRoom = ref({
  roomType: {
    typeId: null,
  },
  roomId: null,
  roomName: "",
  roomDescription: "",
  status: "",
});

const updateDialog = ref(false);

function editItem(item) {
  console.log(item);
  updateDialog.value = true;
  updateRoom.value.roomType.typeId = item.roomTypeId;
  updateRoom.value.roomId = item.roomId;
  updateRoom.value.roomName = item.roomName;
  updateRoom.value.roomDescription = item.roomDescription;
  updateRoom.value.status = item.status;
}

async function updateRoomHandler() {
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
    title: `確定要修改 ${updateRoom.value.roomName} 房間?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then(async (res) => {
    if (res.isConfirmed) {
      console.log("123" + updateRoom.value);

      const { data } = await axios.put("/api/room", updateRoom.value, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (data !== 0) {
        Swal.fire({
          title: "修改成功",
          icon: "success",
          confirmButtonText: "確定",
        }).then(() => {
          loadRoomTable();
          updateDialog.value = false;
        });
      } else {
        Swal.fire({
          title: "修改失敗",
          icon: "error",
          confirmButtonText: "確定",
        }).then(() => {
          loadRoomTable();
          updateDialog.value = false;
        });
      }
    }
  });
}

function quickInsert() {
  insertRoom.value.roomType.typeId = 7;
  insertRoom.value.roomName = "lt202";
  insertRoom.value.status = "available";
  insertRoom.value.roomDescription = "2樓";
}

watchEffect(() => {
  if (!insertDialog.value) {
    resetInsert();
  }
});
</script>

<template>
  <div>
    <!-- insert表單 -->
    <div class="pa-4 text-center">
      <v-dialog v-model="insertDialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            class="text-none font-weight-regular"
            text="新增房間"
            color="green"
            v-bind="activatorProps"
          ></v-btn>
        </template>

        <v-card prepend-icon="mdi-account" title="新增房間">
          <v-card-text>
            <v-form ref="insertForm" v-model="isValidInsert">
            <v-row dense>
              <v-col cols="12">
                <v-select
                  v-model="insertRoom.roomType.typeId"
                  label="房間類型"
                  :items="roomTypeTable"
                  item-title="typeName"
                  item-value="typeId"
                  :rules="[rules.required]"
                >
                </v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="房間名稱*"
                  v-model="insertRoom.roomName"
                  :rules="[rules.required, checkInsertRoom]"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="insertRoom.status"
                  label="房間狀態"
                  :items="roomStatus"
                  item-title="name"
                  item-value="value"
                  :rules="[rules.required]"
                >
                </v-select>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="房間描述"
                  v-model="insertRoom.roomDescription"
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

            <v-btn
              text="一鍵代入"
              variant="plain"
              @click="quickInsert"
            ></v-btn>

            <v-btn
              color="primary"
              text="確定新增"
              variant="tonal"
              @click="insertRoomHandler"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- update表單 -->
    <div class="pa-4 text-center">
      <v-dialog v-model="updateDialog" max-width="600">
        <v-card prepend-icon="mdi-account" title="修改房間">
          <v-card-text>
            <v-form ref="updateForm" v-model="isValidUpdate">
            <v-row dense>
              <v-col cols="12">
                <v-select
                  v-model="updateRoom.roomType.typeId"
                  label="房間類型"
                  :items="roomTypeTable"
                  item-title="typeName"
                  item-value="typeId"
                  :rules="[rules.required]"
                >
                </v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="房間名稱*"
                  v-model="updateRoom.roomName"
                  :rules="[rules.required, checkUpdateRoom]"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="updateRoom.status"
                  label="房間狀態"
                  :items="roomStatus"
                  item-title="name"
                  item-value="value"
                  :rules="[rules.required]"
                >
                </v-select>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  label="房間描述"
                  v-model="updateRoom.roomDescription"
                ></v-textarea>
              </v-col>
            </v-row>
            </v-form>
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
              @click="updateRoomHandler"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- 房間資料 -->
    <div>
      <v-container class="typeBtnContainer">
        <v-row>
          <v-btn class="typeBtn" color="black" @click="loadRoomTable"
            >所有</v-btn
          >
          <v-btn
            class="typeBtn"
            v-for="item in roomTypeTable"
            :key="item.typeId"
            color="black"
            @click="roomTypeSwitchHandler(item.typeId)"
            >{{ item.typeName }}</v-btn
          >
        </v-row>
      </v-container>

      <v-container>
        <v-text-field v-model="search" label="查詢"></v-text-field>
        <v-data-table
          :items="roomTable"
          :headers="headers"
          item-value="roomName"
          class="roomTable"
          :search="search"
          show-expand
        >
          <template v-slot:expanded-row="{ item }">
            <tr>
              <th :colspan="8">房間描述</th>
            </tr>
            <tr>
              <td :colspan="8">
                {{ item.roomDescription }}
              </td>
            </tr>
          </template>

          <template #item.actions="{ item }">
            <v-btn color="primary" class="mr-2" @click="editItem(item)">
              修改
            </v-btn>
            <v-btn color="error" @click="deleteRoom(item)"> 删除 </v-btn>
          </template>
        </v-data-table>
      </v-container>
    </div>
  </div>
</template>

<style lang="css" scoped>
.v-dialog {
  z-index: 1000 !important;
}

.swal2-container {
  z-index: 9999 !important;
}

.typeBtnContainer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.typeBtnContainer .typeBtn {
  margin: 5px;
}
</style>
