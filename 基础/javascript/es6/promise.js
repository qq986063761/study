var PENDING = 'pending'
var RESOLVED = 'resolved'
var REJECTED = 'rejected'

function checkIsFunction(fn) {
  var isFunction = typeof fn === 'function'
  if (!isFunction) console.error('参数必须是 function 类型')
  return isFunction
}

function MyPromise(fn) {
  var self = this
  // 记录当前 promise 的状态
  this.state = PENDING
  // 记录回调传递的值
  this.value = null
  // 是否执行过 catch
  this.isDoCatch = false
  // 记录 then、catch、finally 的回调函数列表
  this.callbacks = []

  // 成功完成
  function resolve(value) {
    if (self.state === PENDING) {
      self.state = RESOLVED
      self.value = value
      self.callbacks.map(cb => {
        if (cb._type !== 'catch') {
          self.value = cb(self.value)
        }
      })
    }
  }

  // 拒绝
  function reject(value) {
    if (self.state === PENDING) {
      self.state = REJECTED
      self.value = value
      self.callbacks.map(cb => {
        if (self.isDoCatch && cb._type !== 'catch') {
          self.value = cb(self.value)
        } else if (!self.isDoCatch && cb._type === 'catch') {
          self.value = cb(self.value)
          self.isDoCatch = true
        }
      })
    }
  }

  try {
    fn(resolve, reject)
  } catch (err) {
    reject(err)
  }
}

MyPromise.prototype.then = function (callback) {
  if (!checkIsFunction(callback)) return

  callback._type = 'then'
  
  if (this.state === PENDING) {
    this.callbacks.push(callback)
  } else if (this.state === RESOLVED || (this.isDoCatch && this.state === REJECTED)) {
    this.value = callback(this.value)
  }

  return this
}

MyPromise.prototype.catch = function (callback) {
  if (!checkIsFunction(callback)) return

  callback._type = 'catch'
  
  if (this.state === PENDING) {
    this.callbacks.push(callback)
  } else if (!this.isDoCatch && this.state === REJECTED) {
    this.value = callback(this.value)
    this.isDoCatch = true
  }

  return this
}

MyPromise.prototype.finally = function (callback) {
  if (!checkIsFunction(callback)) return

  callback._type = 'finally'
  
  if (this.state === PENDING) {
    this.callbacks.push(callback)
  } else {
    callback()
  }

  return this
}