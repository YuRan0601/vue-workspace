import BookingBack from "@/components/booking/BookingBack.vue";
import ProductBack from "@/components/product/ProductBack.vue";
import BookingHome from "@/layouts/booking/BookingHome.vue";
import RoomFront from "@/layouts/booking/RoomFront.vue";
import BackView from "@/layouts/common/BackView.vue";
import FrontView from "@/layouts/common/FrontView.vue";
import RoomTypeView from "@/views/booking/RoomTypeView.vue";
import ProductAdd from "@/views/product/ProductAdd.vue";
import ProductHome from "@/views/product/ProductHome.vue";
import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // }
    {
      path: '/front',
      name: 'front',
      component: FrontView,
      children: [
        {
          path: '/front/booking/roomType',
          name: 'roomFront',
          component: RoomFront,
        },
      ]
    },
    {
      path: '/back',
      name: 'back',
      component: BackView,
      children: [
        {
          path: '/bookingBack',
          name: 'bookingBack',
          component: BookingBack,
          children: [
            {
              path: '/booking/roomType',
              name: 'roomType',
              component: RoomTypeView
            },
          ]
        },
        {
          path: '/productBack',
          name: 'productBack',
          component: ProductBack,
          children: [
            {
              path: '/productAll',
              name: 'productAll',
              component: ProductHome
            }
          ]
        },
        { path: "/productAdd", component: ProductAdd, name: "productAdd" },
      ]
    },

  ],
});

export default router;
