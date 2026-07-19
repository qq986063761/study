# 资源
- [官网](https://vitejs.cn/)

# Vite 是什么
- Vite 是一个前端构建工具，作用就是帮你把项目“跑起来、打包、优化”。
- 它的特点很简单：开发时很快，改完代码后基本能马上看到效果。
- 你可以把它理解成一个“更轻、更快的打包工具”。

# 为什么开发时这么快
- 开发时它不用一开始就把整个项目打成一个大包。
- 你访问哪个模块，它就先处理哪个模块。
- 代码改了以后，通常只更新相关部分，不需要整页刷新。
- 它会先把依赖预处理好，后面加载更快。
- 这些优化让它在开发体验上比传统打包工具更舒服。

# Vite 和 Webpack 的区别
- Webpack 更像“先把东西都准备好再给你看”。
- Vite 更像“你要什么，我就先给你什么”。
- 所以开发阶段 Vite 通常更快。
- 但生产环境它也会做打包、压缩、拆包、Tree Shaking 等优化。

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
- 这个词可以简单理解为“只打包真正用到的代码”。
- 如果一个文件里有很多函数，但你只用了其中一个，其他没用到的就不会被打进最终产物。
- 这能减少文件体积，提升加载速度。

# Code Splitting 和懒加载
- 有些模块很重，比如富文本编辑器、图表、弹窗等，不适合一上来就全部加载。
- 可以把它们拆成单独的小块，用户真正需要时再加载。
- 这就是懒加载的思想。

```js
const Editor = () => import('./Editor.vue')
```

# Source Map
- Source Map 就是“压缩后的代码和源码之间的对照表”。
- 出错时你能更容易定位到具体是哪一行代码。
- 开发环境下很有用，生产环境要谨慎使用，避免把源码信息暴露出去。

# 环境变量管理
- Vite 会根据不同环境读取 `.env` 文件。
- 例如开发环境、测试环境、生产环境可以用不同配置。
- 只有以 `VITE_` 开头的变量才会暴露给前端代码。

```env
VITE_API_BASE=/api
```

```js
const apiBase = import.meta.env.VITE_API_BASE
```

# 面试常问
- Vite 为什么快：因为它用原生 ESM 按需加载、依赖预构建更快、模块级热更新更高效。
- 生产环境为什么还要打包：因为浏览器直接加载原生模块也不是最优方案，仍然需要做压缩、拆包、缓存和兼容处理。
- Vite 能不能完全替代 Webpack：新项目一般优先用 Vite，但一些老项目或者特殊构建场景，Webpack 仍然有价值。
