# 内置对象

# Global
```js
  // 正无穷，不是数值，不存在
  Infinity;
  NaN;
  undefined;

  // eval 解析js
  eval('1 + 1');
  // 判断是否是有限数值
  isFinite(5);
  // 判断是否不是数值
  isNaN('abc');
  // 转十进制整形（原数据，原数据的进制数 2到36）
  parseInt("9999", 10);
  // 转浮点型
  parseFloat("9999.9999");

  // 一次性定时器
  var timer = setTimeout(function () {}, 1000);
  clearTimeout( timer );

  // 间歇性定时器
  var timer = setInterval(function () {}, 1000);
  clearInterval( timer );

  // 内置对象
  Function
  Object
  String
  Number
  Array
  Date
  Boolean
  Math
  JSON
  RegExp
  Error
```

# Number
```js
  // 最大值
  Number.MAX_VALUE

  // 最小值
  Number.MIN_VALUE

  // 负无穷
  Number.NEGATIVE_INFINITY

  // 正无穷
  Number.POSITIVE_INFINITY

  // 最大整数
  Number.MAX_INTEGER

  // 最大安全整数
  Number.MAX_SAFE_INTEGER

  // 最小安全整数
  Number.MIN_SAFE_INTEGER

  // 科学计数法
  Number(124).toExponential(5)

  // 保留小数位数，返回字符串
  (66).toFixed(2)
```

# String
```js
  // 获取对应索引位置的字符
  '1234567890'.charAt(2)

  // 获取对应索引位置的字符所对应的 ascill 码
  '1234567890'.charCodeAt(2)

  // 根据 ascill 码返回对应的字符
  String.fromCharCode(97)

  // 连接字符串，返回新字符串
  '1234567890'.concat(666666666)

  // 查找指定字符串的开始索引（类型会隐式转换），未找到返回-1
  '1234567890'.indexOf(123)

  // 反向查找指定字符串的开始索引（类型会隐式转换），未找到返回-1
  '1234567890'.lastIndexOf(123)

  // 比较两个字符串大小，大于参数则返回1，小于参数则返回-1，等于则返回0
  'ABC'.localeCompare('abc')

  // 将匹配到的所有满足条件的结果合成数组并返回
  '1234567890'.match(/23/g)

  // 功能同indexOf
  '1234567890'.search(/23/g)

  // 替换查找值为指定内容并返回新字符串
  '1234567890'.replace(/23/g, 'www')

  // 剪切字符串，返回剪切后的字符串（参数1：开始索引；参数2：剪切数目），返回新数组
  '1234567890'.slice(0, 6)

  // 同slice
  '1234567890'.substr(1, 6)

  // 裁剪字符串，返回裁剪后的字符串（参数1：开始索引；参数2：结束索引，但不包含）
  '1234567890'.substring(1, 6)

  // 分割字符串，返回分割后的字符串数组（参数1：分隔符，分隔符不包含在结果中）
  '1234567890'.split(/5/g)

  // 移除两端空格，返回新字符串
  '     12    3456   7890    '.trim()

  // 大写转小写（本地化）
  'ASFSAFDDASFASF'.toLocaleLowerCase()

  // 小写转大写（本地化）
  'sfasfasfasfsfdsafsf'.toLocaleUpperCase()

  // 大写转小写
  'ASFSAFDDASFASF'.toLowerCase()

  // 小写转大写
  'sfasfasfasfsfdsafsf'.toUpperCase()
```

