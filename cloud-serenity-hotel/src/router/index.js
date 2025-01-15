import BookingBack from "@/components/booking/BookingBack.vue";
import BackMember from "@/views/user/BackMember.vue";
import BookingHome from "@/layouts/booking/BookingHome.vue";
import RoomFront from "@/layouts/booking/RoomFront.vue";
import BackView from "@/layouts/common/BackView.vue";
import FrontView from "@/layouts/common/FrontView.vue";
import FrontMember from "@/layouts/user/FrontMember.vue";
import RoomTypeView from "@/views/booking/RoomTypeView.vue";
import { createRouter, createWebHistory } from "vue-router";
import BackAdmin from "@/views/user/BackAdmin.vue";
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
                {
                    path: '/front/member',
                    name: 'memberFront',
                    component: FrontMember
                }
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
                    path: '/member',
                    name: 'memberBack',
                    component: BackMember
                },
                {
                    path: '/admin',
                    name: 'adminBack',
                    component: BackAdmin
                },

            ]
        },

    ],
});

export default router;
