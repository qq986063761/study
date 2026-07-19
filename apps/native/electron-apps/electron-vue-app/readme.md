# Desktop Workbench

基于 Electron 43、electron-vite 5、Vue 3 和 TypeScript 的桌面应用实践项目。渲染进程只负责界面与状态，文件、剪贴板、通知等原生能力通过受限 preload API 调用主进程。

## 功能

- Electron、Chromium、Node.js 和操作系统运行信息
- 打开、编辑和保存不超过 1 MB 的本地文本文件
- 读取和写入系统剪贴板
- 发送桌面系统通知
- 自定义 Windows 标题栏和响应式桌面工作台界面
- 开发热更新、类型检查、ESLint 和 electron-builder 打包

## 目录

```text
src/
├── main/index.ts              # 应用生命周期、窗口和 IPC
├── preload/
│   ├── index.ts               # 安全 API 白名单
│   └── index.d.ts             # 渲染进程类型声明
└── renderer/
    ├── index.html
    └── src/
        ├── App.vue            # Vue 桌面工作台
        ├── assets/            # 全局样式
        └── main.ts            # Vue 入口
```

## 环境

- Node.js 24 或更高版本
- npm 11 或兼容版本

## 使用

```bash
npm install
npm run dev
```

## 检查与构建

```bash
npm run lint
npm run typecheck
npm run build

# 生成当前系统的未安装应用目录
npm run build:unpack

# Windows 安装包
npm run build:win
```

构建产物位于 `out/`。正式发布前还需要替换应用图标，并配置 Windows/macOS 代码签名。

## 安全边界

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- preload 只暴露明确的桌面能力，不暴露原始 `ipcRenderer`
- 外部链接只允许 HTTP/HTTPS
- 文本文件限制为 1 MB
