import { defineStore } from "pinia";
import { ref } from "vue";

export const useBookingOrderStore = defineStore("bookingOrder", () => {
  const checkInDate = ref(null);
  const checkOutDate = ref(null);
  const roomTypeId = ref(null);
  const roomTypeName = ref(null);
  const totalPrice = ref(null);

  function resetAll() {
    console.log("123");

    checkInDate.value = null;
    checkOutDate.value = null;
    roomTypeId.value = null;
    roomTypeName.value = null;
    totalPrice.value = null;
  }

  return {
    checkInDate,
    checkOutDate,
    roomTypeId,
    roomTypeName,
    totalPrice,
    resetAll,
  };
});
