# 推荐
- [掘金1](https://juejin.im/post/5b0b7d74518825158e173a0c)
- [掘金2](https://juejin.im/post/5de87444518825124c50cd36)

# html
- 省略协议：`<link href="//www.baidu.com">`，节省体积，浏览器优先采用服务器自身协议
- dns预解析：`<link rel="dns-prefetch" href="//www.server.com">`，提高后续请求效率
- 预加载：`<link rel="preload" href="style.css" as="style">`，先加载需要预加载的资源，后加载body资源
- 预加载：`<link rel="prefetch" href="main.js" as="script">`，先加载 body 资源，后预加载其他html页面需要的资源
- 预渲染：`<link rel="prerender" href="//example.com">`，先加载下一个页面缓存，提高下一个页面的访问效率

# 缓存

## 网络缓存

- Memory Cache：浏览器最先尝试查找的缓存区域，响应速度最快，生命周期短（tab 关闭后数据消失），通常 base64 图片、体积不大的 js、css 文件比较容易被写入到内存缓存起来，较大的文件就会被放到磁盘缓存
- HTTP Cache：见网络基础中的 http 缓存策略
- Service Worker Cache：借助 Service Worker 实现的离线缓存
- Push Cache：HTTP2 在 server push 阶段存在的缓存，当前面的缓存都未命中时则询问 push cache，会话终止时缓存被释放；不同页面共享一个 http2 连接则共享一个 push cache

## 本地缓存

- Cookie：体积小（4kb），跟随 http 请求带给服务器会影响性能
- Web Storage：都遵循同源策略，存储量大（5-10M），不和服务器通信
  - Local Storage：永久化存储，必须手动删除，同域名可共享数据
  - Session Storage：会话级存储（页面关闭数据被删除），同会话（相同的 tab 窗口）才能共享数据
- IndexedDB：非关系型数据库，存储量大（不小于250M），可存储二进制数据；[localforage](https://localforage.docschina.org/#api-config)

# 资源

## 字体图标

- 使用字体图标代替小图标：[阿里字体图标](http://www.iconfont.cn/);

## 使用 CDN（Content Delivery Network：内容分发网络）

- 1、利用 CDN 获取距离客户端最近的资源来加速下载；2、减少本地包大小
- 作用：缓存（世界各地都缓存根 CDN 服务器上的资源）；回源（分发的服务器没有资源或资源过期则向根服务器获取资源）

## 优化图片

- 图片类型：
  - JPEG/JPG：有损压缩、体积小、加载快、不支持透明；适合色彩丰富的图片，可做背景图、轮播图、Banner 图
  - PNG-8（支持 2 的 8 次方种颜色）/PNG-24：无损压缩、质量高、体积大、支持透明；适合小的 logo、颜色简单对比鲜明的背景
  - SVG（可缩放矢量图）：基于 XML 语法的文本、体积小、不失真、兼容性好；但是渲染成本高影响性能
  - Base64：文本、依赖编码、小图标解决方案；适合非常小的图片
  - WebP：支持有损和无损压缩，集多种图片格式的优点于一身；但是兼容不太好，占用计算资源
- 优化方案：
  - 尽可能减少图像的像素点
  - 小图使用 base64 格式
  - 将多个图片合并到一张图上，通过css背景渲染需要的图片，打到减少 http 请求的目的：[雪碧图生成器](https://www.toptal.com/developers/css/sprite-generator)
  - [WebP转换](https://www.upyun.com/webp)

# webpack

## 优化打包速度
- 配置好下列属性
  - include、exclude：指定包含、排除的打包覆盖面
  - alias：配置别名，减少程序向上递归查找资源的过程，直接告诉 webpack 应该去哪里查找依赖
  - noParse：对于 jquery 这种没有依赖其他模块的包，配置后不会被 webpack 解析
  - extensions：指定常用后缀，import 没有后缀的文件名，会优先以配置为条件查找
  - externals：指定无需打包的模块，采用外部引入
- happypack：多线程打包
- webpack-parallel-uglify-plugin：多线程增强代码压缩效率
- DllPlugin、AutoDllPlugin：抽离不常变动的静态资源，避免重复打包
- cache-loader：缓存开销大的 loader，下次打包减少打包时间；babel-loader 本身自带这个功能

## 减少打包体积（webpack自带配置已经包含了压缩部分）
- 尽量减少 main.js 中引入资源的大小，避免 app.js 太大
- css-split-webpack-plugin：拆分 css
- compression-webpack-plugin：gzip 压缩，通常不需要前端做这个工作
- extract-text-webpack-plugin：内部配置 allChunks 默认是true，会把所有样式放到 app.css 中比较大，可设置为 false 分离各模块 css

## 懒加载
- 路由懒加载（比如 vue-router 的懒加载）
- 组件懒加载（比如 vue 的异步组件）
- cdn懒加载（按需动态加载 cdn script，监听脚本onload后再进入页面）

# 代码
- 避免内存泄露（手动监听的事件必须合理销毁，变量合理重置为 null）
- 避免一次性加载大数据量内容等等（列表中采用分页、树形数据中采用子数据懒加载等方案）
- 避免 JSON.stringify 和 JSON.parse 的参数层级特别深
- 利用事件节流（throttle）和防抖（debounce）优化频繁触发事件
- 利用懒加载库（lazy-load）优化多图显示：对于非常多的图片展示页面，可采用懒加载库，让可见区域优先加载，非可见区域延迟加载
- 合理发送 ajax 请求，减少不必要的请求

# 渲染

## 浏览器渲染

- css 引擎查找规则：从右到左匹配，所以繁琐的选择器很影响性能
  - 禁止使用通配符
  - 利用属性可继承性，避免重复定义属性
  - 禁止使用标签选择器，采用类选择器替代
  - 禁止多层嵌套，采用类名关联父子关系
- html、css、js 会阻塞渲染：浏览器必须等 cssom 生成后才开始渲染，js 执行会组织 cssom 生成
  - 尽早、尽快下载 css 资源到客户端，缩短首屏渲染时间
  - 利用 script 标签的 defer 属性（异步加载、文档解析完成后（DOMContentLoaded 触发前）延迟执行）和 async 属性（异步加载，不阻塞浏览器渲染）优化 js 加载时机
- DOM 操作效率低：因为 js 操作 dom，会触发渲染引擎更新 dom 树和 cssom 树触发回流和重绘，然后重新生成渲染树用于渲染布局
  - 重绘：dom 样式变化（颜色等，不影响几何属性的改变）
  - 回流：dom 发生几何尺寸变化（宽、高、显示隐藏等），回流比重绘开销更大
    - 针对频繁触发回流的元素采用 GPU 加速（硬件加速），使其隔离：`transform: translate3d(0, 0, 0);backface-visibility: hidden;`
  - 减少 dom 操作的方案：
    - 提前缓存需要操作的 dom，推迟操作 dom（将变化使用变量先缓存，最后一次性对 dom 进行操作），适合循环操作 dom 的场景；
    - 利用 DocumentFragment api 减轻渲染引擎负担，将不断变化的部分采用 DocumentFragment 存储起来，最后追加到真实的 dom 操作中；
    - 将多次 style 属性的改变，转化为追加类的形式统一改变一系列样式
    - 对于必须执行多次 style 改动的操作，可以采用离线 dom 操作（先设置 display：none，设置完所有样式后（中间过程操作损耗低），再设置 display：block 显示）
- Event Loop：
  - 执行顺序：一个 macro-task；一队 micro-task；执行渲染；处理 worker 相关任务
  - 优化方案：最佳操作 dom 的时机是包装在一个 micro-task api 中执行 dom 操作，如在 vue 中 dom 操作就可以放在 nextTick 中操作

## 服务端渲染

- 解决首屏加载速度慢的问题（因为客户端渲染需要加载 html、js 等资源，然后还要运行 js，最后才渲染，而服务端渲染返回的就是可以直接用于呈现的网页），但是毕竟服务器相比客户端要少太多，压力大，所以不作为优先考虑的方案

# 监控

## 性能监控

- 可视化检测：谷歌浏览器 Performance 面板
  - 利用刷新按钮可以查看一次加载完成的性能信息，利用记录按钮可以查看自由操作过程的性能信息
  - 性能面板右上角信息：FPS（帧数，绿色柱越高，帧数越高，越流畅，红色表示卡顿可优化）；CPU（和面板最下方生成的图表颜色对应，表示消耗 CPU 的情况）；NET（各请求耗时和前后顺序）
- 可视化检测：利用 LightHouse（高版本谷歌的 Audits 面板）提供的跑分和建议来优化项目
- 可编程检测：利用 performance 变量获取页面加载性能信息
  - [timing属性中的属性对应加载关系图](https://user-gold-cdn.xitu.io/2018/10/7/1664ddd4e3df9a14?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
  - 调用 api：`performance.getEntriesByType('navigation')`获取具体的时间区间信息，[相关网站](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance)

## 页面埋点
- 来源类型：PV（页面浏览量）/ UV（通过互联网访问网页的人）；停留时长；流量来源；用户交互；
- 实现类型：
  - 手写埋点：程序员手写代码；
  - 无埋点：统计事件定时上报，然后做筛选；

## 异常监控
- 需要异常的原因
  - 增强用户体验
  - 远程定位问题
  - 及早发现问题
  - 定位无法复现的问题
  - 完善前端监控系统
- 需要处理的异常类型
  - js语法错误、代码异常
  - ajax请求错误
  - 静态资源加载异常
  - promise异常
  - iframe异常
  - 跨域 script error
    - 追加 crossorigin 属性，但是服务器需要配置 Access-Control-Allow-Origin
  - 崩溃、卡顿
    - 利用 window 的 load 和 beforeunload
- [fundebug](https://www.fundebug.com/)
- [优雅处理异常监控](https://mp.weixin.qq.com/s?__biz=MzU3NjczNDk2MA==&mid=2247484848&idx=1&sn=8dbe160fa08f941ef1f7eac8550ed981&chksm=fd0e162fca799f393500b1d332d534c53d1219e41220d67828a1023e01ca594361309d47e610&mpshare=1&scene=1&srcid=&sharer_sharetime=1576577814242&sharer_shareid=3729371b58078275ac9e25ce4ff764a1#rd)