# Array
```js
  // 连接数组，返回新数组，返回新的数组引用，内部引用类型不会被深拷贝
  [1, 2, 3].concat([6, 7], [8, 9])

  // 遍历数组，参数2用于上下文this替换
  [1, 2, 3, 4].forEach(function (item, i, arr) {
      console.log(item)
  })

  // 遍历数组，可返回处理后的数组，参数2用于上下文this替换
  [1, 2, 3, 4].map(function (item, i, arr) {
      return item
  })

  // 判断每一个数据是否都满足条件，参数2用于上下文this替换
  [1, 2, 3, 4].every(function (item, i, arr) {
      return item > 0
  })

  // 判断是否有某个数据满足条件，参数2用于上下文this替换
  [1, 2, 3, 4].some(function (item, i, arr) {
      return item > 0
  })

  // 筛选数据，返回新数组引用，内部引用类型不会被深拷贝，参数2用于上下文this替换
  [1, 2, 3, 4].filter(function (item, i, arr) {
      return item > 0
  })

  // 缩减计算，参数2是累计后最后加上的结果，返回最终值
  [1, 2, 3, 4].reduce(function (total, item) { return total * item;}, 10)

  // 反向缩减计算，参数2是累计后最后加上的结果，返回最终值
  [1, 2, 3, 4].reduceRight(function (total, item) { return total * item;}, 10)

  // 排序，回调返回真则替换位置，自身引用也会被改变
  [1, 2, 3, 4].sort(function (a, b) {return b - a;})

  // 倒序，返回倒叙后的数据，本身引用也会改变
  [1, 2, 3, 4].reverse()

  // 正序查找，返回索引，未找到返回-1
  [1, 2, 3].indexOf(2)

  // 倒序查找，返回索引，未找到返回-1
  [1, 2, 3].lastIndexOf(2)

  // 数组转字符串并追加元素之间的连接分隔符并返回
  [1, 2, 3].join('---')

  // 追加数据，返回最终数组长度
  [1].push(3, 4, 5)

  // 删除最后一个元素，返回删除的元素
  [1, 3, 4, 5].pop()

  // 删除第一个元素，返回删除的元素
  [1, 3, 4, 5].shift()

  // 头部追加一个元素，返回数组总长度
  [1, 3, 4, 5].unshift(10)

  // 截取数组，返回新数组，引用类型元素不会被深拷贝
  [1, 3, 4, 5].slice(1, 3)

  // 删除数组元素，删除之后同时可追加元素到删除的开始索引位置，参数1：开始索引、参数2：删除个数、参数3：追加的元素，返回删除的元素数组
  [1, 2, 3, 4].splice(3, 1, 1)

  // 返回字面量化的字符串列表
  [1, 2, 3, 4].toString()

  // 返回数组的本地化字符串表示
  [1, 2, 3, 4].toLocaleString()
```

# Date
```js
  var now = new Date();

  // 获取年份
  now.getUTCFullYear()
  now.getFullYear()

  // 获取月份
  now.getUTCMonth()
  now.getMonth()

  // 获取日期
  now.getUTCDate()
  now.getDate()

  // 获取时
  now.getUTCHours()
  now.getHours()

  // 获取分
  now.getUTCMinutes()
  now.getMinutes()

  // 获取秒
  now.getUTCSeconds()
  now.getSeconds()

  // 获取毫秒
  now.getUTCMilliseconds()
  now.getMilliseconds()

  // 获取星期 0 - 6
  now.getUTCDay()
  now.getDay()

  // 转字符串
  now.toLocaleDateString()
  now.toDateString()
  now.toGMTString()
  now.toISOString()

  // 获取时间戳(毫秒)
  now.getTime()

  // 获取当前时间戳（毫秒）
  Date.now()

  // 解析时间字符串或者日期类型，返回时间戳（毫秒）
  Date.parse('2018/08/08')

  // 设置年、月、日、时、分、秒、毫秒
  now.setFullYear(2015);
  now.setMonth(1);
  now.setDate(1);
  now.setTime(12);
  now.setMinutes(59);
  now.setSeconds(59);
  now.setMilliseconds(9);
```

# Function
```js
  // 定义函数
  function fuc(a, b) {
      this.num = a + b
      // 上下文
      console.log(this, arguments)
  }

  var obj = {num: 0}

  /* 
      apply和call都用于执行并替换函数内部的上下文 this arguments
  */
  fuc.apply(obj, [1, 2])
  fuc.call(obj, 1, 2)

  // bind 用于替换上下文，返回新函数引用
  var bindFuc = fuc.bind(obj, 2, 5)
```

# Error
```js
  // 捕获异常
  try {
      throw new Error('代码异常');
  } catch (err) {
      console.error(err)
  }
```

# RegExp
```js
  // 定义正则，g：全局搜索；i：区分大小写
  var reg = new RegExp(/[a-z]+/g);

  // 正则匹配，返回匹配信息
  reg.exec('aa3&abc')

  // 正则匹配，返回是否匹配成功
  reg.test('aa3&abc')
```

