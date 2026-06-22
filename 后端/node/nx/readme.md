# 资源
- [官网](https://nx.dev/)

# Nx
- 面向 Monorepo 的工程化工具，支持任务编排、缓存、受影响范围分析、代码生成和项目图。
- 支持前端、Node、全栈、移动端等多种项目，插件体系比 Turborepo 更完整。
- 可以和 pnpm workspace 一起使用：pnpm 管安装和链接，Nx 管任务、依赖图和缓存。

# 解决什么问题
- 多应用、多包项目中，只对受影响项目运行 `lint`、`test`、`build`。
- 通过本地缓存和远程缓存减少 CI/CD 时间。
- 用 generator 统一创建应用、库、组件，降低团队项目结构差异。
- 可视化项目依赖图，帮助理解包之间关系。

# 常用命令
```bash
nx graph
nx run web:build
nx run-many -t lint test build
nx affected -t test build
```

# 和 Turborepo 区别
- Turborepo 更轻量，主要聚焦任务管道和缓存。
- Nx 更重一些，但项目图、affected 分析、generator、插件生态更强。
- 小中型 JS/TS monorepo 可以先用 pnpm workspace + Turborepo；大型团队、多技术栈、多规范生成需求可以考虑 Nx。

# 面试重点
- `affected` 是 Nx 高频能力：根据 git diff 和项目依赖图计算哪些项目受影响，只跑必要任务。
- 缓存命中的关键是输入、输出、环境变量和命令一致。
- Nx 不等于包管理器，不负责替代 npm / pnpm / yarn 的依赖安装。
- Monorepo 的收益是共享代码和统一工程规范，代价是依赖边界、构建缓存、发布流程都要设计清楚。
