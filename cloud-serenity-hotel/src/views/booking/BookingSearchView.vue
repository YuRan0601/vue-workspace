<script setup>
import { ref } from 'vue';

    const selectedStartDate = ref(null);
    const selectedEndDate = ref(null);
</script>

<template>
    <div>

        <v-container>
            <v-row justify="center">
            <v-col cols="12" md="5">
                <v-date-picker
                v-model="selectedStartDate"
                title="選擇訂房日期"
                header="選擇訂房日期"
                locale="zh-Hant"
                ></v-date-picker>
            </v-col>

            <v-col cols="12" md="2">
                
            </v-col>

            <v-col cols="12" md="5">
                <v-date-picker
                v-model="selectedEndDate"
                title="選擇退房日期"
                header="選擇退房日期"
                ></v-date-picker>
            </v-col>
            </v-row>
        </v-container>
        <hr>
    </div>
</template>

<style lang="css" scoped>
    
</style>