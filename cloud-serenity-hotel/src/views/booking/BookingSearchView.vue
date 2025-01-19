<script setup>
import { ref } from "vue";

const checkInDate = ref(null);
const checkOutDate = ref(null);

function onSelectDate() {
  if (checkInDate.value) {
    checkOutDate.value = new Date(checkInDate.value);
    checkOutDate.value.setDate(checkOutDate.value.getDate() + 1);
  }
}
</script>

<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-date-input
            label="選擇入住日期"
            v-model="checkInDate"
            :min="new Date().toISOString().split('T')[0]"
            @update:modelValue="onSelectDate"
          ></v-date-input>
        </v-col>
        <v-col cols="12" md="6">
          <v-date-input
            label="選擇退房日期"
            v-model="checkOutDate"
            :min="new Date().toISOString().split('T')[0]"
            :allowed-dates="(date) => date >= checkInDate"
          ></v-date-input>
        </v-col>
      </v-row>
    </v-container>
    <!-- <v-container>
      <v-row justify="center">
        <v-col cols="12" md="5">
          <v-date-picker
            v-model="selectedStartDate"
            title="選擇訂房日期"
            header="選擇訂房日期"
            locale="zh-Hant"
          ></v-date-picker>
        </v-col>

        <v-col cols="12" md="2"> </v-col>

        <v-col cols="12" md="5">
          <v-date-picker
            v-model="selectedEndDate"
            title="選擇退房日期"
            header="選擇退房日期"
          ></v-date-picker>
        </v-col>
      </v-row>
    </v-container> -->
    <hr />
  </div>
</template>

<style lang="css" scoped></style>
