# 资源
- [掘金1](https://juejin.im/post/5b0b7d74518825158e173a0c)
- [掘金2](https://juejin.im/post/5de87444518825124c50cd36)
- [fundebug 性能监控](https://www.fundebug.com/)
- [优雅处理异常监控](https://mp.weixin.qq.com/s?__biz=MzA4Nzg0MDM5Nw==&mid=2247484402&idx=1&sn=f8d2b3fb20b2026c7039ad8dba735048&source=41)
- [YSlow](Yahoo发布的基于火狐的浏览器性能插件)
- [谷歌性能分析](https://accounts.google.com/signin/v2/identifier?service=analytics&passive=1209600&continue=https%3A%2F%2Fanalytics.google.com%2Fanalytics%2Fweb%2F%23&followup=https%3A%2F%2Fanalytics.google.com%2Fanalytics%2Fweb%2F&flowName=GlifWebSignIn&flowEntry=ServiceLogin)

# html
- 省略协议：`<link href="//x.x.x/x.css">`，节省体积
- dns 预解析
```html
  <!-- 开启 dns 预解析 -->
  <meta http-equiv="x-dns-prefetch-control" content="on"/>
  <link rel="dns-prefetch" href="//www.server.com/">
```
- 预加载，`<link rel="preload" href="style.css" as="style">` 先加载预加载资源，后加载 body 中的资源
- 预加载：`<link rel="prefetch" href="other-page.js" as="script">`，先加载 body 中的资源，后预加载其他页面的资源
- 预渲染页面：`<link rel="prerender" href="//example.com">`，先加载下一个页面缓存

# 本地缓存
- Cookie：体积小（4kb），会随 http 发给服务器，影响效率
- Web Storage：遵循同源策略，存储量大（5-10M）
  - Local Storage：永久存储
  - Session Storage：会话存储（页面关闭数据被删除）
- IndexedDB：非关系数据库，存储量大（不小于250M） [localforage](https://localforage.docschina.org/#api-config)

# 字体图标
- [阿里字体图标](http://www.iconfont.cn/);

# CDN（Content Delivery Network：内容分发网络）
- CDN 获取距离客户端最近的资源
- 减少本地包大小

# 优化图片
- 图片类型：
  - JPEG/JPG：有损压缩、体积小、加载快、不支持透明；
  - PNG-8（支持 2 的 8 次方种颜色）/PNG-24：无损压缩、质量高、体积大、支持透明
  - SVG（可缩放矢量图）：体积小、不失真、兼容性好；渲染成本高影响性能
  - Base64：文本、依赖编码、适合非常小的图片
  - WebP：支持有损和无损压缩，兼容不好，占计算资源
- 优化方案：
  - 减少图像像素点
  - 小图使用 base64
  - 多图合并到一张图 [雪碧图生成器](https://www.toptal.com/developers/css/sprite-generator)
  - [WebP转换](https://www.upyun.com/webp)

# webpack 优化打包速度
- 高版本 webpack
- 高版本 node.js
- 配置下列属性
  - include、exclude：指定包含、排除打包覆盖面
  - alias：别名，减少递归查找
  - noParse：对没有依赖其他模块的包配置，不会被 webpack 解析
  - extensions：后缀，import 文件名，优先以配置后缀为条件查找
  - externals：无需打包模块，采用外部引入
- webpack3.x 以下使用 happypack：多线程打包
- webpack-parallel-uglify-plugin：多线程增强代码压缩效率
- DllPlugin、AutoDllPlugin：抽离不变动静态资源，避免重复打包
- cache-loader：缓存开销大的 loader，下次打包减少打包时间；babel-loader 本身自带这个功能

# webpack 减少打包体积（webpack自带配置已经包含了压缩部分）
- 减少 main.js 中引入资源大小，避免 app.js 太大
- css-split-webpack-plugin：拆分 css
- compression-webpack-plugin：gzip 压缩，一般不需要前端做
- webpack3.x 以下使用 extract-text-webpack-plugin：内部配置 allChunks 默认是true，会把所有样式放到 app.css 中，设置为 false 可分割模块 css

# 懒加载
- 路由懒加载（例如 vue-router 的懒加载）
- 组件懒加载（例如 vue 的异步组件）
- cdn懒加载（动态加载 cdn 资源）

# 代码
- 避免内存泄露（销毁不用事件，变量不用赋值 null）
- 避免一次性加载大数据量内容（分页、数据懒加载）
- 避免 JSON.stringify 和 JSON.parse 的参数层级深
- 节流（throttle）防抖（debounce）优化频繁触发
- 懒加载库（lazy-load）优化多图显示
- 减少不必要 ajax 请求

# 浏览器渲染
- css 引擎查找规则：从右到左匹配，避免复杂选择器
  - 不用通配符 *
  - 可继承属性不用重复定义在子选择器中
  - 不用标签选择器，用类选择器替代
  - 禁多层嵌套选择器，优化类名语义化父子关系
- html、css、js 会阻塞渲染：浏览器必须等 cssom 生成后才开始渲染，js 执行会阻止 cssom 生成
  - 先获取 css 资源，缩短首屏渲染时间
  - script 标签的 defer 属性（文档解析完成后，DOMContentLoaded 触发前执行）和 async 属性（异步加载，不阻塞浏览器渲染）优化 js 加载时机
- DOM 操作效率低：会触发渲染引擎更新 dom 树和 cssom 树，导致回流、重绘
  - 重绘：dom 样式变化，比如颜色
  - 回流：dom 尺寸变化，比如宽、高、显示隐藏
    - 频繁触发回流的元素 GPU 加速（硬件加速），让它隔离：`transform: translate3d(0, 0, 0);backface-visibility: hidden;`
  - 减少 dom 操作：
    - 提前缓存 dom 变量，延迟操作 dom 属性，收集变化后最后统一修改
    - 利用 DocumentFragment 减轻渲染引擎负担，先用 DocumentFragment 收集变化 dom，最终再一次添加到真实 dom
    - 多次 style 属性改变，换成一次 class 的修改
    - 必须多次修改 style 操作，可先 display：none，设置完所有样式后，再设置 display：block 显示减少中间损耗

# 单页面（spa）应用首屏优化
- 减小入口文件积
- 静态资源本地缓存
- UI库按需加载
- 图片资源压缩
- 组件重复打包
- GZip压缩
- SSR服务端渲染

# 性能监控
- 两个角度：
  - 时间：常见耗时，如页面加载耗时、渲染耗时、网络耗时、脚本执行耗时等。
  - 空间：资源占用，包括 CPU 占用、内存占用、本地缓存占用等。
- 谷歌浏览器 Performance 面板
  - 利用刷新按钮可以查看一次加载完成的性能信息，利用记录按钮可以查看自由操作过程的性能信息
  - 性能面板右上角信息：
    - FPS：帧数，绿色柱越高，帧数越高，越流畅，红色表示卡顿可优化
    - CPU：和面板最下方生成的图表颜色对应，表示消耗 CPU 的情况
    - NET：各请求耗时和前后顺序
- 谷歌浏览器 LightHouse（高版本谷歌的 Audits 面板）：
  - Performance：性能
    - FCP：首次出现 dom 内容的时间`performance.getEntriesByType('paint')[0]`
    - LCP：首次最多内容被显示出来时的时间`performance.getEntriesByType('paint')[1]`
    - TTI：页面完全可以进行交互的时间（后续没有长任务被执行了）
    - Speed Index：页面的可见填充内容速度
    - TBT：页面被阻止响应用户交互的总时长
- 利用 performance 变量获取页面加载性能信息
  - [timing属性中的属性对应加载关系图](https://user-gold-cdn.xitu.io/2018/10/7/1664ddd4e3df9a14?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
  - 调用 api：`performance.getEntriesByType('navigation')`获取具体的时间区间信息，[相关网站](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance)

# 页面埋点
- 来源类型：PV（页面浏览量）/ UV（通过互联网访问网页的人）；停留时长；流量来源；用户交互；
- 实现类型：
  - 手写埋点：程序员手写代码；
  - 无埋点：统计事件定时上报，然后做筛选；

# 异常监控
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
