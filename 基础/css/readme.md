# 资源
- 《CSS权威指南》;
- 《精通CSS高级Web标准解决方案》;
- 《CSS SECRETS》;
- [csshake](http://elrumordelaluz.github.io/csshake/);
- [animate.css](https://daneden.github.io/animate.css/);
- [hover.css](http://ianlunn.github.io/Hover/)
- [阮一峰-flex弹性布局](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html);
- [mdn css](https://developer.mozilla.org/zh-CN/docs/Web/CSS)
- [传统中国色](https://colors.ichuantong.cn/)
- [css兼容属性网站](https://www.caniuse.com/)
- [radius demo](https://9elements.github.io/fancy-border-radius/)

# css
- 级联（层叠）样式表（Cascading Style Sheets），使显示和内容分离;

# 常用CSS布局
- 一列布局、两列布局、三列布局、混合布局;

# css3 新功能
- 边框、背景（圆角、边框图、阴影、渐变）
- 颜色（透明度、rgba、hsl等）
- 文本（阴影等）
- 盒子（弹性盒子）
- 变形、过渡、动画（transform、transition（只有两帧）、animation（可控制多帧））
- 新选择器（nth-child(n)、[att*="val"]等）
- 单位（vw、vh等）
- css变量

# 流
- 概念：css定位布局机制
- 标准流：从左到右、从上到下布局元素

# 盒模型
- w3c 标准盒子：宽高范围（content）--> padding --> border --> margin
- IE 盒子：宽高范围（content --> padding --> border）--> margin
- 可通过 box-sizing 属性配置盒模型
- padding
  - 百分比：相对父容器 width
- margin
  - 重叠：相邻元素的 margin 值，同正或同负取绝对值较大值作公用 margin，一正一负取相加值做公用 margin（可能为了统一兄弟元素间间距），但是行内框、浮动框、绝对定位框之间的 margin 不会叠加。
  - 百分比：相对父元素 content 宽
  - auto：自动填充剩余空间，默认 0
  - 负值：margin 负值是有效果的，通常用于分栏布局

# 块级元素和内联元素
- 块级元素：一个水平流上，只能单独显示一个元素，多个块级元素则换行显示；块级元素负责结构；
- 内联元素：无法设置宽高，内联元素负责内容；
- display 属性可改变元素的内联或块级特性，让内联元素可以拥有块级元素的特点

# 优先级
- 通常：后加载 CSS 样式，优先于先加载的 CSS 样式
- 特指度（ICE：id、class、element）
  - !important > id选择器（100） > 类、属性、伪类选择器（10） > 标签、关系、伪元素选择器（1）> *通配符（0）
- 作用域：style 属性内联样式 > style 标签外嵌样式 > link 标签外链样式

# float 浮动
- 脱离标准流，停留在元素旁，可设置宽高，不会撑开父元素高
- 清除浮动
  - 子元素设置 display: block; clear: both
  - BFC，父元素设置 overflow: hidden
  - 父元素设置 float

# position
- static：标准流定位，从左向右、从上向下流式定位，默认此定位模式
- relative：相对定位，相对于自己默认定位状态下的相对定位
- absolute：绝对定位，脱离标准流，相对于除 static 之外的第一个定位祖先元素定位
  - 绝对定位对元素的影响
    - inline、inline-block 转成 block
    - inline-flex 转成 flex
    - inline-table 转成 table
    - inline-grid 转成 grid
    - table-* 系列元素转化成 block 形式
    - flow-root、list-item、none 保持不变
    - 不影响 display: contents，因为文本没盒模型
    - transform 属性会影响内部绝对元素的相对定位参照，使内部决定定位元素相对本身定位
    - 默认情况（无中间非 static 定位祖先元素，且无特殊属性祖先元素存在），绝对定位元素相对 html 盒子定位
- fixed：相对 window 固定定位
- sticky：粘性定位，正常情况下按正常流，超出第一个定位祖先元素外时，按指定位置（top、left、right、bottom）定位

# 元素隐藏
- opacity: 0，透明度隐藏，不改变布局，会触发事件
- visibility: hidden，不可见，不改变布局，不会触发事件
- display: none，类似删掉元素，改变布局
- z-index: -1，元素 z 轴层级在背面

# line-height 和 vertical-align
- line-height：百分比相对自身 font
- vertical-align：相对 line-height

# css 上下文
- BFC 块级格式化上下文 Block Formatting Context
  - 性质
    - 内部盒子垂直放置，相邻盒子 margin 重叠；不与外部元素 marign 重叠
    - 内部元素不受外部元素影响也不会影响外部元素
    - 不会和 float 元素重叠，内部浮动元素高度会被算在容器高度中
  - 形成条件
    - 根元素 html
    - 浮动元素 float 不是 none
    - 定位元素 position 不为 relative、static
    - overflow 不是 visible 的块元素
    - display 为 inline-block、table-cell、table-caption
    - 网格元素 display 为 grid 或 inline-grid 元素的直接子元素
  - 应用场景
    - 防止 margin 重叠
    - 清除内部浮动
    - 防止被外部浮动元素覆盖
    - 自适应多栏布局
- IFC（内联格式化上下文）
  - 性质：内部盒子水平放置
  - 形成条件：display 为 inline、inline-block 的外层会形成IFC环境，用于水平居中内联元素或内联元素垂直居中
- GFC（网格布局格式化上下文）
  - 形成条件：display设置为grid、inline-grid
- FFC（自适应格式化上下文）
  - 形成条件：display 设置为flex、inline-flex
  - flex 布局利用主轴和交叉轴的概念来布局
  - flex-grow：拉伸规则默认：0，父容器剩余空间按子元素的 grow 比例来分配，如果容器没有剩余空间，溢出了则无效
  - flex-shrink：收缩规则默认：1，父容器溢出空间按子元素的 shrink 比例来分别压缩对应比率的 size，如果容器没有溢出则无效
  - flex-base：初始 size

# 重绘和重排
- 重绘：导致浏览器同步计算样式
- 重排：导致浏览器同步计算样式和布局
  - 盒子被重新计算
    - el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight, el.offsetParent
    - el.clientLeft, el.clientTop, el.clientWidth, el.clientHeight
    - el.getClientRects(), el.getBoundingClientRect()
  - 滚动
    - el.scrollBy(), el.scrollTo()
    - el.scrollIntoView(), el.scrollIntoViewIfNeeded()
    - el.scrollWidth, el.scrollHeight
    - el.scrollLeft, el.scrollTop
  - 表单
    - input.focus()
    - input.select(), textarea.select()
  - 其他：el.computedRole, el.computedName，el.innerText
  - window.getComputedStyle() 会重新计算样式，部分情况会引发重排
    - 元素在 shadow tree（一种web组件结构，可通过 attachShadow，createShadowRoot 创建 shadow dom 构成 shadow tree）中
    - 媒体查询
      - min-width, min-height, max-width, max-height, width, height
      - aspect-ratio, min-aspect-ratio, max-aspect-ratio
      - device-pixel-ratio, resolution, orientation
    - 获取下面的属性
      - height, width
      - top, right, bottom, left
      - margin [-top, -right, -bottom, -left, 或简写] ，仅当 margin 是固定值。
      - padding [-top, -right, -bottom, -left, 或简写] ，仅当 padding 是固定值。
      - transform, transform-origin, perspective-origin
      - translate, rotate, scale
      - webkit-filter, backdrop-filter
      - motion-path, motion-offset, motion-rotation
      - x, y, rx, ry
  - window
    - window.scrollX, window.scrollY
    - window.innerHeight, window.innerWidth
    - window.getMatchedCSSRules() 仅触发重绘
  - 鼠标事件
    - mouseEvt.layerX, mouseEvt.layerY, mouseEvt.offsetX, mouseEvt.offsetY
  - document.scrollingElement 仅触发重绘
  - Range
    - range.getClientRects(), range.getBoundingClientRect()
  - SVG
  - contenteditable

  # 居中
  - 水平居中：
    - 让行内元素居中：text-align: center
    - 已知宽度的块级元素自己居中：margin: 0 auto
    - 绝对定位 + margin-left: -自身宽/2
  - 垂直居中：
    - line-height 等于自身 height，内部元素居中
    - flex 元素设置 align-items: center；内部元素居中
    - table布局
  - 水平垂直居中：
    - absolute + transform
    - flex + justify-content + align-items
    - 父 flex，子 margin: auto

# @import 和 link 的区别
- @import 只能加载css，而且是页面加载完之后再加载
- link 功能多，支持很多 rel，可以被 js 动态引入，兼容性比 @import 好

