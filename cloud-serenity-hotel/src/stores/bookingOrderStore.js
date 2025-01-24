import { defineStore } from "pinia";

export const useBookingOrderStore = defineStore('bookingOrder', () => {
    const checkInDate = ref(null);
    const checkOutDate = ref(null);
    const roomTypeId = ref(null);
    const totalPrice = ref(null);

    return { checkInDate, checkOutDate, roomTypeId, totalPrice }
})