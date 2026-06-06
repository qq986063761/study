// 文件系统模块，常用于读写
const fs = require('fs')

/**
 * 创建目录（同步：mkdirSync）
 * @param {String} 目录路径
 * @param {Function} 回调
 */
fs.mkdir('./data', (err) => {
  if (err) throw err
  console.log('目录创建成功！')
})