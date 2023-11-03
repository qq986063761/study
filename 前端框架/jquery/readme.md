# 资源
- [JQuery中文文档](http://jquery.cuishifeng.cn/);
- [JQuery源码解析](http://www.cnblogs.com/aaronjs/p/3279314.html);

# 特点
- sizzle 引擎
- 封装 ajax
- 链式调用

# JQuery.ready 与 window.onload的区别
- DOM文档的加载步骤：
  - 解析HTML结构;
  - 加载样式表文件和外部脚本;
  - 解析执行脚本代码;
  - 构造HTML DOM模型完毕; // ready
  - 加载图片等外部资源;
  - 页面加载完毕; // load

# 无new的构造
- jquery能直接通过 $() 创建一个实例，是因为如下代码：
```js
    JQuery = function (selector, context) { 
		return new JQuery.prototype.init(selector, context);
	} 
```
- new实例放在了JQuery（\$）函数中返回，所以$()本身只是一个函数调用;

# Sizzle引擎
- 逆向查找，所以避免结尾使用通配符效率低下;
- 优化效率建议：
  - 多用ID选择器提高准确查找效率;
  - 多用直接父子选择器，少用后代选择器，提高查找效率;
  - 缓存jQuery对象;
  - 查找尽可能使用 find 查找，因为其它查找中都调用了 find，减少调用层次;

# 为何JQ实例会有JQuery函数对象原型的属性方法
- 因为`JQuery.fn.init.prototype = JQuery.fn`将JQuery函数原型赋值给了真实的构造函数的原型;

# 为什么JQuery中方法能链式调用
- 因为JQuery的每一个原型方法都返回this，而this就是JQuery实例;

# JQuery实例的本质
- JQuery实例实际上是一个类数组对象（伪数组），也就是通过Object创造的key满足数组规律（递增的数值型），值为原生dom对象，带有准确 length 属性 和部分数组方法的对象;