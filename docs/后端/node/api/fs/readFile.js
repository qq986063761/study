// 文件系统模块，常用于读写
const fs = require('fs');

// 查看文件状态
fs.stat('./mkdir.js', (err, status) => {
  if (err) throw err
  console.log('文件信息：', status)
  console.log('是否是文件：', status.isFile())
  console.log('是否是目录：', status.isDirectory())
})

/**
 * 异步读取文件内容（同步：fs.readFileSync）
 * @param {String} 读取文件路径
 * @param {String|Object} 可选项，编码、权限等
 * @param {Function} 回调
 */
fs.readFile('./mkdir.js', 'utf8', (err, data) => {
  if (err) throw err
  console.log('文件内容：' + data)
})