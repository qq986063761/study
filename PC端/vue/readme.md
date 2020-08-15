# 推荐

- [官网](http://cn.vuejs.org/)
- [vue-router](https://router.vuejs.org/zh/guide/#html)
- [vuex](https://vuex.vuejs.org/zh-cn/)
- [vue-cli3](https://cli.vuejs.org/zh/guide/deployment.html)
- [vue开源项目](https://github.com/opendigg/awesome-github-vue)
- [梁少峰Vue源码解析](https://github.com/youngwind/blog)
- [滴滴vue技术blog](https://github.com/DDFE/DDFE-blog)
- [滴滴vue技术揭秘](https://ustbhuangyi.github.io/vue-analysis/)
- [Vue虚拟DOM](http://www.cnblogs.com/xuntu/p/6800547.html)
- [Vue2的MVVM](https://github.com/wangfupeng1988/learn-vue2-mvvm)
- [vue-cli多页面打包配置](https://juejin.im/post/5a8e3f00f265da4e747fc700)

# 简介

## Vue（view）
- 概念：重心在 view 层，基于数据驱动和组件化思想
- 特点：
  - 轻量
  - 数据响应式（数据被监听自动更新视图）
  - 指令
  - 组件化、虚拟dom
  - 模版
  - 异步队列更新，数据独立触发更新，不用每次都检查所有数据
  - 渐进式（vue核心、vue-router、vuex等渐进生态）

## 其它同类框架的区别
- React
  - 特点：
    - 组件化、虚拟dom
    - hook
    - jsx
    - 用户手动触发视图更新（setState）
    - 轻量（不内置 ajax、router 等功能到核心包中，支持 mixins）

- Angular1.x
  - 特点
    - 指令
    - 过滤器
    - 双向绑定
    - 不支持低端浏览器
  - 劣势
    - 学习成本高（依赖注入机制等）
    - api 不直观
    - 赃检查 watcher 越多效率越低（因为定时检查所有 watcher 监听数据）

# 原理

## 生命周期

- beforeCreate：此时还未初始化 props 和 data，所以获取不到数据； 
- created：props 和 data 已经被初始化，数据可以被访问，组件未被挂载到 dom 上； 
- beforeMount：创建 vdom 之前触发
- mounted：将 vdom 渲染成真实的 dom，先递归子组件挂载，最后挂载根组件，然后触发根组件 mounted； 
- activated：keep-alive 组件被激活时触发
- deactivated：keep-alive 组件被切换时触发，组件被缓存
- beforeDestroy：组件被销毁前触发，此时可以移除定时器、 事件绑定等避免内存泄漏

## 组件

- 作用：复用代码、 便于统一维护； 
- 注册方式：全局注册（Vue.component）和局部注册（组件内的 components）； 
- 组件通信：
  - 父子组件通信：
    - 子组件通过 props 接收父组件数据，子组件通过 $emit 传递数据给父组件
    - 子组件通过 $parent 访问父组件数据，父组件通过 $children 和 $refs 访问子组件数据
  - 兄弟组件通信：
    - 组件通过 $parent.$children 和 $parent.$refs.compName 访问兄弟组件数据
  - 多层组件通信：
    - 使用 provide 和 inject 访问跨层祖先组件的数据 
  - 任意层次组件通信：
    - 使用 vuex 或利用 $on 和 $emit 实现任意组件通信
- data属性为什么是函数：避免多次复用相同组件时 data 被共享

## computed、 watch 的区别

- computed：
  - 依赖其他属性，一般禁止手动被改变
  - 缓存机制：计算值被改变则返回数据

- watch：
  - 监听属性变化则执行回调，内部做复杂的业务逻辑

## v-show 和 v-if 的区别

- v-show：dom 渲染一次，通过 display 控制显示隐藏，适合频繁显示隐藏切换
- v-if：切换时会触发组件的销毁、 挂载，不适合频繁切换的场景

## v-for 中使用 key 的作用
- 避免默认的复用机制带来的副作用
- 提高 vue 数据更新后，虚拟节点新旧节点比较效率，因为能快速查找到指定 key 节点

## slot

- 作用：自定义组件内容； 
- 分类：

  - 默认slot（完全代理内容分发）； 
  - 具名slot（指定位置内容分发）； 
  - 作用域slot（slot 提供数据，template 解构 slot-scope 获取组件内数据）； 

## Vue.set和vm.$set

- 作用：vue初始化后，需要新增的响应式属性，因为vue本身无法监听普通的深度新增属性； 

## vue-router

- 作用：用于单页面应用无刷新页面跳转； 
- 基本配置：熟悉 path、 name、 components、 children、 redirect 配置的作用； 
- 标签使用：熟悉 router-link 和 router-view 常用配置； 
- js功能：熟悉路由周期函数（beforeRouteEnter、 beforeRouteLeave），熟悉$router api； 
- webpack 路由导入懒加载正则替换表达式：`import (\w+) from ('.+')` 替换成 `const $1 = () => import(/* webpackChunkName: "module" */ /* webpackMode: "lazy" */ $2)` 

## vuex（项目内部通过store、 $store访问）

- 作用：一个 vue 应用的全局状态管理系统，方便应用中所有组件都能快速获取全局的状态改变，而不需要通过组件之间一层层传递； 
- 属性：

  - state：单纯的数据状态数据存储对象； 
  - getters：需要动态计算的状态数据； 
  - mutations：用于改变state状态的唯一提交方法，只支持同步； 
  - actions：用于提交mutation，支持异步； 
  - modules：用于将大型应用store分割成子模块，便于模块内部管理自己的状态； 

## 虚拟DOM
- 产生原生：js中操作dom效率低下，因为浏览器所构建的dom设计非常复杂，整个dom树体系庞大，频繁操作 dom 影响性能； 前端主要任务就是维护状态和更新视图，必定会需要大量的操作dom，所以很容易降低渲染效率; 
- 核心思想：提供一种方便的工具，保证最小化的 dom 操作，提高视图渲染效率; 
- 核心实现：JS对象操作比 dom 操作效率快，所以对 dom 的改变，首先并不会真正的操作实际 dom，而是会通过虚拟dom（即模拟dom结构的js对象）进行属性对比后确认真正改变的属性，再对真实的 dom 进行操作; 

## nextTick
- 作用：dom 更新后触发，用于获取更新后的 dom 状态
- 原理：
  - 默认采用 microtasks （异步任务：微任务）触发回调（可能会出现比事件冒泡更快的情况产生）
  - 特殊情况采用 macrotasks （异步任务：宏任务，比微任务执行慢）
    - 优先采用 setImmediate
    - 降级采用 MessageChannel 或 setTimeout

# bug

## Computed property "text" was assigned to but it has no setter

- text 这个属性作为计算属性，如果使用 v-model 绑定，则会报错，解决办法：采用 value 属性

## 属性赋值对视图渲染无效

- 初始化data时未追加，可通过 `Vue.set` 或 `this.$set` 方法修改数据避免； 
- 子组件不规范（未通过sync修饰符）的操作父组件通过 props 传递的数据，应尽量避免子组件过多操作props数据; 

## vuex不兼容IE(例如：Promise”未定义、 或vuex报错vuex requires a Promise polyfill in this browser)

- 在代码执行之前，引入 babel-polyfill; 

## Error in nextTick: "InvalidCharacterError: Failed to execute 'setAttribute' on 'Element': '}' is not a valid attribute name."

- 类似这种错误，一般是由于html模板中，自已在元素属性上加了vue无法识别的属性名，比如上面的报错中是不识别 '}' 说明模板中有误写了 '}' 到属性中; 

## Cannot read property '_withTask' of undefined：

- 常因为vue template中绑定的数据或方法，没有在实例中的对应属性中写入而产生; 

## No parser and no file path given, couldn't infer a parser

- 由于 prettier 模块版本过高导致，prettier 是 "vue-loader" 的依赖，把 vue-loader 降级成 "12.2.2" 可解决; 

## 新的 vue-cli 项目中 webpack-dev-server 高版本babel编译不了导致IE报错：

- 降版本 "webpack-dev-server": "2.6.1"; 

## 路由栈溢出报错
- 可能由于两个组件的 name 属性相同导致； 

## 设置style scoped后修改样式导致界面样式错乱

- 不要在带 `[data-v-375f9d10]` 的类名上修改； 

## vuex数据更新监听不到

- 如果是对象请深拷贝后重新复制给 state 中的变量； 

## Uncaught TypeError: Cannot read property 'toLowerCase' of undefined

- 可能由于通过组件name注册组件时，组件名未定义，导致Vue.component注册组件时获取不到组件名字符串； 

## 路由操作url改变，但是组件界面未变化

- 在某个路由的钩子函数中未调用 next(); 

## template or render function not defined

- 当组件文件夹中同名文件拆分js、 vue、 css文件时，引入文件的位置必须写全文件扩展名； 

## "export 'default' (imported as '__vue_script__') was not found

- vue组件中，未使用 export default 导出组件配置

## undefined is not an object (evaluating 'val.toLowerCase')
- Vue.component通过组件name属性注册组件时，未定义name属性会报错