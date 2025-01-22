import BookingBack from "@/components/booking/BookingBack.vue";
import BookingHome from "@/layouts/booking/BookingHome.vue";
import RoomFront from "@/layouts/booking/RoomFront.vue";
import BackView from "@/layouts/common/BackView.vue";
import FrontView from "@/layouts/common/FrontView.vue";
import RoomTypeView from "@/views/booking/RoomTypeView.vue";
import { createRouter, createWebHistory } from "vue-router";
import AttractionComponent from '@/components/Attraction/AttractionComponent.vue';
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
          path: 'booking/roomType',
          name: 'roomFront',
          component: RoomFront,
        },
        {
          path: 'Attraction/AttractionType',
          name: 'attractionFront',
          component: AttractionComponent,
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
            }
          ]
        }
      ]
    },
  ],
});

export default router;
