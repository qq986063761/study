# 资源
- [官网](https://vitejs.cn/)

# Vite
- 面向现代浏览器的前端构建工具，核心体验是开发环境启动快、热更新快，生产环境仍然做完整打包优化。
- 开发环境基于浏览器原生 ESM，源码按需编译；生产构建默认基于 Rollup，负责最终 bundle、压缩、代码拆分等。
- 常用于 Vue、React、Svelte 等 SPA，也可以作为组件库、SSR 框架的底层构建能力。

# 为什么快
- 开发启动不需要先把整个项目打成 bundle，浏览器请求到哪个模块，Vite 再转换哪个模块。
- 依赖预构建使用 esbuild，把 CommonJS / UMD 依赖预先转成 ESM，并缓存到 `node_modules/.vite`。
- HMR 以模块为边界更新，改一个组件通常只重新加载相关模块，不需要整页刷新。
- esbuild 使用 Go 编写，做 TS / JSX 转换和依赖预构建速度很快，但类型检查需要交给 `tsc` 或 `vue-tsc`。

# Vite 和 Webpack 区别
- Webpack 开发环境通常先构建依赖图并产出 bundle；Vite 开发环境利用原生 ESM 按需加载源码模块。
- Vite 生产构建默认用 Rollup，所以生产阶段仍然会做 Tree Shaking、Code Splitting、资源 hash、压缩等优化。
- Vite 插件兼容 Rollup 插件模型，但开发服务器有自己的中间件、模块解析和 HMR 机制。

# 常见配置
```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/app/',
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

# Tree Shaking
- Vite 生产构建通过 Rollup 做 Tree Shaking，依赖 ESM 的静态结构分析未使用导出。
- 前提是代码尽量使用 ESM，避免模块顶层副作用；第三方包可通过 `package.json` 的 `sideEffects` 辅助标记。
- Tree Shaking 只能删除“静态可判断的无用代码”，动态 `require`、全局副作用、运行时拼接导入路径都会降低效果。

# Code Splitting 和懒加载
- 路由、弹窗、富文本编辑器、图表库等较重模块适合用动态导入：
```js
const Editor = () => import('./Editor.vue')
```
- 动态 `import()` 会在生产构建中拆成独立 chunk，访问到对应功能时再加载。
- 可以通过 `build.rollupOptions.output.manualChunks` 手动拆分公共库，例如把 `vue`、图表库拆到独立 chunk。
- 拆分不是越细越好，chunk 太多会增加请求数量和调度成本，需要结合首屏体积、缓存命中率分析。

# Source Map
- 开发环境默认便于调试；生产环境可通过 `build.sourcemap` 控制是否生成。
- `sourcemap: true` 便于线上错误定位，但不建议直接公开给所有用户，可配合监控平台上传后删除。
- `sourcemap: 'hidden'` 可以生成 map 但不在产物里写 `sourceMappingURL`，更适合线上错误平台解析。

# 环境变量管理
- Vite 会按模式加载 `.env`、`.env.local`、`.env.[mode]`、`.env.[mode].local`。
- 只有以 `VITE_` 开头的变量会暴露给浏览器代码：
```env
VITE_API_BASE=/api
```
```js
const apiBase = import.meta.env.VITE_API_BASE
```
- 内置变量包括 `import.meta.env.MODE`、`DEV`、`PROD`、`BASE_URL`。
- 服务端或配置文件里可用 `loadEnv(mode, process.cwd(), '')` 主动读取变量，但要避免把密钥暴露到客户端。

# 面试常问
- Vite 开发快：原生 ESM 按需编译 + esbuild 预构建 + 模块级 HMR。
- Vite 生产构建为什么还要打包：浏览器原生 ESM 不等于最优交付，生产仍需要合并、压缩、hash、Tree Shaking 和兼容处理。
- Vite 是否完全替代 Webpack：新项目常用 Vite，但复杂历史项目、深度 loader/plugin 生态、特殊构建链路仍可能保留 Webpack。
