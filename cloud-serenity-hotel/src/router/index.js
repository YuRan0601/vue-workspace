import BookingBack from "@/components/booking/BookingBack.vue";
import CarImage from "@/components/rent/CarImage.vue";
import BookingHome from "@/layouts/booking/BookingHome.vue";
import RoomFront from "@/layouts/booking/RoomFront.vue";
import BackView from "@/layouts/common/BackView.vue";
import FrontView from "@/layouts/common/FrontView.vue";
import CarHome from "@/layouts/rent/CarHome.vue";
import ModelOperate from "@/layouts/rent/modelOperate.vue";
import RoomTypeView from "@/views/booking/RoomTypeView.vue";
import CarInfo from "@/views/rent/CarInfo.vue";
import CarTypeView from "@/views/rent/CarTypeView.vue";
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
            }
          ]
        },
        { path:'/rent/carHome', name:'carHome',component:CarHome,
          children: [
            { path: '/rent/carType',name: 'carType',component: CarTypeView }
          ]
        },
        { path:'/rent/modelOperate/:id',name:'modelOperate',component:ModelOperate, props:true,
          children: [
            { path: '/rent/carInfo/:id',name: 'carInfo',component: CarInfo, props:true},
            { path: 'carImage/:id',name: 'carImage',component: CarImage, props: true}
           
          ]
        }
      ]
    },
    ]
});

export default router;