# Math
```js
  // 圆周率
  Math.PI

  // 2的平方根
  Math.SQRT2

  // 2的平方根的倒数
  Math.SQRT1_2

  // 绝对值
  Math.abs(-5)

  // 向上取整
  Math.ceil(4.5)

  // 向下取整
  Math.floor(4.5)

  // 四舍五入
  Math.round(4.6)

  // 最大值
  Math.max(4, 5, 6)

  // 最小值
  Math.min(4, 5, 6)

  // 幂
  Math.pow(4, 2)

  // 随机数 [0 - 1) 之间
  Math.random()

  // 平方根
  Math.sqrt(4)
```

# Ajax
```js
  /*
    AJax概念:
        1、异步的JavaScript和XML，英文称作Asynchronous JavaScript And XML，是一种在 2005 年由 Google 推广开来的编程模式
        2、AJAX不是一种新的编程语言，而是一种使用现有标准的新方法；
        3、AJAX 基于 JavaScript 和 HTTP 请求（HTTP requests）。
    AJax的优势：
        1、不需要跳转页面，直接和服务器进行数据交互，异步加载、可以减少流量
    同步和异步的区别：
        1、异步请求的时候允许程序继续处理后续逻辑、避免网页卡死
        2、同步请求会等待服务器响应成功后才能继续后续逻辑
    AJax请求流程：
        1、实例化HTTP对象
        2、配置HTTP请求
        3、发送请求
        4、监听请求状态、获取响应数据
    XMLHttpRequest对象属性和方法
        1、readyState:请求状态,0（open()调用之前）、1（open()已调用）、2（接受到响应头信息）、3（接收到响应体）、4（响应完成）
        2、status：HTTP状态，200（请求成功）、404（url未在服务器上找到资源）
        3、open：配置请求（参数1：请求方式(get\post)；参数2：url；参数3：是否异步）
        4、send：请求数据（参数：json对象）
        5、onreadystatechange：请求过程的监听事件函数
        6、responseText：响应文本
  */

  var req = new XMLHttpRequest();
  /**
   * 设置请求
   * @param {string} 请求方式
   * @param {string} 目标地址
   * @param {boolean} 是否异步
   */
  req.open('get','server.txt',true);
  req.setRequestHeader('Content-Type','text/plain;charset=UTF-8');
  req.send(null);

  req.onreadystatechange = function(){
      console.info('请求状态' + this.readyState,'HTTP状态' + this.status);
      if(this.readyState === 4 && this.status === 200){
          console.info('请求成功');
          var node = document.createElement('p');
          node.appendChild(document.createTextNode(this.responseText));

          document.getElementById('body').insertBefore(node,document.getElementById('s'));
      }
  }
```

