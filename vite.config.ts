import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/funPage/', // 必须和仓库名一致
  plugins: [vue()],
})
