# 资源
- [文件系统学习](http://www.jianshu.com/p/5683c8a93511)
- [http模块学习](https://my.oschina.net/freddon/blog/513853)
- [package.json](http://mujiang.info/translation/npmjs/files/package.json.html)
- [npm](https://www.npmjs.cn/)
- [pnpm](https://pnpm.io/zh/)
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
- 获取仓库源地址：npm config get registry 原地址是：https://registry.npmjs.org/
- 设置仓库源地址：npm config set registry https://registry.npmmirror.com

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
# mac 安装 nvm，后面的 bash 是安装的对应终端环境，windows 上别装到系统默认文件夹中，直接装d盘根目录否则可能后续安装node会出问题
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# 如果上面命令失败了443，则直接浏览器下载上面的脚本文件，然后用 bash ./install.sh 本地执行下载
# 配置环境文件如下，让终端能使用 nvm：
# 先给 bash 终端加 nvm 配置，在 ~ 目录下，用 vim .bash_profile 最后一行加下面内容
export NVM_DIR="$HOME/.nvm"   
source ~/.nvm/nvm.sh
# 再加入到 zsh 终端，在 ~ 目录下，用 vim .zshrc 在最后一行加下面代码，让 zsh 命令默认执行下面内容
source ~/.bash_profile

windows 的 nvm 装 1.1.12 版本，最新版本好像有报错
# 必须用系统管理员终端装，别用编辑器装，会报错
# windows 上安装前配置下载源
nvm node_mirror https://npmmirror.com/mirrors/node/
nvm npm_mirror https://npmmirror.com/mirrors/npm/
# 如果开了 vpn 设置 nvm 代理
nvm proxy http://127.0.0.1:7890 https://127.0.0.1:7890
# 取消代理
nvm proxy none

# 安装 nodejs 并且临时使用指定版本 node，windows 上不带 v 字母
nvm install v20.16.0 && nvm use v20.16.0
nvm install v18.20.4 && nvm use v18.20.4
nvm install v16.15.0 && nvm use v16.15.0 && corepack enable
nvm install v14.21.3 && nvm use v14.21.3
# 全局使用默认版本,好像只在mac有效
nvm alias default v14.21.3
nvm alias default v16.15.0
nvm alias default v18.20.4
nvm alias default v20.16.0
# 卸载指定版本 node
nvm uninstall v16.15.0
# 查询 nvm 安装的 node 版本列表
nvm ls
# 更新 nvm 版本
nvm install-latest-npm

# 安装 node 版本报错是镜像源不对
Version '14.21.3' not found - try `nvm ls-remote` to browse available versions
# 可以切换镜像源后再尝试
export NVM_NODEJS_ORG_MIRROR=https://nodejs.org/dist
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/

# mac 查看环境变量 echo $PATH
# vscode 内切换默认版本后，下次进还没效可以改设置和系统终端保持一致，打开设置文件后，按下面配置
# 然后如果 vscode 脚本点击 zsh 终端报错 npm 不存在，那就换 vscode 终端为 bash 就行
"terminal.integrated.env.osx": {
  "NVM_DIR": "$HOME/.nvm",
  "PATH": "$HOME/.nvm/versions/node/vX.X.X/bin:$PATH"
}

# nvm 可视化工具
nvm-desktop https://github.com/1111mp/nvm-desktop/releases
vscode 插件 Node Visual Manager、vscode-nvm
```

# fsevents node install.js 卡住
- 装个包 npm install puppeteer@19，注意和 node 版本匹配

# 如果需要装 python，因为npm装包有时候 node-gyp 卡住因为这个没有
先检查本地有的 python 版本：python --version
如果检查到有一个版本，则直接 npm config set python python2.7.16 这样指定这个版本
如果没有 python，则按下面步骤下载：
下包：https://www.python.org/ftp/python/2.7.9/Python-2.7.9.tgz 然后手动解压
解压后跳到文件夹 Python-2.7.9 内，终端命令执行 sudo ./configure --prefix=/usr/local/python-2.7.9 配置安装目录
然后执行安装 sudo make install
安装完执行 python2.7.9 -V 看看版本，应该 usr 目录下，local 下就有内容了，然后 usr/bin 下要有 python2.7.9 的执行文件，
如果执行找不到命令，则通过软链接 ln -s /usr/local/python-2.7.9/bin/python /usr/bin/python2.7.9 链接一下
最后把 npm 的配置指向 python 安装的版本，npm config set python python2.7.9
配置环境变量：vim 打开根目录下的 bash_profile 文件，加一行：export PATH="/usr/local/python-2.7.9/bin:$PATH"

# mac brew 
```bash
# 官网安装 brew
- [Homebrew](https://brew.sh/)
```
