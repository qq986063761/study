# 资源
- [文件系统学习](http://www.jianshu.com/p/5683c8a93511)
- [http模块学习](https://my.oschina.net/freddon/blog/513853)
- [package.json](http://mujiang.info/translation/npmjs/files/package.json.html)
- [npm](https://www.npmjs.cn/)
- [pnpm](https://pnpm.io/zh/)
- [yarn](https://yarn.bootcss.com/)
- [pm2](https://pm2.keymetrics.io/)
- [Koa 官网](https://koa.bootcss.com/)
- [Koa 进阶](https://chenshenhai.github.io/koa2-note/note/project/framework.html)
- [express](https://expressjs.com/zh-cn/)
- [prerender-spa-plugin](https://www.npmjs.com/package/prerender-spa-plugin)
- [monorepo](相似包多项目统一管理)
- [vitest](https://cn.vitest.dev/)
- [jest](https://www.jestjs.cn/)

# 特点 
- 基于 Chrome V8 引擎， 高效的服务端 js 运行环境
- 事件驱动（事件队列管理整个流程）、 非阻塞 I/O 模型（异步回调）
- node 包管理器 npm, 是全球最大的开源库生态系统

# 单线程缺陷
- 无法利用多核 cpu
- 一旦出错程序崩溃
- 大量计算占用 cpu 导致无法调用异步 io

# 应用场景
- 适合 io 密集型应用（读写磁盘， 如：读文件中某字符串）
- 不适合 cpu 密集型应用（运算， 如矩阵等数学方面的复杂运算类应用）， 但也提供了应付此场景的接口， 如：C 和 C+- 接口

# npm 命令
- 初始化node项目：npm init（会创建 package.json 文件）
- 安装模块：npm i [模块名] [-g] [-S或-D]
- 卸载模块：npm un [-g] 模块名
- 升级模块：npm up [-g] [模块名]
- 查看安装的包信息：npm ls [-g] [模块名]
- 查看帮助文档：npm help
- 查看包安装的根目录：npm root [-g]
- 查看版本：npm version
- 验证缓存，可能会清除缓存：npm cache verify
- 清除缓存：npm cache clean --force
- 重新编译构建模块：npm rebuild 模块名（用于解决包和环境不匹配的报错）
- 添加一个npm账号：npm adduser
- 登录账号：npm login
- 退出账号：npm logout
- 发布项目到npm：npm publish
- 获取仓库源地址：npm config get registry
- 设置仓库源地址：npm config set registry https://registry.npm.taobao.org（默认是：npm config set registry https://registry.npmjs.org/）

# npm 包发布流程
- 需要一个 npm 账号（npm adduser)
- 需要登陆 npm 账号（npm login)，账号如：npm.wanpeng
- 在自己的 node 项目下通过命令 npm publish 发布
- 注意点
  - 需要 `npm` 账号是登陆状态； 
  - 需要配置好 `package.json` 的 `main` 属性用于表示导出模块
  - 每次发布版本号必须不同， 所以从 0.0.0 开始用于测试
  - 注意我们提供的包的用户导入方式和我们的导出方式保持一致（模块化）

# 好用的 npm 模块
- live-server：提供本地服务
- live-server-https：配合 live-server 模拟 https 环境

# 运行项目超出 node 默认运行内存
- 可以在运行命令时， 采用 "node --max-old-space-size=8192" 的形式运行来扩大 node 运行内存

# vscode 调试 npm 脚本
- 先配置一条 npm 脚本：node --inspect-brk=9229 app.js
- vscode追加一项调试配置如下，端口号和上面必须一致：
```js
  {
    "type": "node",
    "request": "launch",
    "name": "Launch via NPM",
    "runtimeExecutable": "npm",
    "runtimeArgs": [
      "run-script",
      "dev"
    ],
    "port": 9229
  }
```
- 配置完成后，直接启动 vscode 的调试即可
- 注意事项：如果 node 代码中报错（比如数据库连接失败）则会退出调试

# npm 私服
- nexus
- verdaccio
- cnpm

# 热更新
- 浏览器热更新：

# nvm（node 版本管理工具）
```bash
# mac 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
# mac 让系统能执行 nvm 命令，不然会报错
source ~/.nvm/nvm.sh
# 安装 nodejs 使用指定版本 node
nvm install 16.15.0 && nvm use 16.15.0 && corepack enable
nvm install 14.21.3 && nvm use 14.21.3
# 卸载指定版本 node
nvm uninstall 16.15.0
```