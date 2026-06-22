# 资源
- [官网中文](https://webpack.docschina.org/)
- [portfinder](https://www.npmjs.com/package/portfinder)

# 构建工具的作用
- 转换 es6 语法
- 转换 jsx
- css 预处理、前缀补全
- 压缩混淆
- 图片压缩

# Webpack
- 模块打包器，它根据模块的依赖关系进行静态分析，然后将这些模块按照指定的规则生成对应的静态资源

# Webpack出现原因是因为已有的模块化工具并不能很好的完成如下的目标： 
- 将依赖树拆分成按需加载的块；
- 初始化加载的耗时尽量少；
- 各种静态资源都可以视作模块；
- 将第三方库整合成模块的能力；
- 可以自定义打包逻辑的能力；
- 适合大项目，无论是单页还是多页的 Web 应用；

# Webpack特点
- 代码拆分： Webpack 有两种组织模块依赖的方式，同步和异步。 异步依赖作为分割点，形成一个新的块，在优化了依赖树后，每一个异步区块都作为一个文件被打包
- Loader： Webpack 本身只能处理原生的 JavaScript 模块，但是 loader 转换器可以将各种类型的资源转换成 JavaScript 模块。 这样，任何资源都可以成为 Webpack 可以处理的模块
- 智能解析： Webpack 有一个智能解析器，几乎可以处理任何第三方库，无论它们的模块形式是 CommonJS、AMD 还是普通的 JS 文件。 甚至在加载依赖的时候，允许使用动态表达式 require("./templates/" + name + ".jade")
- 插件系统： Webpack 还有一个功能丰富的插件系统。 大多数内容功能都是基于这个插件系统运行的，还可以开发和使用开源的 Webpack 插件，来满足各式各样的需求
- 快速运行： Webpack 使用异步 I / O 和多级缓存提高运行效率，这使得 Webpack 能够以令人难以置信的速度快速增量编译

# Webpack命令参数
- webpack
  - --config 指定打包执行的配置文件
  - --mode development[production] 开发生产模式，会自动压缩或不压缩
  - --watch 监听文件改变
  - --color 输出过程带颜色
  - --display - modules 展示输出模块
  - --display - reasons 展示输出理由

# 浏览器热更新
- 本地开发打开浏览器预览，代码变化时，浏览器自动更新页面内容技术
  - 页面整体刷新
  - 页面局部刷新

# 热更新原理
- webpack compile：将 js 代码编译成 bundle（用于构建输出的文件）
- hmr server：将热更新的文件给 hmr runtime
- bundle server：提供文件服务，让浏览器能访问
- hmr runtime：会注入到浏览器端的 bundle.js 中，和本地服务建立连接，更新文件变化

# tree shaking（摇树优化）
- 一个模块文件中可能有很多方法，如果只有一个方法用到了，一般整个文件都会被打包，tree shaking 只会把用到的方法打包减少文件大小
- 原理：
  - 代码不会被执行到，比如一个 if (false) {...}
  - 代码执行结果不会被用到
  - 代码只会影响死变量（只写不读）
- es6模块特点：
  - 只能作为模块顶层的语句出现
  - import 的模块名只能是字符串常量
  - import binding 是 immutable 的
- 代码清除阶段：uglify（压缩）阶段删除无用代码

# scope hoisting
- 将所有模块代码按引用顺序，多次引用的相同模块会放在同一个函数作用域中，然后合理重命名变量避免变量冲突；这样可以减少函数声明代码和内存开销

# Code Splitting（代码拆分）
- 入口拆分：多个 `entry` 会生成多个入口 bundle，适合多页面应用。
- 动态导入拆分：`import('./detail')` 会生成异步 chunk，适合路由、弹窗、图表、富文本等非首屏模块。
- 公共依赖拆分：`optimization.splitChunks` 可把第三方库、公共业务模块抽成独立 chunk，提高缓存命中。
- 运行时代码拆分：`optimization.runtimeChunk` 把 webpack runtime 单独抽出，减少业务 chunk hash 变化。

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
- 懒加载本质是动态 `import()`，Webpack 会把被导入模块编译成单独 chunk。
- 常见在前端路由里使用：进入某个路由时才下载对应页面代码。
- 可以用魔法注释指定 chunk 名称：
```js
const UserPage = () => import(/* webpackChunkName: "user" */ './UserPage')
```
- 懒加载适合降低首屏体积，但过度拆分会造成请求过多，需要结合性能数据判断。

# Source Map
- Source Map 用来把压缩后的线上代码映射回源码，方便定位报错行列。
- 开发环境常用 `eval-cheap-module-source-map`，构建快、定位够用。
- 生产环境可用 `source-map` 或 `hidden-source-map`；后者生成 map 但不暴露引用，适合上传到错误监控平台后删除。
- 不建议把包含源码的 `.map` 文件直接公开到生产静态目录，可能泄露业务代码。

# 环境变量管理
- `mode` 会影响 `process.env.NODE_ENV`，常见值是 `development`、`production`。
- `DefinePlugin` 可以在编译期把变量替换成字面量，注意它不是运行时读取环境变量。
- 跨平台设置命令行环境变量可用 `cross-env`：
```json
{
  "scripts": {
    "build:test": "cross-env APP_ENV=test webpack --mode production"
  }
}
```
- 多环境配置常见做法：`.env.development`、`.env.production` 配合 `dotenv` / `dotenv-webpack`，再区分接口地址、publicPath、埋点开关。

# Loader 和 Plugin 区别
- Loader 面向单个或一类模块做转换，例如把 TS、CSS、图片转换成 Webpack 能识别的模块。
- Plugin 基于 Webpack 生命周期扩展能力，例如生成 html、清理 dist、抽离 CSS、定义环境变量、分析产物。
- 面试表达：Loader 是“文件转换器”，Plugin 是“构建流程扩展器”。

# api
- 检索文件 require.context

# 问题
# webpackJsonp is not defined
- 大多是 html 中 js 资源加载先后顺序混乱

# There are multiple modules with names that only differ in casing
- 定义的模块大小写和引入模块的大小写不一致，比如定义的模块是：SideModal.vue，但是引入模块确是 `import sideModal from './sideModal.vue'`;

# Node Sass does not yet support your current environment: OS X 64-bit with Unsupported runtime
- npm rebuild node-sass
