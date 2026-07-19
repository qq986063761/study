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

## 脚本说明

以下脚本可以通过 `npm run <脚本名>` 或 `bun run <脚本名>` 执行。

| 脚本             | 功能                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- |
| `format`         | 使用 Prettier 格式化项目文件。                                                     |
| `lint`           | 使用 ESLint 检查代码，并通过缓存加快后续检查。                                     |
| `typecheck:node` | 使用 `tsconfig.node.json` 检查主进程、preload 和构建配置的 TypeScript 类型。       |
| `typecheck:web`  | 使用 `tsconfig.web.json` 检查渲染进程和 Vue 组件的 TypeScript 类型。               |
| `typecheck`      | 依次执行 Node 端和 Web 端的类型检查。                                              |
| `start`          | 构建应用并以预览模式启动 Electron，用于检查生产构建结果。                          |
| `dev`            | 启动 Electron 开发环境和渲染进程热更新服务。                                       |
| `build`          | 先执行完整类型检查，再构建主进程、preload 和渲染进程代码。                         |
| `postinstall`    | 安装 Electron 二进制文件，并安装或重建 Electron 原生依赖；安装项目依赖后自动执行。 |
| `build:unpack`   | 构建应用，并生成当前系统可直接运行的未打包应用目录。                               |
| `build:win`      | 构建应用，并生成 Windows 安装包。                                                  |
| `build:mac`      | 构建应用，并生成 macOS 安装包。                                                    |
| `build:linux`    | 构建应用，并生成 Linux 安装包。                                                    |

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
