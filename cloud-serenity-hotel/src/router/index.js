import BookingBack from "@/layouts/booking/BookingBack.vue";
import BackMember from "@/views/user/BackMember.vue";
import ProductBack from "@/components/product/ProductBack.vue";
import CarImage from "@/components/rent/CarImage.vue";
import OrderBack from "@/components/order/OrderBack.vue";
import BookingHome from "@/layouts/booking/BookingHome.vue";
import RoomFront from "@/layouts/booking/RoomFront.vue";
import BackView from "@/layouts/common/BackView.vue";
import FrontView from "@/layouts/common/FrontView.vue";
import BookingSearchView from "@/views/booking/BookingSearchView.vue";
import FrontMember from "@/layouts/user/FrontMember.vue";
import RoomTypeView from "@/views/booking/RoomTypeView.vue";
import RoomView from "@/views/booking/RoomView.vue";
import ProductAdd from "@/views/product/ProductAdd.vue";
import ProductHome from "@/views/product/ProductHome.vue";
import CarHome from "@/layouts/rent/CarHome.vue";
import ModelOperate from "@/layouts/rent/modelOperate.vue";
import VehicleDetails from "@/layouts/rent/VehicleDetails.vue";
import CarInfo from "@/views/rent/CarInfo.vue";
import CarTypeView from "@/views/rent/CarTypeView.vue";
import VehicleList from "@/views/rent/VehicleList.vue";
import OrderAddView from "@/views/order/OrderAddView.vue";
import OrderDetailView from "@/views/order/OrderDetailView.vue";
import OrderEditView from "@/views/order/OrderEditView.vue";
import OrderListView from "@/views/order/OrderListView.vue";
import { createRouter, createWebHistory } from "vue-router";
import BackAdmin from "@/views/user/BackAdmin.vue";
import Login from "@/views/user/Login.vue";
import Register from "@/views/user/Register.vue";
import MemberOverview from "@/views/user/MemberOverview.vue";
import MemberInfo from "@/views/user/MemberInfo.vue";
import { useAuthStore } from "@/stores/authStore";
import MemberAccount from "@/views/user/MemberAccount.vue";
import AttractionComponent from "@/components/Attraction/AttractionComponent.vue";
import BookingOrderView from "@/views/booking/BookingOrderView.vue";
import DetailsOperate from "@/layouts/rent/detailsOperate.vue";
import CarDetails from "@/views/rent/CarDetails.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // }

    //最外層：登入頁
    {
      path: "/login",
      name: "login",
      component: Login,
    },

    //最外層：前台頁
    {
      path: "/front",
      name: "front",
      component: FrontView,
      children: [

        //---訂房前台---
        {
          path: "/front/bookingHome",
          name: "bookingHome",
          component: BookingHome,
          children: [
            {
              path: "/bookingSearch",
              name: "bookingSearch",
              component: BookingSearchView,
            },
            {
              path: "/bookingOrder",
              name: "bookingOrder",
              component: BookingOrderView,
            }
          ],
        },
        {
          path: "/front/booking/roomType",
          name: "roomFront",
          component: RoomFront,
        },
        //-------------

        //---會員前台---
        {
          path: "/front/member",
          name: "memberFront",
          component: FrontMember,
          beforeEnter: async (to, from, next) => {
            const useStores = useAuthStore();
            useStores.fetchUser();
            // 檢查登入狀態
            if (useStores.user == null) {
              try {
                await useStores.fetchUser(); // 從後端取得使用者資料
                next();
              } catch (error) {
                console.log(error);
                next("/login"); // 無法取得資料 屬於未登入 則引導到登入頁面
              }
            } else {
              //已登入 則判斷身分 限制存取的頁面
              if (useStores.user.userIdentity == "user") {
                next();
              } else {
                alert("管理員不能去會員中心!");
                // useStores.logout();
                next("/back");
              }
            }
          },
          children: [
            {
              path: "/front/member/Overview",
              name: "memberOverview",
              component: MemberOverview,
            },
            {
              path: "/front/member/Info",
              name: "memberInfo",
              component: MemberInfo,
            },
            {
              path: "/front/member/Account",
              name: "memberAccount",
              component: MemberAccount,
            },
          ],
        },
        {
          path: "/front/register",
          name: "register",
          component: Register,
        },
        //-------------

        //---景點前台---
        {
          path: "Attraction/AttractionType",
          name: "attractionFront",
          component: AttractionComponent,
        },
        //-------------

      ],
    },

    //最外層：後台頁
    {
      path: "/back",
      name: "back",
      component: BackView,
      beforeEnter: async (to, from, next) => {
        const useStores = useAuthStore();

        useStores.fetchUser();
        console.log(useStores.user);

        // 檢查登入狀態
        if (useStores.user == null) {
          try {
            await useStores.fetchUser(); // 從後端取得使用者資料
            next();
          } catch (error) {
            console.log(error);
            next("/login"); // 無法取得資料 屬於未登入 則引導到登入頁面
          }
        } else {
          //已登入 則判斷身分 限制存取的頁面
          if (useStores.user.userIdentity == "admin") {
            next();
          } else {
            alert("你不是管理員!");
            // useStores.logout();
            next("/front");
          }
        }
      },
      children: [

        //---訂房後台---
        {
          path: "/bookingBack",
          name: "bookingBack",
          component: BookingBack,
          children: [
            {
              path: "/back/booking/roomType",
              name: "roomType",
              component: RoomTypeView,
            },
            {
              path: "/back/booking/room",
              name: "room",
              component: RoomView,
            },
          ],
        },
        //-------------


        //---商品後台---
        {
          path: "/productBack",
          name: "productBack",
          component: ProductBack,
          children: [
            {
              path: "/productAll",
              name: "productAll",
              component: ProductHome,
            },
          ],
        },
        {
          path: "/productAdd",
          component: ProductAdd,
          name: "productAdd",
        },
        //-------------


        //---會員後台---
        {
          path: "/memberBack",
          name: "memberBack",
          component: BackMember,
        },
        {
          path: "/adminBack",
          name: "adminBack",
          component: BackAdmin,
        },
        //-------------


        //---租車後台---
        {
          path: "/rent/carHome",
          name: "carHome",
          component: CarHome,
          children: [
            { path: "/rent/carType", name: "carType", component: CarTypeView },
          ],
        },
        {
          path: "/rent/modelOperate/:id",
          name: "modelOperate",
          component: ModelOperate,
          props: true,
          children: [
            {
              path: "/rent/carInfo/:id",
              name: "carInfo",
              component: CarInfo,
              props: true,
            },
            {
              path: "carImage/:id",
              name: "carImage",
              component: CarImage,
              props: true,
            },
          ],
        },
        {
          path: "/rent/VehicleDetails",
          name: "vehicleDetails",
          component: VehicleDetails,
          children: [
            {
              path: "/rent/VehicleList",
              name: "vehicleList",
              component: VehicleList,
            },
          ],
        }, {
          path: "/rent/DetailsOperate/:id/:carId",
          name: "DetailsOperate",
          component: DetailsOperate,
          props: true,
          children: [
            {
              path: "carImage/:id",
              name: "carImageDetails",
              component: CarImage,
              props: true,
            }
            ,
            {
              path: "CarDetails/:id/:carId",
              name: "CarDetails",
              component: CarDetails,
              props: true,
            },
          ],
        },
        //-------------

        //---訂單後台---
        {
          path: "/orderBack",
          name: "orderBack",
          component: OrderBack, // 訂單後台的主組件
          redirect: "/order/orderList", // 自動跳轉到 OrderListView
          children: [
            {
              path: "/order/orderList",
              name: "orderList",
              component: OrderListView,
              props: true,
            },
            {
              path: "/order/orderdetail/:orderId",
              name: "orderdetail",
              component: OrderDetailView,
              props: true,
            },
            {
              path: "/order/orderedit/:orderId",
              name: "orderedit",
              component: OrderEditView,
              props: true,
            },
            {
              path: "/order/orderadd",
              name: "orderadd",
              props: true,
            },
          ],
        },
        //-------------

      ],
    },
  ],
});

export default router;
