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

  if (
    log.code === 'INVALID_ANNOTATION' &&
    id.includes('node_modules/@vueuse/core/dist/index.js')
  ) {
    return
  }

  defaultHandler(level, log)
}

// 占位 entry：编译期 Vite 插件只需要此值生成 registerRemotes 代码。
// 实际运行时 entry URL 由 federation-runtime-plugin.ts 的 beforeRegisterRemote
// 钩子动态解析（支持 appenv query、window.__REMOTE_CONFIG__ 等）。
function getRemoteEntry(name: string): string {
  return `./${name}/remoteEntry.js`
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueJsx(),
    federation({
      name: 'main',
      remotes: {
        app1: {
          type: 'module',
          name: 'app1',
          entry: getRemoteEntry('app1'),
          entryGlobalName: 'app1',
          shareScope: 'default',
        },
        app2: {
          type: 'module',
          name: 'app2',
          entry: getRemoteEntry('app2'),
          entryGlobalName: 'app2',
          shareScope: 'default',
        },
      },
      filename: 'remoteEntry.js',
      shared: {
        vue: { singleton: true },
        'vue-router': { singleton: true },
        pinia: { singleton: true },
        'element-plus': { singleton: true },
        'vue-i18n': { singleton: true },
        '@main/runtime': {
          // main 作为 runtime 唯一 provider，将本地模块注入 share scope
          // name 即 share scope 协商键（vite 插件无 shareKey 字段）
          name: '@main/runtime',
          import: fileURLToPath(new URL('./src/runtime/index.ts', import.meta.url)),
          singleton: true,
          version: '1.0.0',
        },
      },
      shareStrategy: 'loaded-first',
      // 运行时动态 remote 解析插件：通过 beforeRegisterRemote 钩子
      // 根据 appenv query 参数 / window.__REMOTE_CONFIG__ 动态修改 entry URL
      runtimePlugins: ['./src/federation-runtime-plugin.ts'],
      dev: {
        remoteHmr: true,
      },
      dts: false,
    }),
    vueDevTools(),
  ],
  server: {
    port: 9980,
    origin: 'http://localhost:9980',
  },
  preview: {
    port: 9980,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 供主应用本地 import('@main/runtime') 与 shared provider 对齐
      '@main/runtime': fileURLToPath(new URL('./src/runtime/index.ts', import.meta.url)),
    },
  },
  // 本地源码别名不要进 dep prebundle：
  // 1) 会把 runtime 及依赖打成独立副本，与 /src 源码双实例（vueApp 注入失效）
  // 2) 旧版还会顺带打进 router/HomeView 引发 TDZ
  optimizeDeps: {
    exclude: ['@main/runtime'],
  },
  build: {
    target: 'esnext',
    rolldownOptions: {
      onLog: suppressVueUsePureAnnotationWarnings,
    },
  },
})
