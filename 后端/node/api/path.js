// 路径模块，常用于处理目录路径问题
const path = require('path')

let result = ''

// 路径拼接
result = path.join('/wwwroot', 'static_files/png/', '../gif/image.gif')

// 解析成绝对路径（以系统当前执行文件所在路径为头部继续拼接参数）
result = path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')

/**
 * 获取路径结尾的文件名
 * @param {String} 解析路径
 * @param {String} 需要排除的文件扩展名
 */
result = path.basename('/foo/bar/baz/asdf/quux.html', 'x.html')

// 获取参数2相对参数1的相对路径
result = path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')