import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/CloudSerenityHotel', // 后端 API 的基础 URL
    withCredentials: true, // 确保跨域请求时发送 Cookie
});

// 添加响应拦截器，处理未授权错误
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // 触发自动登出逻辑
            const authStore = useAuthStore();
            authStore.logout(); // 自动清除本地状态
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;