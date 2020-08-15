// 获取当前进程所在环境信息（可读可写）
process.env.NODE_ENV = "production"

// 获取执行命令同时带的参数
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`)
})

