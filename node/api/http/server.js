
// http模块，常用于客户端、服务端交互
const http = require('http')

/**
 * 创建服务（谷歌浏览器可通过 fetch('http://localhost:8888', {method: 'POST', body: JSON.stringify({name: 'wanpeng'})}) 模拟请求）
 * @param {Function} 可选 接收请求的回调
 */
const server = http.createServer((req, res) => {
  // 响应头
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "X-Requested-With", // X-Test-Cors
    "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
    'Content-Type': 'application/json'
  })

  // 监听客户端数据传输（通常数据是字符串）
  let buff = ''
  req.on("data", chunk => buff += chunk)

  // 客户端数据接收完毕
  req.on("end", () => {
    // 响应数据给客户端
    res.end(JSON.stringify({
      success: true,
      data: JSON.parse(buff || '{}'),
      message: '请求成功！'
    }))
  })
})

// 客户端出错
server.on('clientError', (err, socket) => {
  socket.end('400 请求出错！')
})

// 端口号监听
server.listen(8888, () => {
  console.log('服务启动成功，端口号：8888！')
})