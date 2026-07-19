# 样式
  - 乾坤子应用与主应用同文档，样式共享；需要加应用前缀和 css scoped 做样式隔离
  - 主题：主应用提供主题变量，注入到 document，子应用同文档自动生效

# 三方公用组件
  - 如 Element，可统一 CDN 或各应用自引

# 跨应用调用弹窗类组件
  - 子应用通过 webpack5 Module Federation 暴露组件给主应用，在主应用中注册组件
  - 子应用通过 window.$parentApp 调用主应用 use 方法

# 跨应用引入局部组件
  - 主应用通过 MF 引入子应用暴露的组件（如 Button、modal）

# 路由配置
  - 父子应用路由名 name 可以一样，但是 path 必须区分应用前缀

# 页面跳转
  - 子调主/其他子应用：通过 window.$parentApp.to() 跳转
  - 主调子：主应用先切到对应子应用路由，再通过 $app.apps[appName].window.$app.to() 跳子应用内路由

# 数据变化后通知子应用
  - 主应用 $app.emit(type, data)，子应用在 $app.on(type, data) 中接收并同步 store 等
