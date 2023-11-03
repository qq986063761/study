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

# webpackJsonp is not defined
- 大多是 html 中 js 资源加载先后顺序混乱

# There are multiple modules with names that only differ in casing
- 定义的模块大小写和引入模块的大小写不一致，比如定义的模块是：SideModal.vue，但是引入模块确是 `import sideModal from './sideModal.vue'`;

# Node Sass does not yet support your current environment: OS X 64-bit with Unsupported runtime
- npm rebuild node-sass
