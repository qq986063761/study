# 资源
- [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/)

# 什么是 html
- Hyper Text Markup Language（超文本标记语言），写网页结构的语言

# html 书写规则
- 在尖括号`<>`中的是标签名，不区分大小写；
- 标签必须成对出现；

# html 本身缺陷
- 不能适应多种设备
- 要求浏览器必须智能
- 数据和显示没有分离
- 功能不够强大

# 静态页面
- 和服务端没数据交互的网页

# HTML5
- 标签
  - 画布：canvas;
  - 多媒体：video、audio;
  - 语义化标签  ：header、nav、aside、main、article、section、footer;
- 属性
  - contenteditable：可编辑
  - data-属性名：自定义属性
  - draggable：可拖拽
- api
  - 本地存储：
    - localStorage：可存数据（5M左右），无期限，不跨域
    - sessionStorage：可存数据（5M左右），浏览器 tab 窗口销毁前有效，不跨域
  - worker：提供工作线程，不阻塞页面就能在另一个线程中执行脚本
  - WebSocket：创建、管理 websocket 连接，可发送给 websocket 服务端，或接收 websocket 服务端数据
  - Geolocation：可获取设备地理位置信息

# 单页面和多页面
- 多页面：多个 html 文件，通过 href 跳转页面；
  - 缺点：页面跳转会重新刷新整个页面，资源也会重新加载，静态资源无法复用
- 单页面：一个 html 文件，通过路由跳转页面
  - 优点：页面跳转由前端控制，跳转快速体验好
  - 缺点：不利于 SEO（搜索引擎优化）

# 块级元素和内联元素
- 块级元素：元素独占一行，能设置宽高
- 内联元素：元素不独占一行，不能设置宽高和上下 margin

# 替换元素和非替换元素
- 替换元素：浏览器根据元素属性判断具体显示内容，如：input、img、textarea、select
- 非替换元素：浏览器直接根据元素标签的包裹内容显示，如：p、div、span

# 标签属性 id 和 name 的区别
- id：唯一、可作为 a 链接的锚点
- name：可重复、常用于表单提交数据的 key

# GUI 渲染线程负责 HTML

# js 引擎线程负责 js 脚本程序，但是 js 能改变 html 结构，所以会阻塞 GUI 渲染

# 打开网页解析 HTML 流程
- 浏览器获取到html内容，开始解析
- head 内容被解析时，页面还没开始渲染，浏览器会先获取 head 中 link 相关的外部资源
- body 内容被解析，浏览器碰到 script 标签开始加载 js 资源，然后 js 引擎开始解析 js 代码，这时候页面渲染会停止

# 实用标签
```html
<!-- 编码统一 -->
<meta charset="UTF-8">
<!-- 作者 -->
<meta name="author" content="你的名字">
<!-- 描述 -->
<meta name="description" content="一个基于vue的项目">
<!-- 关键字 -->
<meta name="keywords" content="html,css,javascript,vue">
<!-- 指定网页渲染采用最新版本 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<!-- 指定双核浏览器优先采用极速模式 -->
<meta name="renderer" content="webkit">
<!-- 对于同一个页面有多个网址、或者存在重定向页面，避免搜索引擎浪费时间去抓重复页面 -->
<link href="https://lagou.com/a.html" rel="canonical">
<!-- 禁止缓存 -->
<meta http-equiv="Cache-Control" content="no-cache, no-store, max-age=0, s-maxage=0, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<!-- 移动设备相关 -->
<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta content="yes" name="apple-mobile-web-app-capable">
<meta content="black" name="apple-mobile-web-app-status-bar-style">
<!-- 禁止移动端识别电话号码邮箱 -->
<meta name="format-detection" content="telephone=no, email=no">
<!-- 页面过期时间配置 -->
<meta http-equiv="expires" content="Wed, 26 Feb 1997 08：21：57 GMT">
<!-- 避免被访问，会重定向新页面 -->
<meta http-equiv="Window-target" content="_top">
<!-- 指定时间重定向到新页面 -->
<meta http-equiv="Refresh" content="5;URL=https://www.baidu.com/">
<!-- 允许 https 请求 http 资源 -->
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
<!-- 网页搜索内容指定，content属性值：all,none,index,noindex,follow,nofollow -->
<meta name="robots" content="all">
<!-- dns 预解析域名，可提高请求效率 -->
<meta http-equiv="x-dns-prefetch-control" content="on"/>
<link rel="dns-prefetch" href="//m.baidu.com/">
<!-- 预加载资源，prefetch 可能会在浏览器忙时被忽略，preload 一定会预先加载 -->
<link rel="preload" href="style.css" as="style">
<link rel="prefetch" href="main.js" as="script">
<!-- 类似 ppt 跳转下一页效果，没有 URL 内容的话就是多少秒刷新一次当前页面 -->
<meta http-equiv="Refresh" content="5; URL=page2.html">
<!-- 
  加载 js 脚本
  async：立即请求文件，不阻塞渲染引擎，文件加载完毕后会阻塞渲染引擎并立即执行文件内容
  defer：立即请求文件，不阻塞渲染引擎，等到解析完 HTML 之后再执行文件内容
  type：让浏览器按照 es6 标准将文件当作模块进行解析，默认阻塞效果和 defer 一样
 -->
<script type="module" async defer></script>
```

