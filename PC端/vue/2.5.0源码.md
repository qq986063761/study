# 目录结构（src）
- platforms：提供给不同平台的 vue 版本入口；
  - 不带 template 编译器（不支持 template 属性，只支持 render ）的 vue 版本入口：platforms\web\runtime\index.js；
  - 带 template 编译器的 vue 版本入口：platforms\web\entry-runtime-with-compiler.js
  - patch 函数入口：platforms\web\runtime\patch.js
  - 编译相关入口：platforms\web\compiler\index.js
- core：vue 核心代码；
  - vue 核心入口：core\index.js；
  - vue 全局 api 入口：core\global-api\index.js；
  - vue 实例 api 入口：core\instance\index.js；
  - Observer 相关 api 入口：core\observer\index.js；
  - Watcher 相关 api 入口：core\observer\watcher.js；
  - Dep 相关 api 入口：core\observer\dep.js；
  - 组件渲染相关 api 入口：core\instance\lifecycle.js；
  - patch 函数相关 api 入口：core\vdom\patch.js；
- compiler：编译相关代码；
  - 编译模板、render 等：compiler\index.js；
- shared：公用的配置、工具类等；

# new Vue 做了什么
- 在文件：src\core\instance\index.js 中，会调用 Vue 方法初始化 vue
- 内部调用 this._init(options) 方法初始化属性
- 在 _init 中调用一系列方法：initLifecycle、initEvents、initRender、initInjections、initState、initProvide 初始化属性，最后调用 vm.$mount(vm.$options.el) 渲染元素

# 响应式原理
- 在初始化 Vue 属性时，initState 方法中开始定义响应式，initState 在文件：src\core\instance\state.js 中
- 在 Observer 中对数据进行监听，利用 dep 与 watcher 建立联系，数据更新后通知 watcher 更新 watcher 对应的组件和视图
- Watcher 在 mount 时被创建，主要用于和组件 vnode 建立联系，用于被 dep 通知更新时，能更新指定 vnode 对应的组件视图

# nextTick 的实现逻辑
- 源码位置：src/core/instance/render.js
- 按兼容性确定使用什么方法调用下一个回调函数 setImmediate --> MessageChannel --> Promise --> setTimeout

# 编译
- parse：生成 ast 树（解析模版中的标签、属性、表达式、静态文本等等生成 ast 元素的数据）
- optimize：优化 ast 树（标记静态节点树）
- codegen：生成 render 代码

# 中文输入过程监听事件
- compositionstart、compositionend