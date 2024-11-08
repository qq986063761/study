// 文件系统模块，常用于读写
const fs = require('fs')

fs.readFile('./mkdir.js', 'utf8', (err, data) => {
  if (err) throw err

  // 写入路径
  const path = './copy.txt'

  /**
   * 判断文件是否存在
   * @param {String} 文件路径
   */
  const isExist = fs.existsSync(path)

  if (!isExist) {
    /**
     * 创建文件写入流
     * @param {String} 文件路径
     */
    fs.createWriteStream(path)
  }

  /**
   * 异步写入文件内容（同步：fs.writeFileSync）
   * @param {String} 写入文件路径
   * @param {String} 写入数据
   * @param {String|Object} 可选项，编码、权限等
   * @param {Function} 回调
   */
  fs.writeFile(path, data, 'utf8', (err) => {
    if (err) throw err
    console.log('文件写入完毕！')
  })
})