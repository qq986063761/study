// 文件系统模块，常用于读写
const fs = require('fs')

/**
 * 创建文件读取流
 * @param {String} 文件路径
 * @param {Object|String} 单一或多项配置
 */
rs = fs.createReadStream('./mkdir.js', {
  start: 0,
  end: 10
})

/* 事件监听 */
rs.on('open', fd => {
  console.log('文件被打开：', fd)
})

rs.on('readable', () => {
  console.log('文件可读')
})

rs.on('data', chunk => {
  console.log('正在读 %d bytes: %s', chunk.length, chunk)
})

rs.on('end', () => {
  console.log('读取结束')
})

rs.on('close', () => {
  console.log('文件被关闭')
})

rs.on('error', err => {
  console.log('错误: %s', err.message)
})