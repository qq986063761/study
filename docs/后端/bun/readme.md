# 资源
- [官网](https://bun.com/)

# 安装
- mac：curl -fsSL https://bun.sh/install | bash
- windows：powershell -c "irm bun.sh/install.ps1 | iex"

# 命令

## 项目初始化
- `bun init` — 初始化新项目，交互式创建 package.json、tsconfig.json 等
- `bun create <template>` — 从模板创建项目（如 `bun create react-app my-app`）

## 包管理
- `bun install` / `bun i` — 安装 package.json 中的所有依赖
- `bun add <pkg>` — 添加生产依赖（等价于 `npm install <pkg>`）
- `bun add -d <pkg>` / `bun add --dev <pkg>` — 添加开发依赖
- `bun add -g <pkg>` — 全局安装包
- `bun add --optional <pkg>` — 添加可选依赖
- `bun remove <pkg>` / `bun rm <pkg>` — 移除依赖
- `bun update` — 更新所有依赖到最新版本（遵循 semver）
- `bun update <pkg>` — 更新指定依赖
- `bun outdated` — 查看过时的依赖
- `bun link` — 将本地包注册为可链接的开发依赖
- `bun unlink` — 取消本地包的链接
- `bun pm ls` — 列出已安装的包
- `bun pm cache` — 查看包缓存信息
- `bun pm cache rm` — 清除包缓存
- `bun publish` — 发布包到 npm 仓库
- `bun config get registry` — 查看当前镜像源
- `bun config set registry <url>` — 设置新的镜像源

## 运行与开发
- `bun run <script>` — 运行 package.json 中的脚本（`bun run` 可省略，直接用 `bun <script>`）
- `bun run <file.ts>` — 直接运行 TypeScript / JSX / TSX 文件
- `bun --watch <file>` — 以监听模式运行，文件变更时自动重启
- `bun --hot <file>` — 以热重载模式运行（保留进程状态）
- `bunx <pkg>` — 执行 npm 包而无需安装（等价于 npx）

## 构建
- `bun build <entry>` — 打包项目，支持 JS/TS/JSX/TSX
- `bun build --minify` — 打包并压缩
- `bun build --target browser` — 打包目标为浏览器
- `bun build --target bun` — 打包目标为 bun 运行时
- `bun build --target node` — 打包目标为 Node.js
- `bun build --outdir <dir>` — 指定输出目录
- `bun build --sourcemap` — 生成 source map

## 测试
- `bun test` — 运行所有测试（Jest 兼容的测试运行器）
- `bun test <file>` — 运行指定测试文件
- `bun test --watch` — 以监听模式运行测试
- `bun test --coverage` — 运行测试并生成覆盖率报告
- `bun test --timeout <ms>` — 设置测试超时时间

## 工具与环境
- `bun upgrade` — 升级 bun 自身到最新版本
- `bun --version` / `bun -v` — 查看 bun 版本
- `bun --help` / `bun help` — 查看帮助信息
- `bun info` — 查看系统 / 环境信息（CPU、平台、依赖版本等）
- `bun patch <pkg>` — 为依赖打补丁（patch-package 替代方案）
- `bun why <pkg>` — 查看某个包为什么被安装（依赖路径分析）
- `bun which <cmd>` — 查找命令的路径


# vscode 插件
- Bun Scripts：bun脚本执行快捷视图