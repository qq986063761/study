import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { federation } from '@module-federation/vite'
import type { LogLevel, RolldownLog, LogOrStringHandler } from 'rolldown'

function suppressVueUsePureAnnotationWarnings(
  level: LogLevel,
  log: RolldownLog,
  defaultHandler: LogOrStringHandler,
): void {
  const id = log.id?.replace(/\\/g, '/') ?? ''

  // 过滤日志
  if (
    log.code === 'INVALID_ANNOTATION' &&
    id.includes('node_modules/@vueuse/core/dist/index.js')
  ) {
    return
  }

  defaultHandler(level, log)
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  plugins: [
    vue(),
    vueJsx(),
    federation({
      name: 'app1',
      filename: 'remoteEntry.js',
      exposes: {
        './ajax': './src/exports/ajax.ts',
        './store': './src/exports/store.ts',
        './routes': './src/exports/routes.ts',
        './i18n': './src/exports/i18n.ts',
        './components': './src/exports/components.ts',
        './global-components': './src/exports/global-components.ts',
      },
      shared: {
        vue: { singleton: true },
        'vue-router': { singleton: true },
        pinia: { singleton: true },
        'element-plus': { singleton: true },
        'vue-i18n': { singleton: true },
        // 仅消费 main 提供的 runtime，不打包本地 fallback
        '@main/runtime': {
          name: '@main/runtime',
          import: false,
          singleton: true,
        },
      },
      dev: {
        remoteHmr: true,
      },
      dts: false,
    }),
    vueDevTools(),
  ],
  server: {
    port: 9981,
    cors: true,
    origin: 'http://localhost:9981',
  },
  preview: {
    port: 9981,
    cors: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    target: 'esnext',
    minify: false,
    rolldownOptions: {
      onLog: suppressVueUsePureAnnotationWarnings,
    },
  },
}))
