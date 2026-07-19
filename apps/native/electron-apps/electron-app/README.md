# Electron Desktop Lab

基于 Electron 43 和 Electron Forge 7 的桌面能力演示。项目采用主进程、preload、渲染进程分层结构，渲染进程通过受限 IPC 调用原生能力，不直接访问 Node.js。

## 功能

- 应用、Electron、Chromium、Node.js 和操作系统信息
- 系统路径、区域、系统主题和窗口尺寸
- 打开、读取、编辑、保存及定位本地文本文件
- 读取和写入系统剪贴板
- 原生消息对话框和桌面通知
- 窗口最小化、最大化、还原和关闭
- 经过协议白名单校验的外部链接
- 原生应用菜单、编辑菜单、缩放、全屏和开发者工具

## 目录

```text
src/
├── main/
│   ├── main.js                 # 应用生命周期和窗口创建
│   ├── application-menu.js     # 原生应用菜单
│   └── ipc-handlers.js         # 原生能力与 IPC 处理
├── preload/
│   └── preload.js              # 安全 API 白名单
└── renderer/
    ├── api/
    │   └── desktop-api.js      # preload API 适配入口
    ├── assets/
    │   └── styles.css          # 渲染进程样式资源
    ├── store/
    │   └── desktop-store.js    # 页面状态和桌面操作编排
    ├── views/
    │   └── dashboard-view.js   # 工作台及各功能视图
    ├── index.html
    └── main.js                 # 渲染进程入口
```

目录职责与 Vue 项目的 `api`、`store`、`assets`、`views` 对齐，同时保留 Electron 特有的 `main` 和 `preload` 安全边界。业务增加后可继续按功能拆分 `views` 和对应 store，避免把 Node.js 能力放入渲染进程。

## 安全边界

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- CSP 仅允许加载本地脚本、样式和图片
- preload 不暴露原始 `ipcRenderer`
- 外链仅允许 HTTP/HTTPS 协议
- 文本文件演示限制为 1 MB
- 打包启用 ASAR、Cookie 加密和 ASAR 完整性校验

## 环境

- Node.js 22.12 或更高版本，推荐 Node.js 24
- npm 10 或更高版本

## 启动

```bash
npm install
npm start
```

## 检查与打包

```bash
# JavaScript 语法检查
npm test

# 生成当前系统的未安装应用目录，输出到 out/
npm run package

# 生成当前系统的安装包，输出到 out/make/
npm run make
```

`make` 需要在目标操作系统执行：Windows 生成 Squirrel 安装包，macOS 生成 ZIP，Linux 生成 deb/rpm。正式发布前还需配置应用图标、代码签名和公证。
