# 资源
- [官网中文](https://webpack.docschina.org/)
- [portfinder](https://www.npmjs.com/package/portfinder)

# Webpack 是什么
- Webpack 是一个“把项目里的各种文件打包成浏览器能运行的资源”的工具。
- 你写的 JS、CSS、图片、字体、Vue 组件都可以被它当成模块处理。
- 它的作用不是单纯“转码”，而是把整个项目组织成一个可以运行的产物。

# 它解决了什么问题
- 以前的模块化方式不够方便，Webpack 让我们可以把项目拆成多个模块，再按规则打包。
- 它可以把代码拆成更小的块，首屏加载更快。
- 还可以把样式、图片、第三方库等都纳入统一处理流程。

# Webpack 的特点
- 模块打包：把多个文件按依赖关系组织起来。
- Loader：把不同类型的文件转换成 Webpack 能处理的模块，比如 TS、CSS、图片。
- Plugin：在打包过程的不同阶段插入逻辑，比如生成 HTML、清理目录、压缩文件。
- 热更新：代码改了以后，浏览器不用整页刷新，尽量只更新变化的部分。

# 常见命令参数
- `webpack`：正常打包
- `--config`：指定配置文件
- `--mode development|production`：切换开发/生产模式
- `--watch`：监听文件变化自动重新打包
- `--color`：输出带颜色，方便看日志

# 热更新原理
- `webpack compile`：把代码编译成可输出的 bundle
- `hmr server`：把变化的文件发给浏览器端
- `bundle server`：提供文件服务，让浏览器拿到更新内容
- `hmr runtime`：运行在浏览器里的小程序，负责把变化应用到页面上

# Tree Shaking（摇树优化）
- 这个概念可以理解成“只留下真正用到的代码”。
- 如果一个文件里有很多方法，但你只用了其中一个，其他没用到的代码就不会被打进最终结果。
- 它的前提是代码使用 ES Module 语法。

# Scope Hoisting
- 这是一种把模块尽量合并的优化方式。
- 目的是减少很多小函数包裹，减少性能开销，让代码更高效。

# Code Splitting（代码拆分）
- 把项目按需拆分，用户访问到某个功能时再加载对应代码。
- 适合多页面应用、路由页面、弹窗、图表等场景。
- 这样首屏更轻，整体体验更好。

```js
module.exports = {
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 10
        }
      }
    }
  }
}
```

# 懒加载
- 懒加载本质上就是“用户需要的时候才加载对应模块”。
- 比如进入某个路由时才下载这个页面的代码。
- 这样可以降低首屏体积。

```js
const UserPage = () => import(/* webpackChunkName: "user" */ './UserPage')
```

# Source Map
- Source Map 是一份“压缩后的代码和原始源码的对照表”。
- 线上报错时，它能帮助你快速定位到具体文件和代码行。
- 但不要把源码地图文件直接暴露到生产环境，避免泄漏业务代码。

# 环境变量管理
- Webpack 也会根据环境区分开发和生产。
- 常见做法是用 `mode` 来区分 `development` 和 `production`。
- 还可以配合 `dotenv`、`DefinePlugin` 等方式注入不同配置。

# Loader 和 Plugin 的区别
- Loader：负责“把某种文件翻译成 Webpack 能处理的模块”。
- Plugin：负责“在打包流程里插入额外功能”。
- 可以把它们理解成：Loader 负责转换文件，Plugin 负责扩展流程。

# API
- 可以通过 `require.context` 来批量读取某个目录下的文件。

# 常见问题
## webpackJsonp is not defined
- 通常是 HTML 里 JS 资源加载顺序有问题。

## There are multiple modules with names that only differ in casing
- 这是因为模块名大小写写法不一致，比如一个文件叫 `SideModal.vue`，另一个地方却写成了 `sideModal.vue`。

## Node Sass does not yet support your current environment: OS X 64-bit with Unsupported runtime
- 这通常是依赖版本和当前环境不兼容，常见解决办法是重新安装或重建依赖。
