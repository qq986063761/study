// 手写 call
Function.prototype.myCall = function(cxt) {
  if (typeof this !== 'function') throw new TypeError('Error')
  var context = cxt || window
  context.fn = this // 更换上下文
  const args = [...arguments].slice(1)
  const result = context.fn(...args)
  delete context.fn
  return result
}

// 手写 apply
Function.prototype.myApply = function(cxt) {
  if (typeof this !== 'function') throw new TypeError('Error')
  var context = cxt || window
  context.fn = this
  // 处理参数和 call 有区别，因为 apply 参数2为数组
  var result = arguments[1] ? context.fn(...arguments[1]) : context.fn()
  delete context.fn
  return result
}

// 手写 bind
Function.prototype.myBind = function (cxt) {
  if (typeof this !== 'function') throw new TypeError('Error')
  const self = this
  const args = [...arguments].slice(1)

  return function F() {
    // 针对返回的函数作为类实例化（new F()）时，返回一个实例化函数形式的调用
    if (this instanceof F) return new self(...args, ...arguments)
    return self.apply(cxt, args.concat(...arguments))
  }
}

// 手写 new
function create() {
  var obj = {}
  var Con = arguments[0] // 获取构造器
  obj.__proto__ = Con.prototype
  var result = Con.apply(obj, arguments)
  return result instanceof Object ? result : obj
}

// 手写 instanceof
function myInstanceof(obj, fn) {
  var prototype = fn.prototype
  left = obj.__proto__
  while (true) {
    if (left === null || left === undefined)
      return false
    if (prototype === left)
      return true
    left = left.__proto__
  }
}