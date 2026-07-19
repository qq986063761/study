# 子应用联邦接入说明

子应用按约定暴露模块，main 会按需加载并注册 routes、Pinia store、ajax、局部组件、方法式全局组件和 i18n 语言资源。

ajax / 命令式 UI / 跨应用 store 通过共享的 `@main/runtime` 显式引入，**不再挂载到 Vue 全局实例**。

## 1. 暴露入口

子应用在 `vite.config.ts` 中暴露 6 个入口：

```ts
federation({
  name: 'app1',
  filename: 'remoteEntry.js',
  exposes: {
    './routes': './src/exports/routes.ts',
    './store': './src/exports/store.ts',
    './ajax': './src/exports/ajax.ts',
    './i18n': './src/exports/i18n.ts',
    './components': './src/exports/components.ts',
    './plugins': './src/exports/plugins.ts',
  },
})
```

- `./routes`：导出 `RouteRecordRaw[]`，路径不要带 `/app1`、`/app2` 前缀
- `./store`：导出 Pinia store，例如 `export const useStore = useApp1Store`
- `./ajax`：导出 ajax 工厂，接口只写相对路径
- `./i18n`：导出裸语言 messages（不要自带 app1/app2 前缀，main 合并时会补命名空间）
- `./components`：导出局部组件异步加载器
- `./plugins`：导出弹窗类组件对象，供 `@main/runtime` 的 `ui` 方法式调用

## 2. 调用方式（@main/runtime）

命令式能力统一通过联邦 shared 模块引入：

```ts
// 子应用请使用默认导入（consumer 侧 MF loadShare 只 re-export default）
import runtime from '@main/runtime'
const { ajax, ui, store } = runtime

// 主应用内部也可相对路径，避免 dep prebundle 双实例：
// import { ajax, ui, store } from '../runtime'
```

### ajax

```ts
await ajax.app1('getUsers', { source: 'home' })
await ajax.app2('getUsers', { source: 'home' })
await ajax.main('getUsers', { source: 'home' })
```

### 命令式全局组件（ui）

```ts
await ui.main('modal', 'show', { title: 'main 弹窗' })
await ui.app1('modal', 'show', { title: 'app1 弹窗' })
await ui.app2('modal', 'show', { title: 'app2 弹窗' })
```

### 跨应用 Pinia store

```ts
const app1Store = await store.app1('useStore')
const app2Store = await store.app2('useStore')
```

### 路由

由 main 自动加前缀：

```ts
router.push('/app1/about')
```

### 局部联邦组件

通过 `src/exports/components.ts` 暴露后可直接使用：

```ts
export default {
  'app1-card': () => import('../components/App1Card.vue'),
}
```

```vue
<app1-card />
```

### i18n

子应用只导出裸 messages：

```ts
// src/exports/i18n.ts
export default {
  'zh-CN': { message: '这是来自 app1 的中文语言资源' },
  'en-US': { message: 'This English message comes from app1' },
}
```

main 加载后按子应用名补前缀，视图中：

```ts
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
// t('main.message') / t('app1.message') / t('app2.message')
```

## 3. @main/runtime 约定

- main 通过 Module Federation `shared` **提供** `@main/runtime`（本地 `src/runtime/index.ts`）
- app1 / app2 的 shared 配置 `import: false`，仅消费 host 提供的 runtime
- TypeScript 类型统一维护在根目录 `types/main-runtime/index.d.ts`，三个项目通过 `tsconfig.app.json` 的 `paths` 映射
- 子应用联邦模块需要运行在 main 容器中（独立启动时没有 runtime provider）

## 4. appenv 调试

生产包默认加载相对路径下的子应用 `remoteEntry.js`。需要让生产包临时加载本地开发子应用时，加 query 参数：

- `?appenv=dev`：所有子应用都走本地开发服务
- `?appenv=dev,app1`：仅 app1 走本地开发服务
- `?appenv=dev,app1,app2`：app1、app2 都走本地开发服务

## 5. 检查清单

- 子应用 `name` 要和 main 的 remote 名一致
- 必须暴露 `./routes`、`./store`、`./ajax`、`./i18n`、`./components`、`./plugins`
- routes 不写主应用挂载前缀
- ajax 只写相对接口路径
- i18n 只导出裸 messages，不要自带 app 名前缀
- `./components` 只放局部组件加载器
- `./plugins` 只放弹窗类组件对象，key 要稳定，例如 `modal`
- `vue`、`vue-router`、`pinia`、`element-plus`、`vue-i18n` 保持 shared singleton
- `@main/runtime`：main 提供、app1/app2 `import: false`
