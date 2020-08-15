// 文件系统模块，常用于读写
const fs = require('fs')

// 同步：fs.readdirSync(path[, options])
fs.readdir('../fs', 'utf-8', (err, files) => {
  if (err) throw err
  console.log(files)
})