# monorepo-vue3-app

这是一个基于 `pnpm workspace` 的 Vue3 Monorepo demo。

目录分层：

- `apps/admin`：后台管理系统
- `apps/web`：PC 端官网/门户
- `apps/h5`：移动端 H5
- `packages/constants`：公共常量和类型
- `packages/utils`：公共工具函数
- `packages/api`：公共 API 层
- `packages/ui`：公共 Vue 组件

## 常用命令

### 安装依赖

```bash
pnpm pnpm:install
```

等价于：

```bash
pnpm install
```

在 Monorepo 项目中，建议始终在根目录执行安装命令，让 `pnpm-lock.yaml` 统一维护所有 app 和 package 的依赖。

## 启动项目

```bash
pnpm dev
```

默认启动 `web` 项目，等价于：

```bash
pnpm dev:web
```

分别启动三个应用：

```bash
pnpm dev:admin
pnpm dev:web
pnpm dev:h5
```

对应关系：

| 命令 | 实际执行 | 说明 |
| --- | --- | --- |
| `pnpm dev:admin` | `pnpm --filter admin dev` | 找到 `name` 为 `admin` 的 workspace 项目，并执行它自己的 `dev` 脚本 |
| `pnpm dev:web` | `pnpm --filter web dev` | 启动 PC 端 web 项目 |
| `pnpm dev:h5` | `pnpm --filter h5 dev` | 启动移动端 H5 项目 |

开发端口固定如下：

| 项目 | dev 地址 | preview 地址 |
| --- | --- | --- |
| `admin` | `http://localhost:5173` | `http://localhost:4173` |
| `web` | `http://localhost:5174` | `http://localhost:4174` |
| `h5` | `http://localhost:5175` | `http://localhost:4175` |

三个 app 的 Vite 脚本都加了 `--strictPort`。如果目标端口已经被占用，Vite 会直接报错，不会自动切换到 `5176` 这类新端口。看到端口占用时，先关闭旧的 dev server，再重新启动对应项目。

这里的 `--filter admin` 不是按目录名随便匹配，而是匹配对应项目 `package.json` 里的：

```json
{
  "name": "admin"
}
```

## 构建项目

```bash
pnpm build
```

完整构建，执行顺序是：

```bash
pnpm run build:packages && pnpm run build:apps
```

意思是先检查/构建公共包，再构建所有应用。

单独构建 apps：

```bash
pnpm build:apps
```

实际执行：

```bash
pnpm -r --filter "./apps/*" build
```

含义：

- `-r`：recursive，递归执行 workspace 中多个项目的脚本
- `--filter "./apps/*"`：只筛选 `apps` 目录下的项目
- `build`：执行每个 app 自己 `package.json` 里的 `build` 脚本

单独处理 packages：

```bash
pnpm build:packages
```

实际执行：

```bash
pnpm -r --filter "./packages/*" type-check
```

这个 demo 里的 packages 主要以源码方式被 Vite 引用，所以这里用 `type-check` 作为 packages 的构建校验。

单独构建某个应用：

```bash
pnpm build:admin
pnpm build:web
pnpm build:h5
```

## 预览生产产物

```bash
pnpm preview:admin
pnpm preview:web
pnpm preview:h5
```

这些命令会执行对应 app 里的 `preview` 脚本，用来预览 `vite build` 后的产物。

一般流程是：

```bash
pnpm build:web
pnpm preview:web
```

## 类型检查

检查整个 Monorepo：

```bash
pnpm type-check
```

实际执行：

```bash
pnpm -r type-check
```

意思是递归执行所有 workspace 项目里的 `type-check` 脚本。

只检查 apps：

```bash
pnpm type-check:apps
```

只检查 packages：

```bash
pnpm type-check:packages
```

只检查单个应用：

```bash
pnpm type-check:admin
pnpm type-check:web
pnpm type-check:h5
```

## 查看依赖关系

查看所有 app 的依赖：

```bash
pnpm list:apps
```

实际执行：

```bash
pnpm -r --filter "./apps/*" list --depth 0
```

查看所有 package 的依赖：

```bash
pnpm list:packages
```

实际执行：

```bash
pnpm -r --filter "./packages/*" list --depth 0
```

这两个命令适合用来观察 workspace 本地包依赖关系，例如：

- `apps/admin` 依赖 `@monorepo-vue3-app/api`
- `packages/api` 依赖 `@monorepo-vue3-app/constants`
- `packages/ui` 依赖 `@monorepo-vue3-app/utils`

## 根脚本和子项目脚本的关系

根目录 `package.json` 里的脚本主要负责统一入口和调度。

例如：

```json
{
  "dev:h5": "pnpm --filter h5 dev"
}
```

它的意思是：找到 `h5` 这个 workspace 项目，然后执行 `apps/h5/package.json` 里的：

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 5175 --strictPort"
  }
}
```

所以：

- 根目录脚本：负责从仓库根目录统一执行命令
- app/package 自己的脚本：负责定义这个项目具体如何启动、构建、检查

## apps 中如何引用 packages

当前 Monorepo 里，`apps/*` 通过 `package.json` 的 workspace 依赖引用 `packages/*`。

例如 `apps/admin/package.json` 中：

```json
"dependencies": {
  "@monorepo-vue3-app/utils": "workspace:*"
}
```

开发时，`pnpm install` 会在根目录统一解析工作区依赖，`packages/utils` 会被识别为本地包。于是：

- `apps/admin`、`apps/web`、`apps/h5` 可以通过 `import { capitalize } from '@monorepo-vue3-app/utils'` 直接使用本地代码
- Vite 开发环境会把本地源码作为模块加载，而不是从 npm 下载
- 修改 `packages/*` 后，依赖它的 app 重新启动或热更新即可看到最新结果

## 生产构建后 dist 的关系

这个 demo 中，`packages/*` 不是单独发布成独立产物。生产打包时，`apps/*` 的 `vite build` 会把依赖的 `packages/*` 代码一起编译进 app 的最终产物。

构建结果通常是：

- `apps/admin/dist`
- `apps/web/dist`
- `apps/h5/dist`
  
也就是说：

- `packages/utils`、`packages/api` 等源码会被 Vite 作为应用模块打包到各自 `apps/*/dist` 里
- 最终部署时，只需要部署对应 app 的 `dist`，不需要单独部署 `packages/*`

如果要把 package 单独发布成 npm 包，则需要额外给 `packages/*` 写 `build` 脚本，并在 app 中根据发布包地址调整依赖方式。但当前 demo 仅展示「源码直接共享」的 Monorepo 使用方式。

## 命令速查

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 默认启动 `web` |
| `pnpm dev:admin` | 启动后台管理系统 |
| `pnpm dev:web` | 启动 PC 端项目 |
| `pnpm dev:h5` | 启动移动端 H5 项目 |
| `pnpm build` | 先检查 packages，再构建所有 apps |
| `pnpm build:apps` | 构建所有 apps |
| `pnpm build:packages` | 检查所有 packages |
| `pnpm build:admin` | 只构建 admin |
| `pnpm build:web` | 只构建 web |
| `pnpm build:h5` | 只构建 h5 |
| `pnpm type-check` | 检查整个 workspace |
| `pnpm type-check:apps` | 只检查 apps |
| `pnpm type-check:packages` | 只检查 packages |
| `pnpm list:apps` | 查看 apps 依赖 |
| `pnpm list:packages` | 查看 packages 依赖 |
