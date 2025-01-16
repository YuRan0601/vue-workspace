import BookingBack from "@/layouts/booking/BookingBack.vue";
import BookingHome from "@/layouts/booking/BookingHome.vue";
import RoomFront from "@/layouts/booking/RoomFront.vue";
import BackView from "@/layouts/common/BackView.vue";
import FrontView from "@/layouts/common/FrontView.vue";
import BookingSearchView from "@/views/booking/BookingSearchView.vue";
import RoomTypeView from "@/views/booking/RoomTypeView.vue";
import RoomView from "@/views/booking/RoomView.vue";
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
              path: '/back/booking/roomType',
              name: 'roomType',
              component: RoomTypeView
            },
            {
              path: '/back/booking/room',
              name: 'room',
              component: RoomView
            },
          ]
        },
      ]
    },
    {
      path: '/bookingHome',
      name: 'bookingHome',
      component: BookingHome,
      children: [
        {
          path: '/bookingSearch',
          name: 'bookingSearch',
          component: BookingSearchView,
        }
      ]
    }

  ],
});

export default router;
