# 页面工作流

新增或修改路由视图时使用这个工作流。

## 检查清单

1. 阅读 `.ai/context/architecture.md`、`.ai/context/ui-design.md` 和 `.ai/standards/vue.md`。
2. 判断页面是否应放在现有的 `src/views` 中。
3. 创建或修改视图组件。
4. 在 `src/router/index.ts` 中注册或更新路由。
5. 如果是顶层页面，同步更新 `src/App.vue` 的侧边栏菜单。
6. 页面专属状态优先放在页面本地；只有跨页面共享时才放到 Pinia。
7. 页面存在实际行为时，补充单元测试或 E2E 测试。
8. 运行一个有意义的验证命令。

## 页面规则

- 一个页面聚焦一个主题或流程。
- 使用 Element Plus 的布局和控件。
- 异步内容要有加载、空状态和错误状态。
- 避免在 UI 中放长篇说明文。
- 路由 `name` 保持稳定，并使用 PascalCase。

## 常见相关文件

- `src/views/<feature>.vue`
- `src/router/index.ts`
- `src/App.vue`
- 只有共享状态需要 `src/stores/<feature>.ts`
- 浏览器流程测试使用 `e2e/<feature>.spec.ts`

## 文件作用

用这个文件回答：“新增一个页面时，需要同步改哪些地方？”
