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
import BookingSuccessVue from "@/views/booking/BookingSuccess.vue";
import BookingOrderTableViewVue from "@/views/booking/BookingOrderTableView.vue";
import CarRentalHome from "@/layouts/rent/CarRentalHome.vue";
import HeroSection from "@/components/rent/HeroSection.vue";
import ReserveCarButton from "@/components/rent/ReserveCarButton.vue";
import ModelSelector from "@/views/rent/ModelSelector.vue";
import ProductShopping from "@/views/product/ProductShopping.vue";
import ProductDetail from "@/views/product/ProductDetail.vue";
import bookingOrderMemberViewVue from "@/views/booking/BookingOrderMemberView.vue";
import ModelDetail from "@/views/rent/ModelDetail.vue";
import CarModelSearch from "@/layouts/rent/CarModelSearch.vue";
import CarReservation from "@/views/rent/CarReservation.vue";
import RentalForm from "@/layouts/rent/RentalForm.vue";
import MemberOrder from "@/views/order/MemberOrder.vue";
import MemberOrderDetail from "@/views/order/MemberOrderDetail.vue";
import ShuangxiPark from "@/components/Attraction/ShuangxiPark.vue";
import ScienceMuseum from "@/components/Attraction/ScienceMuseum.vue";
import AstronomyMuseum from "@/components/Attraction/AstronomyMuseum.vue";
import ChildrensAmusementPark from "@/components/Attraction/ChildrensAmusementPark.vue";
import ShilinResidence from "@/components/Attraction/ShilinResidence.vue";
import IndigenousCulturePark from "@/components/Attraction/IndigenousCulturePark.vue";
import MiramarFerrisWheel from "@/components/Attraction/MiramarFerrisWheel.vue";
import BihuPark from "@/components/Attraction/BihuPark.vue";
import TravelerComponent from "@/components/Attraction/TravelerComponent.vue";
import about from "@/components/Attraction/about.vue";
import BookingOrderPaySuccessVue from "@/views/booking/BookingOrderPaySuccess.vue";
import BookingOrderPayFailVue from "@/views/booking/BookingOrderPayFail.vue";
import Headerbar from "@/layouts/product/Headerbar.vue";
import indexVue from "@/views/common/index.vue";
import BookingRoomTypeViewVue from "@/views/booking/BookingRoomTypeView.vue";
import OneRoomTypeVue from "@/views/booking/OneRoomType.vue";
import ProductCart from "@/views/order/ProductCart.vue";
import ChartVue from "@/views/common/Chart.vue";
import ProductRecipient from "@/views/order/ProductRecipient.vue";
import ProductCheckout from "@/views/order/ProductCheckout.vue";
import ProductEdit from "@/views/product/ProductEdit.vue";
import CarRentalHistory from "@/views/rent/CarRentalHistory.vue";
import CarReservationDetail from "@/views/rent/CarReservationDetail.vue";
import ForgotPassword from "@/views/user/ForgotPassword.vue";
import ResetPassword from "@/views/user/ResetPassword.vue";
import CartToOrderSuccess from "@/views/order/CartToOrderSuccess.vue";

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
        {
          path: "/",
          name: "index",
          component: indexVue,
        },
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
            },
            {
              path: "/bookingSuccess",
              name: "bookingSuccess",
              component: BookingSuccessVue,
            },
            {
              path: "/booking/paySuccess",
              name: "bookingPaySuccess",
              component: BookingOrderPaySuccessVue,
            },
            {
              path: "/booking/payFail",
              name: "bookingPayFail",
              component: BookingOrderPayFailVue,
            },
          ],
        },
        {
          path: "/front/booking/bookingRoomType",
          name: "bookingRoomType",
          component: BookingRoomTypeViewVue,
          children: [
            {
              path: "/front/oneRoomType/:id",
              name: "oneRoomType",
              component: OneRoomTypeVue,
              // 使用函數處理傳入的參數，這裡將 id 轉成 Number
              props: (route) => ({ id: Number(route.params.id) }),
            },
          ],
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
                next("/back/chart");
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
            {
              path: "/front/member/bookingOrder",
              name: "memberBookingOrder",
              component: bookingOrderMemberViewVue,
            },
            {
              path: "/front/member/Order",
              name: "memberOrder",
              component: MemberOrder,
            },
            {
              path: "/front/member/OrderDetail",
              name: "memberOrderDetail",
              component: MemberOrderDetail,
            },
          ],
        },
        {
          path: "/front/register",
          name: "register",
          component: Register,
        },
        {
            path: "/front/forgotPassword",
            name: "forgotPassword",
            component: ForgotPassword,
        },
        {
          path: "/front/resetPassword",
          name: "resetPassword",
          component: ResetPassword,
        },
        //-------------

        //---景點前台---
        {
          path: "Attraction/AttractionType",
          name: "attractionFront",
          component: AttractionComponent,
        },
        { path: "/attraction/雙溪公園", component: ShuangxiPark },
        { path: "/attraction/士林科教館", component: ScienceMuseum },
        { path: "/attraction/台北市立天文館", component: AstronomyMuseum },
        {
          path: "/attraction/台北兒童新樂園",
          component: ChildrensAmusementPark,
        },
        { path: "/attraction/士林官邸", component: ShilinResidence },
        {
          path: "/attraction/原住民文化主題公園",
          component: IndigenousCulturePark,
        },
        { path: "/attraction/美麗華摩天輪", component: MiramarFerrisWheel },
        { path: "/attraction/內湖碧湖公園", component: BihuPark },
        { path: "/attraction/TravelerComponent", component: TravelerComponent },
        { path: "/attraction/about", component: about },


        //-------------

        //---商品前台---
        {
          path: "/front/product",
          name: "productShoppingHome",
          component: Headerbar,
          children: [
            {
              path: "shopping",
              name: "productShopping",
              component: ProductShopping,
            },
            {
              path: ":id",
              name: "productDetail",
              component: ProductDetail,
            },
            {
              path: "/front/product/cart",
              name: "productCart",
              component: ProductCart,
            },
            {
              path: "/front/product/recipient",
              name: "productRecipient",
              component: ProductRecipient,
            },
            {
              path: "/front/product/checkout",
              name: "productCheckout",
              component: ProductCheckout,
            },
            //購物車成功轉成訂單畫面
            {
              path: "/front/product/cartToOrderSuccess",
              name: "cartToOrderSuccess",
              component: CartToOrderSuccess,
            }
          ],
        },

        //-------------

        //---訂單前台---

        //--------------

        //---租車前台---
        {
          path: "/front/CarRentalHome",
          name: "CarRentalHome",
          component: CarRentalHome,
          children: [
            {
              path: "/HeroSection",
              name: "HeroSection",
              component: HeroSection,
            },
            {
              path: "/ReserveCarButton",
              name: "ReserveCarButton",
              component: ReserveCarButton,
            },
            {
              path: "/ModelSelector",
              name: "ModelSelector",
              component: ModelSelector,
            },
          ],
        },
        {
          path: "/rent/CarModelSearch/:id",
          name: "CarModelSearch",
          component: CarModelSearch,
          props: true,
          children: [
            {
              path: "ImageModelDetail/:id",
              name: "ImageModelDetail",
              component: CarImage,
              props: true,
            },
            {
              path: "ModelDetail/:id",
              name: "ModelDetail",
              component: ModelDetail,
              props: true,
            },
          ],
        },
        {
          path: "/rent/RentalForm/:id",
          name: "RentalForm",
          component: RentalForm, //表單父組件
          props: true,
          children: [
            {
              path: "CarReservation/:id",
              name: "CarReservation",
              component: CarReservation, //選擇車型視圖
              props: true,
            },
          ],
        },

        //---------------
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
            next("/");
          }
        }
      },
      children: [
        //---數據---
        {
          path: "/back/chart",
          component: ChartVue,
          name: "chart",
        },
        //----------
        //---訂房後台---
        {
          path: "/back/bookingBack",
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
        {
          path: "/back/booking/order",
          name: "bookingOrderTable",
          component: BookingOrderTableViewVue,
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
        {
          path: "/productEdit/:id",
          component: ProductEdit,
          name: "productEdit",
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
        },
        {
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
            },
            {
              path: "CarDetails/:id/:carId",
              name: "CarDetails",
              component: CarDetails,
              props: true,
            },
          ],
        },
        {
          path: "/rent/CarRentalHistory",
          name: "CarRentalHistory",
          component: CarRentalHistory,
        },
        {
          path: "/rent/CarReservationDetail/:id",
          name: "CarReservationDetail",
          component: CarReservationDetail,
          props: true,
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
              component: OrderAddView,
              props: true,
            },
          ],
        },
        //-------------

        //---景點後台---

        //-------------
      ],
    },
  ],
});

export default router;
