# 组件工作流

新增或修改通用组件时使用这个工作流。

## 检查清单

1. 阅读 `.ai/standards/vue.md`、`.ai/standards/typescript.md` 和 `.ai/context/ui-design.md`。
2. 先检查 `src/components` 中是否已有可复用或可扩展的组件。
3. 明确组件契约：props、emits、slots 和 exposed methods。
4. 新文件使用 `<script setup lang="ts">` 实现。
5. 只为组件自己的布局或视觉表现添加 scoped 样式。
6. 如果这是学习演示的一部分，在某个 view 中补充示例用法。
7. 组件存在分支、事件、插槽或用户交互时，补充测试。

## 组件规则

- 通用组件不要绑定具体路由假设。
- 灵活内容区域优先使用 slots。
- 配置用 props，向上传递用 emits，复用逻辑用 composables。
- 避免隐藏的全局依赖。
- 对 Element Plus 的封装应保持薄而有目的。

## 测试思路

- 能渲染必要内容。
- 关键 props 变体表现正确。
- 能触发预期 emits。
- 能处理空态或禁用态。
- 能保留 slot 内容。

## 文件作用

用这个文件回答：“怎样新增一个未来页面也能安全复用的组件？”
