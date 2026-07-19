import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import config from '../vite.config'
import eslint from 'vite-plugin-eslint'

// console.log('NODE_ENV', process.env.NODE_ENV) // production

export default defineConfig({
  base: './',
  plugins: [
    vue2(),
    eslint({
      exclude: ['node_modules/**', 'dist/**'],
      cache: false,
      // fix: true  // 添加这行来自动修复
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'My UI Library Demo',
          // injectScript: `<script src="./main.js"></script>`
        }
      }
    })
  ],
  resolve: {
    // 别名，用于内部路径解析
    alias: {
      ...config.resolve.alias,
      'my-ui': path.resolve(__dirname, '../src')
    }
  },
  css: {
    preprocessorOptions: config.css.preprocessorOptions
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: { 
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
})