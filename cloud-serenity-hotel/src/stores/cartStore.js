import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        selectedItems: [],  // 儲存選中的商品
        recipient: {        // 儲存收件人資料
            name: '',
            phone: '',
            email: '',
            address: '',
            paymentMethod: '',
            userid: null // 新增 userid 欄位，預設為 null
        }
    }),
    actions: {
        // 設置選中的商品
        setSelectedItems(items) {
            console.log("Setting selected items:", items);  // 確認 Pinia store 是否正確設置商品
            this.selectedItems = items;
        },
        // 更新收件人資料
        setRecipientData(data) {
            this.recipient = { ...this.recipient, ...data };
        }
    }
});