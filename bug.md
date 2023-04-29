# 原理

# display: flex 内文本溢出隐藏无效
- 溢出隐藏元素利用 flex 容器内部元素实现，flex:1;overflow:hidden;可以阻止内容撑开

# web

# 网页被缓存
- 可前后端配合，通过当前系统中存的版本号来手动刷新到最新状态

# get 请求数据量限制转 post 表单提交

```js
	// 创建表单
	let formEl = document.createElement('form')
	// post请求
	formEl.method = 'POST'
	// 大数据量传到url
	formEl.action = baseUrl + url

	for (let key in param) {
		const val = param[key]

		if (key) {
			let input = document.createElement('input')
			input.name = key
			input.value = val
			input.type = 'hidden'
			formEl.appendChild(input)
		}
	}

	document.body.appendChild(formEl)
	formEl.submit()
	document.body.removeChild(formEl)
```

# 360兼容模式 onresize 失效
```js
	/**
	 * 兼容360兼容模式的onresize事件绑定
	 * @param {function} callback 业务代码函数回调
	 * @param {object} option 一些选项，option.inherit：是否需要继承已有的onresize
	 */
	compatible360Resize(callback, option = {}) {
		// 如果需要继承以前的resize则继承调用
		if (option.inherit && prevFunc) prevFunc(ev);

		// 避免360兼容模式resize失效
		let resize360Timer = null;
		let resizeFucCache = null;
		let resizeReady = false;

		window.onresize = (ev) => {
			if (prevFunc) prevFunc(ev);

			// 业务代码...
			callback();

			// 兼容360安全模式兼容模式 onresize
			if (!resizeReady) {
				if (resize360Timer) {
					clearTimeout(resize360Timer);
				}
				resize360Timer = setTimeout(() => {
					window.onresize = resizeFucCache;
					resizeReady = true;
				}, 250);
			}
		}

		// 避免360兼容模式resize失效
		resizeFucCache = window.onresize;
	}
```

# 谷歌浏览器中表单元素 autocomplete 属性失效
- 设置 `autocomplete="new-password"`; 

# 滚动容器设置padding后，有的浏览器右下 padding 无效
- padding尽量设置在内容容器上，不要设置在滚动容器上

# table 元素内总存在一些 padding 空间
- 设置 table cellpadding="0" cellspacing="0"

# h5

# 移动端 css active 样式不生效
- 绑定一个空函数到 touchstart 事件上：`document.body.addEventListener('touchstart', () => {});`

# ios 有的版本 -webkit-overflow-scrolling:touch 和 postion 混用后偶尔卡死
- 只有让滚动区域扩大到 window，不采用局部滚动，如使用 scrollload.js 这种库

# input 元素点击多次才聚焦

- 绑定 click 事件， 手动触发聚焦； 

# 300 毫秒点击延时和 promise 不支持
- 300 毫秒延时原理： 为了区分是否是双击留下的规范， 因为移动端经常需要双击放大等场景， 所以 safari 需要通过延时判断； 

```html
<script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
<script>
	if ('addEventListener' in document) {
		document.addEventListener('DOMContentLoaded', function() {
			FastClick.attach(document.body);
		}, false);
	}
	if (!window.Promise) {
		document.writeln('<script src="https://as.alipayobjects.com/g/component/es6-promise/3.2.2/es6-promise.min.js"' + '>' + '<' + '/' + 'script>');
	}
</script>
```

# tap 事件点击穿透
- 原理： touchstart 到 trouchend 后第一次 tap 完成， 300ms 后 event.target 变为背后的元素， 确认触发了 click 导致第二次点击穿透； 
- 解决：
  - 使用缓动动画， 过渡 300ms 延时； 
  - 中间层 dom 元素接受此穿透， 稍后隐藏； 
  - 都使用 tap 事件监听， 实际上 click 事件还是会触发； 
  - 改用 fastclick 库解决 300ms 延迟； 

