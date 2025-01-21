import BookingBack from "@/layouts/booking/BookingBack.vue";
import BackMember from "@/views/user/BackMember.vue";
import BookingHome from "@/layouts/booking/BookingHome.vue";
import RoomFront from "@/layouts/booking/RoomFront.vue";
import BackView from "@/layouts/common/BackView.vue";
import FrontView from "@/layouts/common/FrontView.vue";
import BookingSearchView from "@/views/booking/BookingSearchView.vue";
import FrontMember from "@/layouts/user/FrontMember.vue";
import RoomTypeView from "@/views/booking/RoomTypeView.vue";
import RoomView from "@/views/booking/RoomView.vue";
import { createRouter, createWebHistory } from "vue-router";
<<<<<<< HEAD
import AttractionComponent from '@/components/Attraction/AttractionComponent.vue';
=======
import BackAdmin from "@/views/user/BackAdmin.vue";
import Login from "@/views/user/Login.vue";
import Register from "@/views/user/Register.vue";
import MemberOverview from "@/views/user/MemberOverview.vue";
import MemberInfo from "@/views/user/MemberInfo.vue";
import { useAuthStore } from "@/stores/authStore";

>>>>>>> 446644746dd89df32ea5e60bec610f55d6d75ad5
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // }
    {
      path: '/login',
      name: 'login',
      component: Login
    },
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
<<<<<<< HEAD
          path: 'Attraction/AttractionType',
          name: 'attractionFront',
          component: AttractionComponent,
        },
=======
          path: '/front/member',
          name: 'memberFront',
          component: FrontMember,
          beforeEnter: async (to, from, next) => {
            const useStores = useAuthStore()
            // 检查登录状态
            if (useStores.user == null) {
              try {
                await useStores.fetchUser(); // 尝试从后端获取会话状态
                next(); // 会话有效，继续导航
              } catch (error) {
                console.error('Session invalid, redirecting to login...');
                next('/login'); // 未登录或会话无效时跳转到登录页
              }
            } else {
              if (useStores.user.userIdentity == "user") {
                next();
              } else {
                alert('管理員不能去會員中心!')
                // useStores.logout();
                next('/back');
              }
              // 已登录，继续导航
            }
          },
          children: [
            {
              path: '/front/member/Overview',
              name: 'memberOverview',
              component: MemberOverview
            },
            {
              path: '/front/member/info',
              name: 'memberInfo',
              component: MemberInfo
            },

          ]
        },
        {
          path: '/front/register',
          name: 'register',
          component: Register
        }
>>>>>>> 446644746dd89df32ea5e60bec610f55d6d75ad5
      ]
    },
    {
      path: '/back',
      name: 'back',
      component: BackView,
      beforeEnter: async (to, from, next) => {
        const useStores = useAuthStore()
        console.log(useStores.user);

        // 检查登录状态
        if (useStores.user == null) {
          try {
            await useStores.fetchUser(); // 尝试从后端获取会话状态
            next(); // 会话有效，继续导航
            console.log("session ok");

          } catch (error) {
            console.log(error);

            // console.error('Session invalid, redirecting to login...');
            next('/login'); // 未登录或会话无效时跳转到登录页
          }
        } else {
          if (useStores.user.userIdentity == "admin") {
            next();
          } else {
            alert('你不是管理員!')
            // useStores.logout();
            next('/front');
          }
          // 已登录，继续导航
        }
      },
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
        {
          path: '/memberBack',
          name: 'memberBack',
          component: BackMember
        },
        {
          path: '/adminBack',
          name: 'adminBack',
          component: BackAdmin
        },
      ]
    },
<<<<<<< HEAD
  ],
});
=======
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
  ]
})
>>>>>>> 446644746dd89df32ea5e60bec610f55d6d75ad5

export default router;
