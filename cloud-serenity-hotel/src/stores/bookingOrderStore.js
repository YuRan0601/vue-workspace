import { defineStore } from "pinia";
import Swal from "sweetalert2";
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

  function checkValue() {
    if (
      !checkInDate.value ||
      !checkOutDate.value ||
      !roomTypeId.value ||
      !roomTypeName.value ||
      !totalPrice.value
    ) {
      Swal.fire("請確認訂房資料!").then(() => {
        this.router.push({ name: "bookingSearch" });
      });
      return false;
    } else {
      return true;
    }
  }

  function toOrderView() {
    this.router.push({ name: "bookingOrder" });
  }

  return {
    checkInDate,
    checkOutDate,
    roomTypeId,
    roomTypeName,
    totalPrice,
    resetAll,
    checkValue,
    toOrderView
  };
});
