# uni-app Multi-platform Demo

基于 uni-app Vue3、Vite 5 和 Pinia，支持 H5、App、主流小程序、HarmonyOS 小程序与快应用。DCloud 依赖统一锁定到 vue3 dist-tag 的 5020120260710001 批次，避免不同编译器批次混用。

## 环境

- Node.js 20.19 或更高版本（推荐 Node.js 24）
- npm 10 或更高版本
- App 原生安装包需要 HBuilderX
- 小程序预览与上传需要对应平台开发者工具

## 目录结构

~~~text
src/
├── api/
│   ├── request.js              # uni.request 统一请求、状态码与错误处理
│   └── modules/todo.js         # 按业务域拆分的接口模块
├── router/
│   ├── index.js                # navigateTo、reLaunch、返回兜底等导航方法
│   └── routes.js               # 集中维护页面路径常量
├── store/
│   ├── index.js                # Pinia 实例工厂
│   └── modules/app.js          # 应用状态、派生值、操作与持久化
├── views/
│   ├── home/index.vue          # 工作台首页
│   ├── api/index.vue           # 业务 API 请求演示
│   ├── store/index.vue         # Pinia 状态演示
│   ├── router/index.vue        # 路由参数与页面栈演示
│   ├── router-package/         # 路由分包页面
│   └── native-api/index.vue    # uni 原生 API 工作台
├── App.vue                     # 应用生命周期与全局样式
├── main.js                     # Vue 与 Pinia 初始化
├── manifest.json               # 各平台应用配置
└── pages.json                  # 页面注册、分包和预加载规则
~~~

uni-app 不使用 Vue Router，页面仍以 `pages.json` 为唯一注册入口；`router/` 只集中维护路径和封装 `uni.navigateTo`、`uni.navigateBack`、`uni.reLaunch` 等导航 API。

业务 API 默认请求 `https://jsonplaceholder.typicode.com`，可通过 `VITE_API_BASE_URL` 替换服务地址。小程序正式发布前，需要在对应平台后台配置合法 request 域名。

## 安装与启动

```bash
npm install

# H5
npm run dev:h5

# App 资源
npm run dev:app

# 微信 / 支付宝 / HarmonyOS 小程序
npm run dev:mp-weixin
npm run dev:mp-alipay
npm run dev:mp-harmony
```

开发产物位于 dist/dev/PLATFORM。H5 直接打开终端输出的地址；小程序项目用对应开发者工具导入产物目录。

## 构建与打包

```bash
# H5
npm run build:h5

# App 原生资源
npm run build:app

# 微信 / 支付宝 / HarmonyOS 小程序
npm run build:mp-weixin
npm run build:mp-alipay
npm run build:mp-harmony
```

生产产物位于 dist/build/PLATFORM。npm run build:app 只生成 App 原生资源；Android APK/AAB 与 iOS IPA 需用 HBuilderX 打开本项目，选择“发行 > 原生 App 云打包/本地打包”，并配置 manifest.json 中的 AppID、包名、证书和应用图标。

## 脚本说明

脚本名称中的 `dev:*` 用于开发编译，会监听文件变化，产物写入 `dist/dev/PLATFORM`；`build:*` 用于生产编译，产物写入 `dist/build/PLATFORM`。除 H5 外，这些命令只生成对应平台的项目资源，不会自动打开平台开发者工具或生成可发布的安装包。

| 开发脚本                      | 构建脚本                        | 目标平台         | 功能说明                                                             |
| ----------------------------- | ------------------------------- | ---------------- | -------------------------------------------------------------------- |
| `dev:app`                     | `build:app`                     | App              | 编译 App 原生资源，后续需使用 HBuilderX 生成 Android 或 iOS 安装包。 |
| `dev:custom`                  | `build:custom`                  | 自定义平台       | 将命令行参数作为 `-p` 的平台标识，适合临时指定或扩展编译平台。       |
| `dev:h5`                      | `build:h5`                      | Web              | 启动 H5 开发服务器，或生成可部署到 Web 服务器的生产资源。            |
| `dev:h5:ssr`                  | `build:h5:ssr`                  | Web SSR          | 以服务端渲染模式开发或构建 H5 应用。                                 |
| `dev:mp-alipay`               | `build:mp-alipay`               | 支付宝小程序     | 生成可由支付宝小程序开发者工具导入的项目。                           |
| `dev:mp-baidu`                | `build:mp-baidu`                | 百度智能小程序   | 生成可由百度智能小程序开发者工具导入的项目。                         |
| `dev:mp-jd`                   | `build:mp-jd`                   | 京东小程序       | 生成可由京东小程序开发者工具导入的项目。                             |
| `dev:mp-kuaishou`             | `build:mp-kuaishou`             | 快手小程序       | 生成可由快手小程序开发者工具导入的项目。                             |
| `dev:mp-lark`                 | `build:mp-lark`                 | 飞书小程序       | 生成可由飞书小程序开发者工具导入的项目。                             |
| `dev:mp-qq`                   | `build:mp-qq`                   | QQ 小程序        | 生成可由 QQ 小程序开发者工具导入的项目。                             |
| `dev:mp-toutiao`              | `build:mp-toutiao`              | 抖音小程序       | 生成可由抖音小程序开发者工具导入的项目。                             |
| `dev:mp-harmony`              | `build:mp-harmony`              | HarmonyOS 元服务 | 生成可由 DevEco Studio 导入的 HarmonyOS 元服务项目。                 |
| `dev:mp-weixin`               | `build:mp-weixin`               | 微信小程序       | 生成可由微信开发者工具导入的项目。                                   |
| `dev:mp-xhs`                  | `build:mp-xhs`                  | 小红书小程序     | 生成可由小红书小程序开发者工具导入的项目。                           |
| `dev:quickapp-webview`        | `build:quickapp-webview`        | 快应用 WebView   | 编译通用快应用 WebView 平台资源。                                    |
| `dev:quickapp-webview-huawei` | `build:quickapp-webview-huawei` | 华为快应用       | 编译华为快应用平台资源。                                             |
| `dev:quickapp-webview-union`  | `build:quickapp-webview-union`  | 快应用联盟       | 编译快应用联盟平台资源。                                             |

`custom` 脚本中的 `-p` 没有预设平台值，执行时必须追加平台标识。例如：

```bash
npm run dev:custom -- mp-weixin
npm run build:custom -- mp-weixin
```

## 功能

- 统一业务请求层、HTTP 状态处理和模块化 API
- Pinia 全局状态、getters、actions 及本地持久化
- 集中式路由路径、查询参数、页面栈和分包导航
- uni API：设备与网络、Toast、Modal、Action Sheet、Loading、Storage、剪贴板、振动和图片选择
