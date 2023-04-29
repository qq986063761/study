// 文件系统模块，常用于读写
const fs = require('fs')

/**
 * 异步复制文件内容（同步：fs.copyFileSync）
 * @param {String} 源文件路径
 * @param {String} 目标文件数据
 * @param {Function} 回调
 */
fs.copyFile('content.txt', 'contentCopy.txt', err => {
  if (err) throw err
  console.log('文件复制完毕！')
})