# 什么是 SSR 和 SEO
- SSR：服务端渲染（Server Side Rendering），由服务器合成html然后发送给浏览器，而不是一开始就呈现在浏览器不完整的html片段，对SEO极其不利;
- SEO：搜索引擎优化（Search Engine Optimization），搜索引擎根据网页html代码搜索值得优先展示的信息，方便用户能更快的搜索到想要的信息;

# 浏览器端渲染和服务端渲染过程
- 浏览器端渲染：
  - 请求html；
  - 服务端返回html；
  - 浏览器加载html中js/css资源；
  - 等待js/css资源加载完成；
  - 运行js代码，js向后端请求数据；
  - 等待后端数据返回；
  - 客户端渲染数据；
- 服务端渲染：
  - 请求html；
  - 服务端请求数据( 内网请求快 )；
  - 服务器初始渲染（服务端性能好，较快）；
  - 服务端返回已经有正确内容的页面；
  - 客户端请求js/css资源；
  - 等待资源加载完成；
  - 客户端完成剩下小部分渲染完成( 内容小，渲染快 )；

# 直播概念
- 直播过程：视频和音频输入端采集数据（视频、音频流），通过一定手段转换成比特流，然后有序的放到一个容器（mp3、mp4、flv 等等）中存放
- 视频文件格式（容器格式）：.ogg、.mp4、.flv、.webm 等等
  - PS（Program Stream）：静态文件流，将完整视频的比特流放入一个容器
  - TS（Transport Stream）：动态文件流，将接受到的视频比特流分成多个容器
- 视频编解码器（视频编码格式）：FLV、MPEG-4（Part2）、VP8、H.264（是 MPEG-4 的第十部分）、Ogg、WebM 等等
- 音频编解码器（音频编码格式）：MP3、AC3 等等
- 直播协议：hls、rtmp、http-flv、rtp 等等
  - HLS（HTTP Live Streaming）：主要两块内容是 .m3u8 和 .ts 播放文件
    - 服务器：后台服务器接收视频流，然后进行编码（采用 H.264 编码格式，音频则是 AAC、MP3、AC-3、EC-3，然后使用 MPEG-2 Transport Stream 作为容器格式）和片段化（将 TS 文件分成若干个想等大小的 .ts 文件，并生成 .m3u8 作为索引文件确保包的顺序）
    - 客户端：使用 url 下载 m3u8 文件，然后下载 ts 文件，下载完成后使用即时播放器（playback software）播放视频
    - 功能：支持 https，快放、倒放、广告插入、不同分辨率视频切换
    - 弊端：首次加载延迟（因为 http 中的 tcp 三次握手等流程比较慢）
  - RTMP（Real-Time Messaging Protocol）：专门针对实时交流场景，使用 TCP 长连接，延迟低；处理格式是 MP3/ACC + FLV1，对 H5 支持弱
    - 变种类型：纯 RTMP 使用 TCP 连接，默认端口 1935（可能被封）；RTMPS：就是 RTMP + TLS/SSL；RTMPE：RTMP + encryption。在 RTMP 原始协议上使用，Adobe 自身的加密方法
；RTMPT：RTMP + HTTP。使用 HTTP 的方式来包裹 RTMP 流，这样能直接通过防火墙；RTMFP：RMPT + UDP。该协议常常用于 P2P 的场景中，针对延时有变态的要求。
  - HTTP-FLV：
