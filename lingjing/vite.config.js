import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' 用相对路径打包, 这样无论仓库名是什么,
// 部署到 用户名.github.io/仓库名/ 都能正确加载资源, 无需改动。
export default defineConfig({
  base: './',
  plugins: [react()],
});
