import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import eslint from 'vite-plugin-eslint'

const isAnalyze = process.env.VITE_ANALYZE === 'true'

export default defineConfig({
  plugins: [
    vue(),
    eslint({
      exclude: ['node_modules/**', 'dist/**'],
      cache: false,
      // fix: true  // 添加这行来自动修复
    }),
    isAnalyze && visualizer({
      // open: true,      // 构建完成后自动打开分析页面
      gzipSize: true,  // 显示 gzip 压缩后的体积
      brotliSize: true // 显示 brotli 压缩后的体积
    })
  ], 
  resolve: {
    alias: {
      // 设置路径别名
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 全局 SCSS 变量和混入
        additionalData: `@use "@/css/theme.scss" as *;@use "@/css/mixin.scss" as *;`
      }
    },
    // 提取 CSS 到单独文件
    extract: true
  },
  build: {
    // assetsInlineLimit: 0, // 完全禁用 Base64 内联
    lib: {
      // 组件库的入口文件
      entry: resolve(__dirname, 'src/index.js'),
      name: 'MyUi', // 全局变量名
      fileName: 'my-ui', // (format, entryName) => `my-ui.${format}.js`, // -${entryName}
      // cssFileName: 'my-ui-style',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        },
        // assetFileNames: (assetInfo) => {
        //   if (/\.(png|jpe?g|gif|svg)$/.test(assetInfo.name)) {
        //     return 'images/[name]-[hash][ext]'; // 输出到 dist/images/
        //   }
        //   if (/\.(woff|woff2|ttf)$/.test(assetInfo.name)) {
        //     return 'fonts/[name]-[hash][ext]'; // 输出到 dist/fonts/
        //   }
        //   return 'assets/[name]-[hash][ext]'; // 默认输出到 dist/assets/
        // }
      }
    },
    // 构建时清空输出目录
    emptyOutDir: true
  },
})