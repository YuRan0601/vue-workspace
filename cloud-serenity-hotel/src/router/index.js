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
                    path: '/front/bookingHome',
                    name: 'bookingHome',
                    component: BookingHome,
                    children: [
                        {
                            path: '/bookingSearch',
                            name: 'bookingSearch',
                            component: BookingSearchView,
                        }
                    ]
                },
                {
                    path: '/front/booking/roomType',
                    name: 'roomFront',
                    component: RoomFront,
                },
                {
                    path: '/front/member',
                    name: 'memberFront',
                    component: FrontMember,
                    beforeEnter: async (to, from, next) => {


                        const useStores = useAuthStore()
                        useStores.fetchUser();
                        // 檢查登入狀態
                        if (useStores.user == null) {
                            try {
                                await useStores.fetchUser(); // 從後端取得使用者資料
                                next();
                            } catch (error) {
                                console.log(error);
                                next('/login'); // 無法取得資料 屬於未登入 則引導到登入頁面
                            }
                        } else { //已登入 則判斷身分 限制存取的頁面
                            if (useStores.user.userIdentity == "user") {
                                next();
                            } else {
                                alert('管理員不能去會員中心!')
                                // useStores.logout();
                                next('/back');
                            }
                        }
                    },
                    children: [
                        {
                            path: '/front/member/Overview',
                            name: 'memberOverview',
                            component: MemberOverview
                        },
                        {
                            path: '/front/member/Info',
                            name: 'memberInfo',
                            component: MemberInfo
                        },
                        {
                            path: '/front/member/Account',
                            name: 'memberAccount',
                            component: MemberAccount
                        },

                    ]
                },
                {
                    path: '/front/register',
                    name: 'register',
                    component: Register
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
            beforeEnter: async (to, from, next) => {

                const useStores = useAuthStore()

                useStores.fetchUser();
                console.log(useStores.user);

                // 檢查登入狀態
                if (useStores.user == null) {
                    try {
                        await useStores.fetchUser(); // 從後端取得使用者資料
                        next();

                    } catch (error) {
                        console.log(error);
                        next('/login'); // 無法取得資料 屬於未登入 則引導到登入頁面
                    }
                } else { //已登入 則判斷身分 限制存取的頁面
                    if (useStores.user.userIdentity == "admin") {
                        next();
                    } else {
                        alert('你不是管理員!')
                        // useStores.logout();
                        next('/front');
                    }
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
                    path: '/productBack',
                    name: 'productBack',
                    component: ProductBack,
                    children: [
                        {
                            path: '/ProductAll',
                            name: 'ProductAll',
                            component: ProductHome
                        }
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
                {
                    path: '/rent/carHome', name: 'carHome', component: CarHome,
                    children: [
                        { path: '/rent/carType', name: 'carType', component: CarTypeView }
                    ]
                },
                {
                    path: '/rent/modelOperate/:id', name: 'modelOperate', component: ModelOperate, props: true,
                    children: [
                        { path: '/rent/carInfo/:id', name: 'carInfo', component: CarInfo, props: true },
                        { path: 'carImage/:id', name: 'carImage', component: CarImage, props: true }
                    ]
                },
                {
                    path: '/rent/VehicleDetails', name: 'vehicleDetails', component: VehicleDetails,
                    children: [
                        { path: '/rent/VehicleList', name: 'vehicleList', component: VehicleList }
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
                        component: OrderEditView,
                        props: (route) => ({ orderId: route.query.orderId }), // 將 query 作為 props 傳入
                      },
                      {
                        path: '/order/orderadd',
                        name: 'orderadd',
                        component: OrderAddView,
                      }
                    ]
                  }
            ]
        },
    ]
})

export default router;