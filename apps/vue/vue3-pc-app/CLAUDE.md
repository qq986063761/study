# CLAUDE.md

这个文件为 Claude 或 Claude Code 类助手提供专门说明，同时保持与 `AGENTS.md` 的通用规则一致。

## Claude 使用方式

- 先读 `AGENTS.md`，获取所有 AI 助手共享的规则。
- 使用 `.ai/context/` 理解应用背景，再提出架构建议。
- 使用 `.ai/standards/` 保证生成的 Vue、TypeScript、样式和测试代码一致。
- 使用 `.ai/workflows/` 作为常见开发任务的检查清单。
- 当发现可复用的长期经验时，记录到 `.ai/memory/`。

## 回复风格

- 具体、直接、偏代码落地。
- 说明修改了哪些文件，以及运行了哪些验证命令。
- 少写空泛解释，多写和当前任务相关的实现说明。
- 只有在无法从仓库上下文安全判断时才提问。

## Claude 专用提示

- 修改 Vue SFC 时，尽量保留文件现有的 `<script>`、`<template>`、`<style>` 顺序。
- 做 UI 改动时，同时关注桌面宽度和窄屏宽度，因为应用有可折叠侧边栏。
- 当用户提到“页面”时，默认理解为 `src/views` 下的路由视图，除非用户明确指定其他结构。

## 文件作用

`CLAUDE.md` 是给 Claude Code 或 Claude 系助手的交接文件。它告诉 Claude 项目知识在哪里，避免重复猜测。
