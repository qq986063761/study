import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  return {
    plugins: [
      vue(),
      vueJsx(),
      // lib 模式不需要 devtools
      ...(isLib ? [] : [vueDevTools()]),
    ],
    base: './',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // 开发模式：demo 预览
    server: {
      port: 5173,
      open: true,
    },
    build: isLib
      ? {
          // 库模式输出到 lib/
          outDir: 'lib',
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ViteVue3UiLib',
            formats: ['es', 'umd'],
            fileName: (format) => `vite-vue3-ui-lib.${format}.js`,
          },
          cssCodeSplit: false,
          sourcemap: true,
          rollupOptions: {
            external: ['vue', 'vue-router'],
            output: {
              globals: {
                vue: 'Vue',
                'vue-router': 'VueRouter',
              },
              assetFileNames: (assetInfo) => {
                if (assetInfo.names?.includes('style.css')) return 'vite-vue3-ui-lib.css'
                return assetInfo.names?.[0] ?? '[name].[ext]'
              },
            },
          },
        }
      : {
          // 普通构建输出到 dist/（demo 构建）
          outDir: 'dist',
        },
  }
})
