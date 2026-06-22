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

## package.json 依赖类型

- `dependencies`：运行时依赖，代码上线后仍然需要，例如 `vue`、`axios`、`express`。
- `devDependencies`：开发和构建时依赖，线上运行不直接需要，例如 `vite`、`webpack`、`typescript`、`eslint`。
- `peerDependencies`：声明“我需要宿主项目提供这个包”，常见于组件库、插件库，例如 Vue 组件库声明 `vue` 为 peer dependency，避免重复安装多个 Vue。
- `optionalDependencies`：可选依赖，安装失败不一定阻塞项目，常见于跨平台能力增强。
- 面试点：业务项目主要区分运行时和开发时；类库项目要重点关注 `peerDependencies`，否则容易把框架重复打进产物。

## lockfile

- pnpm 的锁文件是 `pnpm-lock.yaml`，记录依赖的精确版本、完整依赖树和解析地址。
- lockfile 能保证多人协作、CI/CD、线上构建安装到一致的依赖版本。
- CI 中建议使用 `pnpm install --frozen-lockfile`，如果 `package.json` 和 lockfile 不一致就直接失败，避免隐式更新依赖。
- 不建议随意删除 lockfile；只有依赖树异常、迁移包管理器、或明确要重新解析依赖时才考虑重建。

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
- workspace 内部包互相依赖可以使用 `workspace:*`，保证链接到本仓库内的包，而不是从 npm 下载同名包。

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
{
  "dependencies": {
    "@repo/utils": "workspace:*"
  }
}
```

- 面试点：pnpm workspace 解决的是“多包依赖安装和本地链接”，Turborepo / Nx 解决的是“多包任务编排、缓存和受影响范围计算”。

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
