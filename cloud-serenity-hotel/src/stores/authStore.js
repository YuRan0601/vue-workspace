import { defineStore } from 'pinia';
import axios from '../axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null, // 当前登录用户
    }),

    actions: {
        // 登录
        async login(loginData) {
            // console.log(loginData.value);

            try {
                let { data } = await axios.post('/user/checklogin', loginData.value);
                // console.log(data);

                await this.fetchUser(); // 登录成功后获取用户信息
                return data;
            } catch (error) {
                console.error('Login failed:', error);
                return error;
            }
        },

        // 获取当前用户信息
        async fetchUser() {
            try {
                const response = await axios.get('/user/getUser'); // 从后端获取用户信息
                this.user = response.data;
                // console.log(response.data);

            } catch (error) {
                console.error('Fetch user failed:', error);
                this.user = null;
                throw error;
            }
        },

        // 登出
        async logout() {
            try {
                console.log("logout");

                await axios.get('/user/logout'); // 通知后端销毁会话
            } catch (error) {
                console.error('Logout failed:', error);
            } finally {
                this.user = null; // 清空本地用户状态
            }
        },

        // 检查会话状态
        async checkSession() {
            try {
                await this.fetchUser(); // 尝试从后端获取用户信息
            } catch (error) {
                console.error('Session check failed:', error);
                console.log('session fail');

                this.logout(); // 会话失效，清空状态
            }
        },

        async checkMember() {
            const router = useRouter();
            try {
                await this.fetchUser(); // 尝试从后端获取用户信息

                if (this.user.userIdentity === "admin") {
                    alert("此部分只能由會員操作，請重新登入!")
                    this.logout();
                    router.push("/login");
                }
            } catch (error) {
                console.error('Session check failed:', error);
                console.log('session fail');

                this.logout(); // 会话失效，清空状态

                router.push("/login");
            }
        },

        async checkAdmin() {
            const router = useRouter();
            try {
                await this.fetchUser(); // 尝试从后端获取用户信息

                if (this.user.userIdentity === "user") {
                    alert("此部分只能由管理員操作，請重新登入!")
                    this.logout();
                    router.push("/login");
                }
            } catch (error) {
                console.error('Session check failed:', error);
                console.log('session fail');

                this.logout(); // 会话失效，清空状态

                router.push("/login");
            }
        },
    },

    persist: {
        storage: localStorage, // 持久化到 localStorage
    },
});