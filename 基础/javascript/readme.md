# 推荐
- 《javascript权威指南》
- [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/)
- [es6](http://es6.ruanyifeng.com/)

# 简介

## javascript
- 语言类型：
	- 解释性语言：借助解释器（js 引擎）解释成机器语言，让计算机识别运行，效率低
	- 编译性语言：生成的程序已经是二进制代码程序，运行时计算机可直接识别运行，效率高
- 运行环境：浏览器、node.js 环境


# 原理

## 变量类型
- 原始类型：undefined、null、boolean、string、number、symbol、bigint
	- 特点：自身不可变（比如：str[0] = 1；str.slice(1) 执行后，str本身不会变，但是 str += '1' 这种操作是新开辟了栈内存，并转移了 str 指向新字符串）
- 对象（饮用）类型（object）：Array、Date、Function、RegExp、Math...
	- 特点：空间大，运行效率低，通过引用地址读取（地址存在栈中）
- 判断数据类型的方法
 - typeof：一般用于判断基础类型（typeof null === 'object' 是因为底层 null 的地址开头就是用于判断 object 的开头）
 - instanceof：一般用于判断引用类型
 - Object.prototype.toString.call(value)

## 变量提升
- 函数定义时：会将整个函数内容提升到作用域顶部
- 变量定义时：只会把变量声明提升到作用域顶部，不会提升赋值部分
- var 定义变量能在声明之前使用，全局作用域下声明会挂载在 window 上；let、const 不能在声明前使用

## 类型转换
- Number(param) 规则
	- true 和 false 分别转成 1 和 0
	- 数字则返回自己
	- null 返回 0
	- undefined 返回 NaN
	- 字符串
		- 只包含数字，返回十进制
		- 有效浮点值，返回浮点数
		- 空字符串返回 0
		- 其他返回NaN
	- symbol：报错
	- 对象：如果存在[Symbol.toPrimitive]方法，则调用，否则调用对象 valueOf 方法获取值
- Boolean(param) 规则
	- undefined、null、false、''、0（+0和-0）、NaN 返回 false，其他都是 true
- Object 转换规则
	- 优先按 [Symbol.toPrimitive] 方法转换
	- 否则按 valueOf 和 toString 方法转换
- '==' 隐式转换规则
	- 两边类型相同不会转换
	- 其中一个值是 null、undefined，则另一个值必须是 null、undefined，否则返回 false
	- 其中一个是 symbol，返回 false
	- 两个都是 string、number，则先将 string 转成 number 再比较
	- 如果一个是 boolean，则转换成 number 再比较
	- 如果一个是 object 则转换成原始类型，再比较
- '+' 隐式转换规则
	- 其中一个是字符串，则作为字符串拼接，另一个是对象则调用对象的转换方法（[Symbol.toPrimitive]、toString、valueOf）后再拼接
	- 其中一个是数字，则另一个先转换成数字再计算，对象则和上面一样转换

## 原型和原型链
- 原型：函数的 prototype 属性，关联实例属性、方法
```js
	function Parent() {
		// 实例独有属性
		this.privateProp = VALUE
		this.privateMethod = function() {}
	}
	Parent.prototype = {
		// 所有实例共有属性
		commonProp: VALUE,
		commonMethod: function() {}
	}
	// 通过类创建实例
	var pObj = new Parent()
```
- 原型链：所有对象的 __proto__ 属性，指向实现父类原型，instanceof 的原理就是根据原型链来判断的
```js
	pObj.__proto__ === Parent.prototype
	Parent.prototype.__proto__ === Object.prototype
	Object.prototype.__proto__ === null
```

## new 的原理
- 创建了一个空对象 obj = {}
- 链接原型（obj.__proto__ = Constructor.prototype）
- 以 obj 作为上下文来执行构造函数
- 返回对象 obj

## 执行上下文
- 概念：js 当前执行代码环境提供的对象（如：this、arguments）
- 原理：
	- js 解释器初始化为全局执行环境
	- 每当执行函数时，将函数内部执行环境压入执行栈，内部如果还有执行函数则递归压栈
	- 函数执行完毕后，当前执行上下文出栈，替换为上一个函数的执行上下文
- 执行栈：用来保存 js 函数调用的栈结构存储空间；

## 作用域、作用域链
- 作用域：变量能被访问的范围；
	- es5: 全局作用域、函数作用域；
	- es6: 块级作用域（let、const 存在暂时性死区，定义前不能被访问）
- 作用域链：局部作用域 --> 全局作用域之间的访问链

## 闭包
- 可访问其他函数作用域的函数；如 IIFE（立即执行函数）
- 作用：可存储值（内部函数可访问外部函数内的变量，外部变量会一直被存储）、避免变量污染
- 缺点：可能造成内存泄漏（老浏览器垃圾清理机制认为变量在使用中，则不会释放内存）

## call、apply、bind
- 作用：替换上下文 this
- call：fn.call(ctx, p1, p2, p3)，直接调用函数，参数以参数列表形式传递
- apply：fn.apply(ctx, [p1, p2, p3])，直接调用函数，参数以数组形式传递
- bind：fn.bind(ctx)，返回新函数，调用新函数内部上下文是更换后的上下文对象

## 回调函数
- 函数作为参数，传递给另一个函数，另一个函数内部可按需调用参数函数

## 同步和异步
- 同步：程序等待执行，缺点：阻塞线程
- 异步：程序不等待执行，如果想获取异步结果，需要通过回调

## 事件冒泡和事件捕获
- 捕获：事件由 window 向事件注册元素一层层触发
- 冒泡：事件由事件注册元素向 window 一层层触发
- 避免冒泡：调用 event.stopPropagation() 阻止冒泡、或通过 event.target 判断是否需要执行逻辑
- [冒泡捕获demo](http://jsbin.com/exezex/4/edit?js,output)

## JSON格式
- 概念：轻量数据交互格式，如：{"name": "lihao", "age": 24, "arr": [1, 2, 3], "obj": {}}
- JSON.stringify 将 json 数据转化为字符串，JSON.parse、eval 将 json 字符串转化为 json 对象

## 事件循环（Event Loop）
- 任务队列中的代码，按规律压入执行栈中被执行的过程
- 任务分类：宏任务 macro-task、微任务 micro-task
	- 宏任务：script、setTimeout、setInterval、setImmediate、postMessage、MessageChannel、I/O（网络请求文件读写）、UI（用户交互）、rendering（页面渲染）；
	- 微任务：process.nextTick、Promise、Object.observe、MutationObserver、queueMicrotask（将方法推入微任务队列中）；
- 一次事件循环流程
	- 先取一个宏任务执行（第一次是 script 脚本加载和同步代码执行）
	- 再执行完一次循环队列中的所有微任务
	- 有必要会渲染页面

## 内存管理（GC：垃圾回收）
- js 创建变量时分配内存，不使用变量时释放内存
- 内存生命周期
  - 分配需要的内存
  - 使用分配到的内存（读、写）
  - 不需要时释放
- 垃圾回收机制
	- 引用计数（旧 js 引擎内存回收算法）：一个变量，每次被引用，会增加此变量的引用计数，当引用计数减少到0说明没有任何地方引用它，则自动释放之前占用的内存
	- 标记清除-标记整理（现代浏览器）：从根域开始，向下搜索所有的对象，将使用中的对象进行标记，未使用的对象进行清除；产生的内存碎片通过标记整理来管理内存碎片
	- 新生代（Scavenge GC 算法）：将内存空间分为 from 和 to 两部分，新分配的对象被放入 from 中，当 from 空间占满时，检查 from 空间中被使用的对象复制到 to 空间，未被使用的对象进行销毁，然后再互换 to 和 from 空间
- 导致内存泄漏的因素：
	- 未置空的全局变量
	- 未释放的定时器
	- 未销毁的事件
	- 闭包中保留的外部变量引用

# Ajax

## ajax
- Asynchronous Javascript And XML（异步的 javascript 和 xml），是一种无需重新加载整个网页的情况下，能够更新部分网页的技术

## 跨域
- 请求目标的主机名、协议、端口号，和请求方不同则是跨域请求，js 中可通过 jsonp 或设置代理解决
- 解决跨域请求
	- jsonp：利用 script 标签跨域，将参数和接收回调通过 src 属性发起请求，然后由服务器触发回调传递响应数据，适合 get 请求
	```js
		function jsonp(url, jsonpCallback, success) {
			const script = document.createElement('script')
			script.src = url
			script.async = true
			script.type = 'text/javascript'
			window[jsonpCallback] = function(data) {
				success && success(data)
			}
			document.body.appendChild(script)
		}
	```
	- 代理服务：利用中间代理服务允许跨域，然后将请求转发给后台
	- 服务端配置响应头 Access-Control-Allow-Origin

# 优化

## 函数柯里化
- 把接受多个参数的函数变换成接受一个单一参数的函数，并能保留创建此单一参数的函数外以前的其它参数
```js
	const getNewFuc = function (srcParam, ...addParams) {
		return function (srcParam) {
			return addParams
		}
	}
```

## 尾调用(Tail Call)
- 函数内返回一个函数调用，如果返回的是自身则是尾递归
```js
	function f(x) {
		return g(x)
	}
```

## 大数据量 dom 加载优化
- 利用 requestAnimationFrame 帧动画优化加载体验

# 模块化

## 模块系统出现原因
- 原生加载方式全局作用域下容易造成变量冲突
- 文件只能按照`<script>`的书写顺序进行加载
- 开发人员必须主观解决模块和代码库的依赖关系
- 在大型项目中各种资源难以管理，长期积累的问题导致代码库混乱不堪

## CommonJS
- 概念：允许通过  exports、module.exports 导出模块，通过 require 导入模块，nodejs采用此规范
- 优点：在服务端模块便于重用，npm 中的模块包非常多
- 弊端：同步执行，不能用于异步需求
- require 特点：支持动态导入、同步导入、导出的是值的拷贝不影响原数据；

## AMD（异步的模块定义规范）
- 概念：通过 require 作为入口文件中导入模块的方法，主要通过 define(id?, dependencies?, factory) 定义模块（定义时可将依赖的其它模块依赖前置）和导入模块，在 define 中通过 return 导出模块，requirejs 采用此规范
- 优点：异步，适合异步加载模块
- 弊端：异步比较难以控制流程

## CMD（通用模块定义规范）
- 概念：通过 define(function(require, exports, module) {}) 定义模块，内部 require 导入模块， exports 或 module.exports 向外提供 api，与 commonjs 规范保持了很大兼容性，sea.js 则采用此规范
- 优点：延迟执行，容易在 node 中运行
- 弊端：依赖 SPM 打包，模块加载逻辑重（多次加载相同模块，会产生相同代码）

## ES6（EcmaScript6 标准增加的 JavaScript 语言的模块定义）
- 概念：通过 import [from] 导入模块，export [default] 导出模块
- 优点：编译时就确定依赖关系，提高运行效率（CommonJS、AMD 都是运行时确定依赖关系）
- 弊端：兼容性一般
- import 特点：不支持动态导入、异步导入、导出的是引用对象

## UMD规范（通用模块定义 Universal Module Definition）
- 概念：兼容 AMD 和 CommonJS 规范，先判断是否支持 CommonJS 模块 api，再判断是否支持 AMD 规范 api，采取可行的方案执行


# 架构

## MVC
- 概念：View（视图层/客户端）-> Controller（控制层）-> Model（数据层）-> View
- 特点：各部分通信都是单向的
- 缺点：controller 层责任大，容易导致臃肿，不利于维护

## MVP
- 概念：Model（数据层）<--> Presenter（控制层，包含视图逻辑）<--> View（视图层，不与Model交互）
- 特点：解耦了 View 和 Model，Presenter 统一与 View 和 Model 进行双向通信

## MVVM
- 概念：View（视图层）<--> ViewModel（视图数据模型，双向绑定引擎）<--> Model（数据层）
- 特点：视图和数据模型分离，数据双向绑定，低耦合（视图和模型可以独立改变互不影响）、可重用（视图逻辑可重用）、独立开发（开发人员可专注于业务逻辑和数据开发（VM 层））、可测试（测试可单独针对VM层来写）