import BookingBack from "@/components/booking/BookingBack.vue";
import OrderBack from "@/components/order/OrderBack.vue";
import BookingHome from "@/layouts/booking/BookingHome.vue";
import RoomFront from "@/layouts/booking/RoomFront.vue";
import BackView from "@/layouts/common/BackView.vue";
import FrontView from "@/layouts/common/FrontView.vue";
import RoomTypeView from "@/views/booking/RoomTypeView.vue";
import OrderDetailView from "@/views/order/OrderDetailView.vue";
import OrderEditView from "@/views/order/OrderEditView.vue";
import OrderListView from "@/views/order/OrderListView.vue";
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
        {
          path: '/orderBack',
          name: 'orderBack',
          component: OrderBack, // 訂單後台的主組件
          redirect: '/order/orderList', // 自動跳轉到 OrderListView
          children: [
            {
              path: '/order/orderList',
              name: 'orderList',
              component: OrderListView
            },
            {
              path: '/order/orderdetail',
              name: 'orderdetail',
              component: OrderDetailView,
              props: (route) => ({ orderId: route.query.orderId }), // 將 query 作為 props 傳入
            },
            {
              path: '/order/orderedit',
              name: 'orderedit',
              component: OrderEditView
            }
          ]
        }
      ]
    },

  ],
});

export default router;
