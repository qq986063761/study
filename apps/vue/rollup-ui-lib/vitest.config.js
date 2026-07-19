import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import path from 'path'

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      include: ['src/components/**/*.vue'], // 只计算这些文件的覆盖率
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    // 解决 Vue2 相关问题
    // setupFiles: './test/setup.js'
  }
})