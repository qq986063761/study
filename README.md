# Study

个人学习仓库，统一管理 VitePress 笔记、网页场景 demo 和可独立运行的项目实践。

## 目录结构

```text
study/
├── docs/                 # VitePress 笔记与静态场景 demo
│   ├── 基础/
│   ├── 前端/
│   ├── 后端/
│   ├── AI/
│   ├── CI-CD/
│   ├── 操作系统/
│   ├── 版本控制/
│   ├── 科学上网/
│   └── 第三方平台/
├── apps/                 # 独立运行的项目实践
│   ├── vue/
│   ├── react/
│   ├── node/
│   ├── native/
│   ├── ai/
│   ├── astro/
│   └── packs/            # 构建工具 demo
├── .ai/                  # 仓库通用 AI 规则
├── .vitepress/           # 文档站配置
├── AGENTS.md             # AI / Agent 统一入口
└── package.json          # 文档站依赖与脚本
```

## 文档站

仓根只管理 VitePress 文档站依赖，文档源目录为 `docs/`。

```bash
npm install
npm run docs:dev
npm run docs:build
npm run docs:preview
```

GitHub Pages 会在 `master` 分支更新后自动构建和发布。

## 项目实践

`apps/` 下的项目保持独立依赖和脚本，不由仓根统一安装或构建。进入具体项目后，根据该项目的 `README.md` 和 `package.json` 运行。

历史学习资源已迁移至 [docs/学习资源.md](docs/学习资源.md)。
