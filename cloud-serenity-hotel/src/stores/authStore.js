import { defineStore } from 'pinia';
import axios from '../axios';

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
            }
        },

        // 登出
        async logout() {
            try {
                console.log("logout");

                await axios.post('/user/logout'); // 通知后端销毁会话
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
                this.logout(); // 会话失效，清空状态
            }
        },
    },

    persist: {
        storage: localStorage, // 持久化到 localStorage
    },
});