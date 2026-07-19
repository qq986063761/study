# 资源
- [GitHub Actions 文档](https://docs.github.com/actions)

# GitHub Actions
- GitHub 提供的 CI/CD 平台，可以在 push、pull request、tag、手动触发等事件发生时运行 workflow。
- 常用于自动执行 `lint`、`test`、`build`，也可以做自动部署、发包、Docker 镜像构建。
- 配置文件放在仓库 `.github/workflows/*.yml`。

# 核心概念
- workflow：一次自动化流程，由一个 yml 文件定义。
- event：触发条件，例如 `push`、`pull_request`、`workflow_dispatch`。
- job：一个或多个任务，默认并行执行，也可以用 `needs` 串联。
- step：job 内的具体步骤，可以执行 shell 命令，也可以使用别人写好的 action。
- runner：执行任务的机器，例如 `ubuntu-latest`。

# lint / test / build 示例
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

# 自动部署思路
- 静态站点：`build` 后把 `dist` 部署到 GitHub Pages、OSS、S3、服务器静态目录。
- Node 服务：测试通过后构建 Docker 镜像，推到镜像仓库，再通知服务器或 K8s 更新。
- npm 包：tag 触发后执行测试、构建、`npm publish`。
- 密钥放到 GitHub `Secrets`，不要写进 yml 或代码仓库。

# 面试重点
- CI 是持续集成，重点是提交后自动检查质量；CD 是持续交付/部署，重点是产物自动发布到目标环境。
- `lint / test / build` 是最基础的质量门禁，通常在 PR 阶段就要跑。
- `actions/cache` 或 `setup-node cache` 可以缓存依赖，减少 CI 时间。
- 部署任务建议和检查任务分开，用 `needs` 保证检查通过后再部署。
- 生产部署要区分环境、权限和密钥，避免 PR 或外部贡献者直接触发敏感部署。
