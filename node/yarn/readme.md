# 优点
- 确定性：不管安装顺序如何，相同的依赖关系在任何机器和环境，都可以以相同的方式被安装
- 模块扁平安装：将依赖包的不同版本，按照一定策略，归结为单个版本，以避免创建多个副本造成冗余
- 网络性能更好：请求排队的理念，类似并发连接池，更好地利用网络资源；同时引入了更好的安装失败时的重试机制。
- 缓存机制：实现了离线模式

# 命令
- yarn --version: 查询版本； 
- yarn [install]：安装项目所有依赖； 
- yarn [global] add MODULE [-D]： 安装指定依赖； 
- yarn [global] remove MODULE: 移除模块； 
- yarn info MODULE [field]： 查询依赖信息； 
- yarn global dir: 查询全局模块所在目录； 
- yarn autoclean: 清除不必要的依赖文件；

