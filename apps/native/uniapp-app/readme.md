# uni-app Multi-platform Demo

基于 uni-app Vue3、Vite 5 和 Pinia，支持 H5、App、主流小程序、HarmonyOS 小程序与快应用。DCloud 依赖统一锁定到 vue3 dist-tag 的 5020120260710001 批次，避免不同编译器批次混用。

## 环境

- Node.js 20.19 或更高版本（推荐 Node.js 24）
- npm 10 或更高版本
- App 原生安装包需要 HBuilderX
- 小程序预览与上传需要对应平台开发者工具

## 安装与启动

~~~bash
npm install

# H5
npm run dev:h5

# App 资源
npm run dev:app

# 微信 / 支付宝 / HarmonyOS 小程序
npm run dev:mp-weixin
npm run dev:mp-alipay
npm run dev:mp-harmony
~~~

开发产物位于 dist/dev/PLATFORM。H5 直接打开终端输出的地址；小程序项目用对应开发者工具导入产物目录。

## 构建与打包

~~~bash
# H5
npm run build:h5

# App 原生资源
npm run build:app

# 微信 / 支付宝 / HarmonyOS 小程序
npm run build:mp-weixin
npm run build:mp-alipay
npm run build:mp-harmony
~~~

生产产物位于 dist/build/PLATFORM。npm run build:app 只生成 App 原生资源；Android APK/AAB 与 iOS IPA 需用 HBuilderX 打开本项目，选择“发行 > 原生 App 云打包/本地打包”，并配置 manifest.json 中的 AppID、包名、证书和应用图标。

其余已配置平台可通过 npm run 查看完整的 dev:* / build:* 命令。

## 功能

- uni API：Toast、Modal、Loading、Storage 与系统信息
- Pinia 全局状态及本地持久化
- 主包页面、分包父子页面和多种导航方式
