
# 资源
- [electron 官网](https://electronjs.org/)
- [electron 中文官网](https://www.electronjs.org/zh/)
- [electron-builder](https://www.electron.build/configuration/configuration/)
- [electron-vue 文档](https://simulatedgreg.gitbooks.io/electron-vue/content/cn/)
- [vue-cli-plugin-electron-builder npm](https://www.npmjs.com/package/vue-cli-plugin-electron-builder)

# 方式1：asar打包
- 安装 asar 模块
- 打包命令：asar pack PRJ_NAME app.asar
- 下载 electron 对应平台发布包，用生成的 app.asar 替换 resources 中的 app.asar
  - 平台如：electron-v1.8.4-darwin-x64（mac64）、electron-v1.8.4-win32-ia32（win32）、electron-v1.8.4-win32-x64（win64）
- 运行 electron.exe 启动桌面应用

# 方式2：electron-builder打包
- 打包命令：electron-builder build（默认配置，如有其它平台需求可根据文档覆盖配置，需要良好的网络环境）；

# vue开发方式：vue-cli-plugin-electron-builder
- 先创建 vue-cli3 项目
- 然后根据文档执行指定命令追加 electron 自动追加所需要的配置

# NSIS
