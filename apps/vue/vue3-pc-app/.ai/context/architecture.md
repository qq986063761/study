# 架构上下文

这个文件记录应用当前的技术结构，帮助 AI 助手不用每次都从零开始理解项目。

## 技术栈

- Vue 3，使用 Composition API。
- Vite 作为开发服务器和生产构建工具。
- TypeScript 作为主要开发语言。
- Element Plus 作为 UI 组件库。
- Pinia 作为状态管理方案。
- vue-router 作为客户端路由方案。
- Vitest 和 Vue Test Utils 用于单元测试。
- Playwright 用于浏览器级 E2E 测试。

## 当前目录结构

```text
src/
  assets/css/       全局样式
  components/       通用组件和演示组件
  composables/      可复用的 Composition API 逻辑
  router/           路由定义
  stores/           Pinia stores
  views/            路由页面和路由演示
  __tests__/        Vitest 单元测试
e2e/                Playwright 测试
public/             Vite 静态资源
```

harness 示例中可能出现 `src/pages`，但本仓库当前使用 `src/views`。除非明确要求迁移，否则把 `views` 当作页面层。

## 应用入口

- `src/main.ts` 创建 Vue 应用，安装 Pinia、Element Plus 和 router，然后挂载到 `#app`。
- `src/App.vue` 负责持久化应用壳层：侧边栏、Logo、菜单、滚动容器和 `router-view`。
- `src/router/index.ts` 负责注册路由。

## 路由模式

- 顶层页面通常放在 `src/views`。
- 根路由当前重定向到 `/data`。
- `/router-demo` 下展示了嵌套路由。
- 新增顶层页面时，同时更新 `src/router/index.ts` 和 `src/App.vue` 中的侧边栏菜单。
- 当前菜单高亮通过 `route.path.startsWith(item.index)` 支持嵌套路由。

## 状态模式

- Pinia stores 位于 `src/stores`。
- 现有 store 使用 setup 风格的 `defineStore`，返回 refs、computed 和 actions。
- store ID 要稳定且语义清晰，例如 `defineStore('counter', () => {})`。

## 组件模式

- 可复用组件放在 `src/components`。
- 跨页面逻辑放在 `src/composables`。
- 只服务当前页面或演示的结构，可以保留在 `src/views`。
- 新增 Vue SFC 时优先使用类型化的 props 和 emits。

## 构建与工具

- `@` 已别名到 `src`。
- `npm run build` 会执行类型检查和 Vite 构建。
- `npm run lint` 会运行 oxlint 和 ESLint 自动修复。
- `npm run format` 会使用 oxfmt 格式化 `src/`。

## 文件作用

用这个文件回答：“这段代码应该放在哪里？哪些现有文件需要一起保持同步？”
