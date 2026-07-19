# 资源
- [es6](http://es6.ruanyifeng.com/)

# 变量声明
```js
  // 具有作用域的变量声明
  let value = null 
  // 具有作用域的常量声明
  const BLACK = '#000' 

  // es6 的变量声明包含 var、function、let、const、import、class
```

# String
```js
  // 字符串可以用 for of 遍历

  // 模板字符串（支持多行、变量）
  `safasfsaf${1231}fsfsaf`

  // 字符串中是否包含指定参数字符串
  '6688'.includes('66')

  // 是否以参数字符串开头
  '1116'.startsWith('111')
  // 是否以参数字符串结尾
  '66888'.endsWith('888')

  // 重复字符串，参数是重复次数
  '1'.repeat(88)

  // 向前补全字符串（补全长度，补全用的字符串）
  '5'.padStart(5, '1234')
  // 向后补全字符串（补全长度，补全用的字符串）
  '5'.padEnd(5, '6789')
  
  // 消除字符串头部空格
  '  sfsaf'.trimStart()
  // 消除字符串尾部空格
  'sfsaf  '.trimEnd()

  // 获取匹配到的所有满足条件的信息迭代对象，可以用
  'a,a,a,a,a'.matchAll('a')
```

# Number
```js
  // 二进制和八进制表示
  Number(0b11101111)
  Number(0o767)

  // 数值是否是整数
  Number.isInteger(25.1)
  // 数值是否是在js安全精度数值范围内的整数（数值存储为64位双精度格式）
  Number.isSafeInteger(9007199254740990)

  // 去除数值小数位
  Math.trunc(-0.1234)
  // 判断是正数（返回1）、负数（返回-1）、0（返回0）
  Math.sign(-5)
  // 求立方根
  Math.cbrt(1)
  // 求所有参数平方和的平方根（可用于勾股定理）
  Math.hypot(3, 4)
  // 求 1 + x 的自然对数，相当于：Math.log(1 + x)
  Math.log1p(x)
  // 求 10 为底 x 的对数
  Math.log10(x)
  // 求 2 为底 x 的对数
  Math.log2(x)

  // 指数，Math.pow(2, 2)
  2 ** 2
```

# Function
```js
  // rest 展开参数替代
  // 函数支持默认参数
  // 最后一个参数支持逗号
  // arguments，箭头函数（作用域继承，箭头函数直接返回对象要加上小括号，否则会因为被认为是作用域而报错）
  const fuc = (...args, x = 0,) => ({
    // 函数名
    name: fuc.name
  })

  // try catch 允许 catch 省略参数 err
  try {} catch {}
```

# Array
```js
  // 判断是否是数组
  Array.isArray([])

  // 扩展运算符
  [1, ...[2, 3]].push(...[3, 4])

  // 可将类数组对象和可遍历对象，转成数组
  Array.from({
    '0': 'a',
    '1': 'b',
    length: 2
  })

  // 将参数转为数组
  Array.of(3, 11)

  // 用参数2到参数3索引范围内的值覆盖掉参数1为索引的值（覆盖开始位置，开始读取的索引，结束读取的索引）
  [1, 2, 3, 4, 5].copyWithin(0, 3, 5)

  // 返回第一个满足条件的值，找不到则返回undefined
  [1, 5, 10, 15].find(val => val > 9)

  // 返回第一个满足条件的索引，找不到则返回-1
  [1, 5, 10, 15].findIndex(val => val > 9)

  // 填充数组（填充元素，填充开始位置，填充结束位置）
  ['a', 'b', 'c'].fill(7, 1, 2)

  // 获取数组的 key 的迭代对象，类似[0, 1]，可用 for of 遍历
  ['a', 'b'].keys()
  // 获取数组的 value 的迭代对象，类似['a', 'b']，可用 for of 遍历
  ['a', 'b'].values()
  // 获取数组的键值对迭代对象，类似[[0, 'a'], [1, 'b']]，可用 for of 遍历
  ['a', 'b'].entries()

  // 是否包含某值（包含元素，判断的起始位置）
  [1, 2, 3].includes(3, 1)

  // 展平数组（展平层数）
  [1, 2, [3, 4, [5, 6]]].flat(Infinity)
  
  // 遍历数组，将返回值组成的数组再进行一次 flat 方法
  [2, 3, 4].flatMap(x => [x, x * 2])
```

# Object
```js
  // 属性简写，属性名支持表达式，扩展运算，方法简写
  let obj = {
    name,
    [value]: true,
    ...{value: 1},
    callback() {}
  }

  // 获取对象某一个属性的配置描述信息
  // 遍历对象建议使用 Object.keys 代替 for in，因为 for in 会遍历不可被枚举对象
  Object.getOwnPropertyDescriptor({name: '213'}, 'name')
  // 获取对象所有属性的配置描述信息
  Object.getOwnPropertyDescriptors({a: 1})
  // 获取对象的原型对象
  Object.getPrototypeOf({})
  // 设置对象原型（已有对象，原型对象）
  Object.setPrototypeOf({}, {})

  // 判断是否完全相等
  Object.is(1, 1)

  // 浅拷贝
  Object.assign({a: 0}, {a: 1, b: 2}, {c: 3})

  // 返回 key 的迭代对象，类似 ['name', 'age']
  Object.keys({name: '666', age: 12})
  // 返回 value 的迭代对象，类似 ['666', 12]
  Object.values({name: '666', age: 12})
  // 返回 key 和 value 的迭代对象，类似[["name", "666"], ["age", 12]]
  Object.entries({name: '666', age: 12})
  // 将键值对数组转换为对象，Object.entries 的逆操作
  Object.fromEntries([
    ['name', 'asfasf']
  ])
```

# Symbol
```js
  // 能保持唯一的对象
  var s = Symbol("name")
  var obj = {[s]: true}
  // 获取对象的 symbol 类型 key
  Object.getOwnPropertySymbols(obj)
  // 获取已经存在参数对应的 Symbol 值，没有则返回新的值
  s = Symbol.for('name')
  // 获取一个 Symbol 值所登记的字符串，Symbol.for 定义的变量才存在登记 key
  Symbol.keyFor(s)
```

# Set 和 Map
```js
  // 特性：成员不会出现重复
  // 参数：（用于初始化的数组）
  var set = new Set([1, 2])
  // 追加值
  set.add(666)
  // 删除值
  set.delete(666)
  // 判断是否包含值
  set.has(666)
  // 清除所有值
  set.clear()
  // 获取迭代对象，支持 forEach 遍历
  set.keys()
  set.values()
  set.entries()
  // 长度
  set.size

  // 特性：键值对的集合
  // 支持 .keys() .values() .entries() .forEach() for of 遍历
  var map = new Map([
    ['age', 16]
  ])
  // 设置值
  map.set('name', '666')
  // 获取值
  map.get('name')
  // 判断是否包含某值
  map.has('name')
  // 删除
  map.delete('name')
  // 获取长度
  map.size
  // 清除所有值
  map.clear()

  // WeakMap 其他方法和 Map 一样，但是只接受 object 作为 key
```

# Proxy
```js
  // 代理对象，用于拦截对象行为
  var obj = new Proxy({}, {
    // 拦截对象读取（代理目标对象，代理key，代理对象）
    get: function (target, key, receiver) {
      return target[key]
    },
    // 拦截对象赋值
    set: function (target, key, value, receiver) {
      target[key] = value
      return value
    }
  });
```

# Reflect（用于存放和语言内部相关的方法）
```js
  // 定义对象属性描述配置
  Reflect.defineProperty({}, 'name', {
    // 是否能改变属性描述配置
    configurable: true,
    // 是否可枚举（能被遍历到这个属性）
    enumerable: true,
    // 属性值，和 get 方法不能同时存在
    value: null,
    // 允许属性值可被赋值（是否可写），和 set 方法不能同时存在
    writable: true,
    // 拦截获取值过程
    get() {
      return ''
    },
    // 拦截赋值过程
    set(value) {

    }
  })

  // 返回包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举
  Reflect.ownKeys({a: 1})
```

# Promise
```js
  // 一种异步编程解决方案
  var p = new Promise((resolve, reject) => {
    setTimeout(
      () => true ? resolve({success: true}) : reject({success: false, message: 'error'}), 
      1000
    )
  });
  // resolve 执行后触发
  p.then(res => console.log(res))
  // reject 执行后触发
  p.catch(error => console.log(error))
  // 总是会在 resolve 或 reject 之后触发
  p.finally(() => console.log('完成'))

  // 包装多个 promise，状态都为 resolve，或一个被拒绝则完成，返回新的 promise 对象
  var all = Promise.all([p, p])
  // 包装多个 promise，某个 promise 状态先改变则完成，返回新的 promise 对象
  var one = Promise.race([p, p])
  // 包装多个 promise，状态都被改变后，才完成，返回新的 promise 对象
  var all = Promise.allSettled([p, p])
  // 包装多个 promise，一个状态为 resolve，或全被拒绝则完成，返回新的 promise 对象
  var any = Promise.any([p, p])

  // 直接返回一个 resolve 状态的 promise 实例
  Promise.resolve('success')
  // 直接返回一个 reject 状态的 promise 实例
  Promise.reject('error')
```

# Generator 函数
```js
  // 定义 Generator 函数，返回一个迭代对象
  function* FnGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
  }
  var h = FnGenerator();
  // 需要手动执行 next 执行下一个状态
  hw.next() // { value: 'hello', done: false }
  hw.next() // { value: 'world', done: false }
  hw.next() // { value: 'ending', done: true }
  hw.next() // { value: undefined, done: true }
```

# 异步函数
```js
  // 更优雅的异步操作
  async function getData() {
    await getData1()
    await getData2()
  }
```

# Class
```js
  // 类：替代 es5 构造函数创建实例的方案，一类模板
  class Animal {
    // 实例属性
    value = null,

    // 构造函数
    constructor(name) {
      // 属性
      this.name = name
    }

    // 拦截赋值
    set value(val) {
      this.value = val
    }
    // 拦截取值
    get value() {
      return this.value
    }

    // 方法(static：静态属性，不会被实例继承，直接通过类调用，所以内存空间只占用一份)
    static say() {
      alert(this.name)
    }
  }

  // 继承
  class Dog extends Animal {
    constructor(name) {
      // 调用父类构造函数
      super(name)
    }
    
    say() {
      alert(this.name)
    }
  }
```

# Module 模块化
```js
  // 向外定义接口（接口可以是任何对象）
  export function fn() {} 
  // 或者先定义再导出
  export { fn }
  // 从其它模块导入需要的对象
  import {fn} from 'module.js'
  // 默认导出，外界不用知道内部包含哪些对象
  export default function fn() {} 
  // 默认导入所有模块
  import defModule from 'default-module.js'
  // 动态导入模块，避免动态导入时报错，因为 import 只能放在代码头部
  import('async-module.js').then(mod => {mod.method}).catch()
```