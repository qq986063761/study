import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import {
  ignoreKnownBuildWarnings,
  sharedRuntimeExternal,
  sharedRuntimePlugin,
} from '../../build/shared-runtime.mjs'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const useSharedRuntime = command === 'build' && process.env.VITE_SHARED_RUNTIME !== 'false'

  return {
    base: './',
    plugins: [
      sharedRuntimePlugin(useSharedRuntime),
      vue(),
      vueJsx(),
      vueDevTools(),
    ],
    build: {
      outDir: fileURLToPath(new URL('../../dist/web', import.meta.url)),
      emptyOutDir: true,
      rollupOptions: {
        external: useSharedRuntime ? sharedRuntimeExternal : [],
        onwarn: ignoreKnownBuildWarnings,
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