# touch 事件穿透
- 主要思路是选择合适的时机阻止默认事件
```js
onTouchStart(e) {
	this._startY = e.touches[0].clientY
},
onTouchMove(e) {
	if (!this._childScroller) return

	const y = e.changedTouches[0].clientY
	
	// 向下滑，向上滚动
	if (y > this._startY && !this._childScroller.scrollTop) {
		e.preventDefault() // 禁止默认事件
	} else if (y < this._startY) {
		// 向上滑，向下滚动
		const diff = this._childScroller.scrollHeight - (this._childScroller.scrollTop + this._childScroller.offsetHeight)
		if (diff <= 0) e.preventDefault()
	}
},
// 设置根元素 touch 行为，避免滚动穿透
setTouchAction(isCanTouch, scroller) {
	this._childScroller = scroller || null

	if (isCanTouch) {
		// this.$el.style.height = ''
		// this.$el.style.overflow = ''
		document.body.removeEventListener('touchstart', this.onTouchStart)
		document.body.removeEventListener('touchmove', this.onTouchMove)
	} else if (this._childScroller) {
		// this.$el.style.height = '100vh'
		// this.$el.style.overflow = 'hidden'
		document.body.addEventListener('touchstart', this.onTouchStart, {passive: false})
		document.body.addEventListener('touchmove', this.onTouchMove, {passive: false})
	}
},
```

# IOS 移动端局部容器滑动生硬
```css
	/* -webkit-overflow-scrolling 在新版本 IOS 中容易导致滚动卡死，还是推荐借助第三方库 better-scroll */
	element {
		overflow: scroll;
		-webkit-overflow-scrolling: touch;
	}
```

# 移动端元素点击背景闪烁

```css
	element {
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		tap-highlight-color: rgba(0, 0, 0, 0);
	}
```

# 图片响应式
```scss
	bg-image($url) {
		background-image: url($url + "@2x.png");
		@media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3) {
			background-image: url($url + "@3x.png");
		}
	}
```

# 1px 边框

```scss
	@mixin border-1px($color: #eee, $radius: 2px, $style: solid) {
		position: relative;
		&:after {
			content: "";
			pointer-events: none;
			display: block;
			position: absolute;
			left: 0;
			top: 0;
			transform-origin: 0 0;
			border: 1px $style $color;
			border-radius: $radius;
			box-sizing: border-box;
			width: 100%;
			height: 100%;
			@media (min-resolution: 2dppx) {
				width: 200%;
				height: 200%;
				border-radius: $radius * 2;
				transform: scale(.5);
			}
			@media (min-resolution: 3dppx) {
				width: 300%;
				height: 300%;
				border-radius: $radius * 3;
				transform: scale(.333);
			}
		}
	}

	// 1px after
	@mixin after-1px($dir: bottom, $color: #eee, $style: solid) {
		position: relative;
		&:after {
			content: "";
			position: absolute;
			border-style: $style;
			border-color: $color;
			border-width: 0;
			@if $dir == top {
				top: 0;
				left: 0;
				width: 100%;
				border-bottom-width: 1px;
			} @else if $dir == right {
				right: 0;
				top: 0;
				height: 100%;
				border-left-width: 1px;
			} @else if $dir == bottom {
				bottom: 0;
				left: 0;
				width: 100%;
				border-bottom-width: 1px;
			} @else {
				left: 0;
				top: 0;
				height: 100%;
				border-left-width: 1px;
			}
			@media (min-resolution: 2dppx) {
				@if $dir == top {
					transform: scaleY(0.5)
				} @else if $dir == right {
					transform: scaleX(0.5)
				} @else if $dir == bottom {
					transform: scaleY(0.5)
				} @else {
					transform: scaleX(0.5)
				}
			}
			@media (min-resolution: 3dppx) {
				@if $dir == top {
					transform: scaleY(0.333)
				} @else if $dir == right {
					transform: scaleX(0.333)
				} @else if $dir == bottom {
					transform: scaleY(0.333)
				} @else {
					transform: scaleX(0.333)
				}
			}
		}
	}
```

# 输入框内部阴影

```css
	-webkit-appearance: none;
```

# 禁止文本缩放， 避免字号放大缩小导致页面布局问题

```css
	-webkit-text-size-adjust: 100% !important;
	-moz-text-size-adjust: 100% !important;
	text-size-adjust: 100% !important;
```

# 禁止保存或拷贝图像

