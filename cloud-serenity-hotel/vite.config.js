import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 将 /api 的请求代理到目标服务器
      '/api': {
        target: 'http://localhost:8080/CloudSerenityHotel', // 替换为你的目标 API 地址
        changeOrigin: true, // 是否需要更改请求头中的 Host 字段
        rewrite: (path) => path.replace(/^\/api/, ''), // 可选：重写路径
      },
    },
  },
})
