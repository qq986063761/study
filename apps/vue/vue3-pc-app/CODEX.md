# CODEX.md

这个文件为 Codex 在本仓库中的工作方式提供专门说明。

## 开始步骤

1. 先读 `AGENTS.md`。
2. 按任务读取相关的 `.ai/context`、`.ai/standards` 和 `.ai/workflows` 文件。
3. 修改前用 `rg`、`sed` 等工具查看现有实现。
4. 使用聚焦的小补丁修改文件，不碰无关用户改动。

## Codex 工作偏好

- 当需求可执行时，优先直接实现，而不是只给方案。
- 工作时间较长时，及时向用户同步进展。
- 手动编辑文件时使用 `apply_patch`。
- 可行时运行验证命令，并说明未能运行的部分。
- 前端改动完成后，如果路由和本地服务可用，尽量打开或测试本地应用。

## 本仓库注意事项

- 当前项目使用 `src/views`，不是 `src/pages`。除非明确要求迁移，否则保持这个约定。
- 路由定义位于 `src/router/index.ts`。
- 侧边栏菜单位于 `src/App.vue`；新增顶层路由时需要同步更新。
- Pinia store 使用 setup 风格的 `defineStore`。
- Element Plus 已在 `src/main.ts` 中全局注册。

## 文件作用

`CODEX.md` 是给 Codex 会话使用的说明文件。它在 `AGENTS.md` 的通用规则之上，补充 Codex 的执行习惯。
