// 📁 vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // ✅ 외부 허용
    port: 5173,
    historyApiFallback: true,
    allowedHosts: ['kiosktest.shop'], // ✅ 추가: 도메인 허용
    proxy: {
      '/login': {
        target: 'http://kiosktest.shop:8081',
        changeOrigin: true,
        secure: false,
      },
      '/logout': {
        target: 'http://kiosktest.shop:8081',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://kiosktest.shop:8081',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
