# 资源
- [官网](https://turbo.build/repo/docs)

# Turborepo
- 面向 JavaScript / TypeScript Monorepo 的任务编排工具。
- 它不替代 pnpm workspace；pnpm 负责多包安装和链接，Turborepo 负责任务依赖、缓存、并行执行和增量构建。
- 常见在 `apps/*`、`packages/*` 结构中管理多个应用和公共包。

# 解决什么问题
- 多包项目里只重新构建受影响的包，避免每次全量 build。
- 对 `lint`、`test`、`build` 等任务做本地缓存和远程缓存。
- 根据包之间依赖关系安排任务顺序，例如先构建公共包，再构建依赖它的应用。
- 统一根目录命令，减少每个子项目单独执行脚本的成本。

# 基础配置
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

# 常用命令
```bash
turbo run build
turbo run lint test
turbo run build --filter=web
turbo run build --filter=...[HEAD^]
```

# 面试重点
- `dependsOn: ["^build"]` 表示先执行依赖包的 `build`，再执行当前包的 `build`。
- `outputs` 决定哪些产物参与缓存；配置不准会导致缓存失效或命中错误。
- `dev` 这类常驻任务通常关闭缓存，并设置 `persistent: true`。
- Turborepo 适合 JS/TS monorepo 的轻量任务编排；更复杂的项目图分析、代码生成、插件生态可以考虑 Nx。
