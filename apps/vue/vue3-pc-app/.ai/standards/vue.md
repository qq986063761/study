# Vue 规范

这个文件定义本仓库的 Vue 编码规范。

## SFC 默认约定

- 新增 `.vue` 文件优先使用 `<script setup lang="ts">`。
- 组件名要清晰，并与文件名保持语义一致。
- 新代码优先使用 Composition API，不主动引入 Options API。
- 有目的地使用 `defineProps`、`defineEmits`、`defineModel` 和 `defineExpose`。
- 新组件的 props 和 emits 应尽量类型化。

## 推荐 SFC 顺序

新文件推荐使用以下顺序：

```vue
<script setup lang="ts">
</script>

<template>
</template>

<style scoped>
</style>
```

编辑已有文件时，除非任务包含整理结构，否则保留原文件顺序。

## 响应式规则

- 基础值或会整体替换的值使用 `ref`。
- 成组对象状态使用 `reactive`。
- 派生值使用 `computed`，不要手动同步多个 ref。
- `watch` 只用于副作用或外部集成。
- 避免用会丢失响应式的方式解构 reactive 对象、props 或 store。

## Props 与 Emits

- Props 应显式、可读、类型清楚。
- Emits 应显式声明，可行时也要类型化。
- 不要直接修改 props。
- 双向绑定优先使用 Vue 3 写法：
  - 语义清晰且项目支持时使用 `defineModel`。
  - 需要贴合已有代码或演示模式时，使用 `modelValue` 加 `update:modelValue`。

## 组件规则

- 可复用组件放到 `src/components`。
- 只在项目引入局部页面目录结构时，页面私有组件才贴近页面存放。
- 组件职责要单一清楚。
- 重复逻辑抽到 `src/composables`。

## 路由规则

- 路由视图放到 `src/views`。
- 路由注册在 `src/router/index.ts`。
- 顶层导航页面需要同步更新 `src/App.vue` 中的菜单。
- 路由 `name` 使用稳定的 PascalCase。

## 文件作用

用这个文件回答：“本仓库里的好 Vue 代码应该是什么样？”
