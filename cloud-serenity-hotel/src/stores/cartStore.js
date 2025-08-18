import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        selectedItems: [],  // 儲存選中的商品
        recipient: {        // 儲存收件人資料
            receiveName: '',
            phone: '',
            email: '',
            address: '',
            paymentMethod: '',
            userid: null
        }
    }),
    actions: {
        // 設置選中的商品，順便計算 subtotal
        setSelectedItems(items) {
            console.log("Setting selected items:", items);
            this.selectedItems = items.map(item => ({
                ...item,
                subtotal: item.quantity * (item.unitPrice - (item.discount || 0))
            }));
        },
        // 更新收件人資料
        setRecipientData(data) {
            this.recipient = { ...this.recipient, ...data };
        }
    }
});