# 子应用联邦接入说明

子应用按约定暴露模块，main 会按需加载并注册 routes、Vuex store、ajax、局部组件和方法式全局组件。ajax 与命令式组件通过共享的 `@main/runtime` 显式引入，不再挂载到 Vue 全局实例。

## 1. 暴露入口

子应用在 `vue.config.js` 中暴露 5 个入口：

```js
new ModuleFederationPlugin({
  name: 'app1',
  filename: 'remoteEntry.js',
  exposes: {
    './routes': './src/exports/routes.ts',
    './store': './src/exports/store.ts',
    './ajax': './src/exports/ajax.ts',
    './components': './src/exports/components.ts',
    './plugins': './src/exports/plugins.ts'
  }
})
```

- `./routes`：导出路由配置，路径不要带 `/app1`、`/app2` 前缀
- `./store`：导出 Vuex module，不要写 `namespaced: true`
- `./ajax`：导出 ajax 工厂，接口只写相对路径
- `./components`：导出局部组件异步加载器
- `./plugins`：导出弹窗类组件对象，供 `ui.app1/ui.app2` 方法式调用

## 2. 调用方式

路由由 main 自动加前缀：

```ts
this.$router.push('/app1/about')
```

store 由 main 统一加命名空间：

```ts
this.$store.state.app1.count
this.$store.dispatch('app1/incrementAsync')
```

ajax 通过 main 提供的共享 runtime 调用：

```ts
import { ajax } from '@main/runtime'

await ajax.app1('getUsers', { source: 'home' })
```

局部组件通过 `src/exports/components.ts` 暴露后可直接使用：

```ts
export default {
  'app1-card': () => import('../components/App1Card.vue')
}
```

```vue
<app1-card />
```

弹窗插件通过 `src/exports/plugins.ts` 暴露：

```ts
export default {
  modal: () => import(/* webpackChunkName: "app1-global-modal" */ '../components/modal.vue')
}
```

全局组件必须使用动态 `import()` 异步导出，首次调用对应的 `ui.appX` 方法时才加载组件 chunk。

组件提供 `show` / `hide` 等方法后，通过共享 runtime 调用：

```ts
import { ui } from '@main/runtime'

await ui.main('modal', 'show', { title: 'main 弹窗' })
await ui.app1('modal', 'show', { title: 'app1 弹窗' })
await ui.app2('modal', 'show', { title: 'app2 弹窗' })
```

子应用页面被 main 加载后，也可以跨应用调用：

```ts
await ui.app2('modal', 'show', { source: 'app1-home' })
await ui.app1('modal', 'show', { source: 'app2-home' })
```

`@main/runtime` 由 main 通过 Module Federation `shared` 提供，子应用仅消费且没有本地 fallback，因此 app1/app2 的联邦模块需要运行在 main 容器中。

TypeScript 类型统一维护在根目录 `types/main-runtime/index.d.ts`，三个项目通过 `tsconfig.json` 的 `paths` 将 `@main/runtime` 映射到该声明文件。`paths` 只负责编辑器和类型解析，Webpack 运行时仍由 Module Federation `shared` 提供模块。

## 3. appenv 调试

生产包默认加载相对路径下的子应用 `remoteEntry.js`。需要让生产包临时加载本地开发子应用时，加 query 参数：

- `?appenv=dev`：所有子应用都走本地开发服务
- `?appenv=dev,app1`：仅 app1 走本地开发服务
- `?appenv=dev,app1,app2`：app1、app2 都走本地开发服务

## 4. 检查清单

- 子应用 `name` 要和 main 的 remote 名一致
- 必须暴露 `./routes`、`./store`、`./ajax`、`./components`、`./plugins`
- routes 不写主应用挂载前缀
- ajax 只写相对接口路径
- store 不写 `namespaced: true`
- `./components` 只放局部组件加载器
- `./plugins` 只放弹窗类异步组件加载器，key 要稳定，例如 `modal`
- main、app1、app2 的 `shared` 配置必须使用相同的 `@main/runtime` shareKey
- app1、app2 的 `@main/runtime` 必须设置 `import: false`，避免打包出独立 runtime
- 三个项目的 `tsconfig.json` 必须保留 `@main/runtime` 类型路径映射
- main 的异步 chunk 文件名需要包含 `contenthash`，避免开发模式下 shared provider 输出同名文件
- `vue`、`vue-router`、`vuex`、`element-ui` 保持一致版本