```css
	img {
	  -webkit-touch-callout: none;
	}
```

# 字体在移动端比例缩小后出现锯齿

```css
	-webkit-font-smoothing: antialiased;
```

# 去除 type 为 number 的箭头

```css
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none !important;
		margin: 0;
	}
```

# input、textarea、select 自动填充颜色

```css
	input:-webkit-autofill,
	textarea:-webkit-autofill,
	select:-webkit-autofill {
		-webkit-box-shadow: 0 0 0 1000px white inset;
	}
``` 

# 安卓webview中H5的footer不随键盘弹起

- 让安卓开发设置 fitsSystemWindows 属性

# IOS H5键盘弹起后，网页不回到底部，只显示半截
- [掘金](https://juejin.im/post/5ccf81d66fb9a03234165b85)
```js
	var iosFlag = false;
	var iosTimer = null;

	// 兼容 IOS 软键盘收起后浏览器不恢复高度问题
	document.body.addEventListener('focusin', () => {  // 软键盘弹起事件
		iosFlag = true;
		clearTimeout(iosTimer)
	})

	document.body.addEventListener('focusout', () => { // 软键盘关闭事件
		iosFlag = false;
		if (!iosFlag) {
			iosTimer = setTimeout(function() {
				window.scrollTo({top: window.scrollY, left: 0, behavior:"smooth"})
				// window.document.body.scrollTop = window.document.body.scrollHeight
				// window.document.documentElement.scrollTop = window.document.body.scrollHeight
			}, 200)
		} else {
			return
		}
	})
```

# H5 键盘挡住输入框（目前我遇到的情况没有效果）
- focus 时利用方法 el.scrollIntoView() 和 el.scrollIntoViewIfNeeded() 定位视图

# H5 键盘弹起，底部用于评论的输入框移动上去很多，并不是紧贴底部
- 通常是利用 window 滚动时候，内容过多向上滚动导致，可在input获取焦点之后将body等外层容器高度固定不让其撑开 window

# 避免 h5 window 回弹效果 
```css
html {
	position: fixed;
	overflow: hidden;
	height: 100%;
	width: 100%;
}
```

# 第三方插件

# wangeditor
- 部分苹果浏览器， 跨浏览器复制带有不必要的 style 样式， 提交时在显示端内容错误； 可以通过匹配正则 `htmlStr.match(/<style([\S\s\t]*?)<\/style>/gi)` 找出所有不必要的style标签内容遍历删除掉； 

# 阿里云播放器兼容浏览器播放（谷歌、 IE、 火狐）
- 播放器文档链接： 
- [前端调用接口文档](https://help.aliyun.com/document_detail/62941.html?spm=a2c4g.11174283.6.720.qQuypR)； 
- [常见问题](https://help.aliyun.com/knowledge_detail/57421.html?spm=a2c4g.11186623.4.2. YaaNqr)； 
- 谷歌： 自带flash， 无需兼容； 
- 火狐： 需要下载火狐专用flash插件， 下载地址见[flash中国下载官网](https://www.flash.cn/)， 其它平台版本中有火狐专用版； 
- IE： 解决链接[阿里播放器文档IE问题栏](https://answers.microsoft.com/zh-hans/ie/forum/ie11-iewindows8_1/windows-81ie/99696880-fbd9-4ac4-b43c-45fbb06f84e5?spm=a2c4g.11186623.2.4. ScZWkW)； 
- Edge： 不支持flash； 

# 模块： quill-image-resize-module， 报错： Cannot read property 'imports' of undefined
- 原因是： window. Quill找不到， 解决办法是使用插件： new webpack.ProvidePlugin({'window. Quill': 'quill'})

# 小程序 we-cropper插件和Array原型定义冲突
- 使用 `we-cropper` 插件时， 因为项目小程序上在 `Array` 原型上定义了方法， 导致真机上截图滑动黑屏， 所以想使用此插件不能定义 `Array` 上的原型； 

# 小程序 wxParse插件解析html不兼容部分安卓机型
- 因为标签中class和style属性不兼容， 可采用正则去掉这两个属性； 
- 或者将 html2json.js 源文件中 console.dir 表达式注释掉； 
