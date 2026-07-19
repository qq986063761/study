# TypeScript 规范

这个文件定义本仓库的 TypeScript 编码预期。

## 默认规则

- 新增源码优先使用 TypeScript。
- 避免 `any`，除非确实没有合理类型且原因清楚。
- 对需要收窄的外部数据，优先使用 `unknown` 而不是 `any`。
- 简单局部变量交给 TypeScript 推断。
- 公共接口、props、emits、store 状态、API 边界和复杂返回值应显式标注类型。

## 命名

- 组件名、类名、接口和类型别名使用 PascalCase。
- 变量、函数、composable 和 store 实例使用 camelCase。
- composable 和 Pinia store 访问函数使用 `useXxx`。
- 当业务含义明确时，避免使用 `data`、`list`、`item` 这类泛名。

## Imports

- 优先使用具名导入。
- 从 `src` 引入且相对路径过长时，优先使用 `@/`。
- 外部依赖导入放在本地导入之前。
- 删除未使用导入，不把清理工作留给工具。

## Vue 类型

- 当模板 ref 会调用组件或 DOM API 时，需要标注类型。
- 组件 ref 可按需使用 `InstanceType<typeof Component>`。
- ref 存在空值阶段时，显式表达 nullability。

## API 与 Store 类型

- API 响应在类型化或归一化前都视为不可信。
- DTO 类型尽量靠近 API 模块。
- store 应暴露类型清晰的状态、派生值和 actions。
- 不要把只属于路由页面或组件内部的状态放进 Pinia。

## 文件作用

用这个文件回答：“这里的 TypeScript 应该多严格、多显式？”
