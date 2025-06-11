import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // Lắng nghe trên tất cả các giao diện
    port: 3000,// Cổng cố định cho môi trường phát triển
    historyApiFallback: true,
    allowedHosts: [
      'localhost',
      'exe-frontend-yk6z.onrender.com' // Thêm host của Render
    ]
  },
  build: {
    outDir: 'dist', // Thư mục đầu ra cho file tĩnh
    sourcemap: false // Tắt sourcemap trong production để tối ưu
  }
});
