// http模块，常用于客户端、服务端交互
const http = require('http')

// 请求数据
const sendData = JSON.stringify({
  name: 'wanpeng',
  age: 23,
  arr: [1, 2, 3],
  obj: {
    id: 666
  }
})

/**
 * 发起请求
 * @param {Object} 配置
 * @param {Function} 回调
 */
const req = http.request({
  hostname: '127.0.0.1',
  port: 8888,
  path: '/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Content-Length': Buffer.byteLength(sendData)
  }
}, (res) => {
  res.setEncoding('utf8')

  // 监听相应数据
  let data = ''
  res.on('data', chunk => data += chunk)

  // 响应结束事件
  res.on('end', () => console.log(JSON.parse(data)))
})

// 请求错误监听
req.on('error', e => console.error(`请求遇到问题: ${e.message}`))

// 发送请求数据
req.write(sendData)

// 结束请求
req.end()