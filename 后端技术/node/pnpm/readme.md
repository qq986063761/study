# pnpm

[pnpm 官网（中文）](https://pnpm.io/zh/)

基于内容寻址存储与硬链接，磁盘占用小、安装快，与 npm 脚本和 `package.json` 基本兼容。

## 安装与版本

- 启用 Corepack（Node 16.13+）：`corepack enable`，再 `corepack prepare pnpm@latest --activate`
- 或独立安装：见官网 [安装](https://pnpm.io/zh/installation)
- 查看版本：`pnpm -v`

## 依赖安装

- 按 lockfile 安装：`pnpm install`（简写 `pnpm i`）
- 仅装生产依赖：`pnpm install --prod`（`pnpm i -P`）
- 冻结 lockfile（CI 常用）：`pnpm install --frozen-lockfile`
- 离线优先：`pnpm install --offline`

## 增删依赖

- 安装依赖：`pnpm add <包名>`（开发依赖：`pnpm add -D <包名>`，全局：`pnpm add -g <包名>`）
- 安装精确版本：`pnpm add <包名>@<版本>`
- 卸载：`pnpm remove <包名>`（`pnpm rm`、`pnpm uninstall`）
- 更新依赖：`pnpm update`（指定包：`pnpm update <包名>`）

## 脚本与可执行文件

- 运行脚本：`pnpm run <脚本名>`（内置脚本如 `test`、`start` 可省略 `run`：`pnpm test`）
- 执行当前项目 `node_modules/.bin` 里的命令：`pnpm exec <命令>`（也可直接 `pnpm <命令>`，若与内置子命令不冲突）
- 临时下载并执行包（类似 npx）：`pnpm dlx <包名>`（例如 `pnpm dlx create-vite`）

## 查看与诊断

- 依赖树：`pnpm list`（`pnpm ls`），可加 `-r` 递归 workspace
- 为何安装某包：`pnpm why <包名>`
- 检查过期版本：`pnpm outdated`
- 查看 store 路径：`pnpm store path`
- 清理未在依赖中声明的包：`pnpm prune`

## 配置与源

- 查看配置：`pnpm config list`
- 设置 registry：`pnpm config set registry https://registry.npmmirror.com`
- 与 npm 类似，用户级配置在 `~/.npmrc` 等位置

## Monorepo（workspace）

- 根目录需配置 `pnpm-workspace.yaml`，子包在 `packages/*` 等路径
- 根目录执行所有子包脚本：`pnpm -r run <脚本名>`
- 只对某个包执行：`pnpm --filter <包名或路径> <命令>`（简写 `-F`）
- 给 workspace 中某包加依赖：`pnpm add <包名> --filter <子包名>`

## 链接与发布

- 本地包互相链接：`pnpm link`（全局）/ 在包目录 `pnpm link --global` 后在项目里 `pnpm link <包名>`
- 发布：`pnpm publish`（需先登录 npm：`pnpm login`）

## 与 npm 对照（习惯迁移）

| 场景 | npm | pnpm |
|------|-----|------|
| 安装全部依赖 | `npm i` | `pnpm i` |
| 添加依赖 | `npm i foo` | `pnpm add foo` |
| 运行脚本 | `npm run build` | `pnpm run build` |
| 临时执行 | `npx create-vite` | `pnpm dlx create-vite` |

更多子命令：`pnpm help` 或 [CLI 文档](https://pnpm.io/zh/cli/add)。