# dom元素操作
```js
/*--------------- dom节点 -----------------*/
// 通过id名获取dom
document.getElementById('id');

// 通过name属性名获取dom数组
document.getElementsByName('name');

// 通过class属性获取dom数组
document.getElementsByClassName('class');

// 通过HTML标签名获取dom数组
document.getElementsByTagName('tag');	

// 通过选择器获取dom	
document.querySelector('tag#id.class');

// 通过选择器获取dom数组
document.querySelectorAll('tag#id.class');

// 通过选择器获取第一个满足条件的祖先dom
dom.closest('body');

// 获取直接祖先dom
dom.parentElement;

// 获取直接祖先节点
dom.parentNode;

// 获取直接子dom数组
dom.children;

// 获取直接子节点数组
dom.childNodes;

// 获取第一个直接子dom
dom.firstElementChild;

// 获取第一个直接子节点
dom.firstChild;

// 获取最后一个直接子dom
dom.lastElementChild;

// 获取最后一个直接子节点
dom.lastChild;

// 获取前一个兄弟dom
dom.previousElementSibling;

// 获取前一个兄弟节点
dom.previousSibling;

// 获取后一个兄弟dom
dom.nextElementSibling;

// 获取后一个兄弟节点
dom.nextSibling;

/*--------------- dom属性 -----------------*/

// 获取dom相对有定位祖先元素的顶部距离像素差
dom.offsetTop;

// 获取dom相对有定位祖先元素的左边界距离像素差
dom.offsetLeft;

// 获取dom实际宽（无法获取display:none元素的宽）
dom.offsetWidth;

// 获取dom实际高（无法获取display:none元素的高）
dom.offsetHeight;

// 元素是否隐藏
dom.hidden;

// 获取dom标签名(大写)
dom.tagName;

// 获取dom的文本内容
dom.textContent;

// 获取dom的直接子dom数
dom.childElementCount;

// 获取dom标签属性
dom.getAttribute('id');

// 获取dom属性map
dom.attributes;

// 获取dom样式（STYLE_NAME指height、border这类样式属性）
dom.style.STYLE_NAME;

// 获取dom类名字符串集合
dom.className;

// 获取dom类名数组
dom.classList

// 获取 dom 真实样式（兼容ie）
var style = window.getComputedStyle
  ? window.getComputedStyle(dom, null)
  : dom.currentStyle;

// 获取dom文本内容字符串
dom.innerText;

// 获取dom内部所有html字符串
dom.innerHTML;

// 获取包含dom本身在内的文本内容字符串
dom.outerText;

// 获取包含dom本身在内的html内容字符串
dom.outerHTML;

// 获取替换元素（input，select，textarea等等）的内容
dom.value;

/*------------------- dom操作 ----------------------*/
// 设置dom属性
dom.setAttribute("id", "10086");

// 判断dom是否存在某属性
dom.hasAttribute('id');

// 移除dom属性
dom.removeAttribute("id");

// 设置dom样式（STYLE_NAME指height、border这类样式属性）
dom.style.STYLE_NAME = STYLE_VALUE;

// 为 dom 添加 class
dom.classList.add("mystyle", "anotherClass", "thirdClass");

// 移除 dom 的 class
dom.classList.remove("mystyle", "anotherClass", "thirdClass");

// 判断 dom 是否包含某些类
dom.classList.contains('myclass', 'otherclass');

// 创建dom元素
document.createElement('div');

// 设置dom包含文本
dom.innerText = 'value';

// 设置dom包含的html内容
dom.innerHTML = '<div>value</div>'

// 设置包含dom本身在内的文本内容（本身被替换）
dom.outerText = 'value';

// 设置包含dom本身在内的html内容（本身被替换）
dom.outerHTML = '<div>newvalue</div>';

// 设置替换元素（input，select，textarea等等）的内容
dom.value = 'value';

// 判断dom是否存在子节点
dom.hasChildNodes();

// 克隆节点，参数是深克隆（即克隆子孙dom）
dom.cloneNode( true );

// 插入新dom元素到本身之前
dom.before( newdom );

// 插入新dom元素到本身之后
dom.after( newdom );

// 插入新dom到本身内部存在的dom元素之前
dom.insertBefore( newdom, exitdom );

// 插入新dom元素到本身所有直接子dom之前
dom.prepend( newdom );

// 插入新节点到本身所有直接子dom之后
dom.appendChild( newdom );

// 插入新dom元素到本身所有直接子dom之后
dom.append( newdom );

// 替换新dom代替本身dom
dom.replaceWith( newdom ); 

// 替换新dom代替本身dom内部的子dom
dom.replaceChild( newdom, olddom );

// 判断dom是否包含子dom
dom.contains( cdom )

// 移除直接子节点
dom.removeChild( cdom );

// 移除dom本身
dom.remove();

/*--------------------- 事件 -----------------------*/

// 定义事件回调
function onclick(ev) {}

// 事件监听
dom.addEventListener('click', onclick, {
  // 是否采用事件捕获（从外到内触发事件）
  capture: true, 
  // 只绑定一次事件
  once: true, 
  // 禁止默认事件 event.preventDefault()
  passive: true
});

// 事件监听
dom.addEventListener('click', onclick);

// 移除事件监听
dom.removeEventListener('click', onclick);

// 事件触发
if (getCurBrowser().indexOf('IE') !== -1) {
  var e = document.createEventObject();
  e.eventType = 'onclick';
  el.fireEvent('onclick', e);
} else {
  var e = document.createEvent("HTMLEvents");
  e.initEvent("click", false, false);
  el.dispatchEvent(e, 'click');
}

/*----------------- bom（浏览器对象模型） -------------------*/		
// 链接信息
location.href;
location.protocol;
location.host;
location.hostname
location.port
location.pathname;
location.search;
location.hash;

// 路由跳转
history.back(); 
history.forward();
history.go(2);
history.pushState(state, title) // 添加修改历史栈
history.replaceState(state, title)
window.addEventListener("hashchange", onChange)

// 系统信息
navigator.appName; 
navigator.appVersion; 
navigator.userAgent; 
navigator.platform; 
navigator.onLine;

// 屏幕信息
screen.availWidth;
screen.availHeight;

// 窗口对象
window.open('https://www.hao123.com/');
window.close();
```