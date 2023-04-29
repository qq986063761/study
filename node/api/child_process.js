// 子进程模块
const { exec } = require('child_process')

// 执行终端命令
exec('dir', (error, stdout, stderr) => {
  if (error) {
    console.error(`错误：${error}`)
    return
  }

  console.log(`输出： ${stdout}`)
  console.log(`错误： ${stderr || '无'}`)
})