// 系统模块，常用于系统信息判断
const os = require('os')

// 当前系统尾部换行符
console.log(`当前系统的行尾符（windows是\\r\\n，Unix、Linux是\\n）：${os.EOL === '\r\n' ? '\\r\\n' : '\\n'}`)

// 当前系统架构
console.log(`当前系统架构：${os.arch()}`)
