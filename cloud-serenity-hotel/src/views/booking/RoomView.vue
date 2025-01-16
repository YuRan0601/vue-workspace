<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, ref, watchEffect } from 'vue';

function resetInsert() {
  insertRoom.value.roomType.typeId = null;
  insertRoom.value.roomId = null;
  insertRoom.value.roomName = "";
  insertRoom.value.roomDescription = "";
  insertRoom.value.status = "";
}



const headers = [
  { title: "房間ID", key: "roomTypeId" },
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
  {name: "空閒中" , value: "available"},
  {name: "占用中" , value: "occupied"},
  {name: "維修中" , value: "maintenance"},
]

async function loadRoomTypeTable() {
  const { data } = await axios.get("/api/room/type");
  roomTypeTable.value = data;
}


async function loadRoomTable() {
  const { data } = await axios.get("/api/room");
  console.log(data);
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
  status: ""
});


async function insertRoomHandler() {
  console.log(insertRoom.value);

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
      const { data } = await axios.post("/api/room", 
      insertRoom.value, 
      {
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
    status: ""
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

  function updateRoomHandler() {
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

        const { data } = await axios.put("/api/room", 
        updateRoom.value, 
        {
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

  watchEffect(() => {
    if (!insertDialog.value) {
      resetInsert();
    }
  })
</script>

<template>
  <div>
    <!-- insert表單 -->
    <div class="pa-4 text-center">
      <v-dialog v-model="insertDialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn
            class="text-none font-weight-regular"
            prepend-icon="mdi-account"
            text="新增房間"
            variant="tonal"
            v-bind="activatorProps"
          ></v-btn>
        </template>

        <v-card prepend-icon="mdi-account" title="新增房間">
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-select
                  v-model="insertRoom.roomType.typeId"
                  label="房間類型"
                  :items="roomTypeTable"
                  item-title="typeName"
                  item-value="typeId"
                >
                </v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="房間名稱*"
                  v-model="insertRoom.roomName"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="insertRoom.status"
                  label="房間狀態"
                  :items="roomStatus"
                  item-title="name"
                  item-value="value"
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
            <v-row dense>
              <v-col cols="12">
                <v-select
                  v-model="updateRoom.roomType.typeId"
                  label="房間類型"
                  :items="roomTypeTable"
                  item-title="typeName"
                  item-value="typeId"
                >
                </v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="房間名稱*"
                  v-model="updateRoom.roomName"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="updateRoom.status"
                  label="房間狀態"
                  :items="roomStatus"
                  item-title="name"
                  item-value="value"
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
      <v-data-table
      :items="roomTable"
      :headers="headers"
      item-value="roomName"
      class="roomTable"
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
</style>