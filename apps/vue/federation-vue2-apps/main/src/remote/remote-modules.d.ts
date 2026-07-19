/**
 * ============ Module Federation 远程模块类型声明 ============
 *
 * 远程模块通过 Webpack Module Federation remotes 按 routes / store / ajax / components 拆分加载。
 *
 * ⚠️ 此文件不得包含任何顶层 import / export 语句
 *    否则 TypeScript 会将其视为"模块文件"，
 *    其中的 declare module 会变成模块扩充（augmentation）而非声明全新的 ambient module
 */

// app1 业务路由模块类型
declare module 'app1/routes' {
  const routes: import('./types').RemoteRoutesExports
  export default routes
}

// app1 Store 模块类型
declare module 'app1/store' {
  const store: import('./types').RemoteStoreExports
  export default store
}

// app1 Ajax 模块类型
declare module 'app1/ajax' {
  const ajax: import('./types').RemoteAjaxExports
  export default ajax
}

// app1 i18n 语言资源模块类型
declare module 'app1/i18n' {
  const messages: import('./types').RemoteI18nMessages
  export default messages
}

// app1 联邦组件模块类型
declare module 'app1/components' {
  const components: import('./types').RemoteComponentsExports
  export default components
}

// app1 全局弹窗类组件模块类型
declare module 'app1/global-components' {
  const globalComponents: import('./types').RemoteGlobalComponentsExports
  export default globalComponents
}

// app2 业务路由模块类型
declare module 'app2/routes' {
  const routes: import('./types').RemoteRoutesExports
  export default routes
}

// app2 Store 模块类型
declare module 'app2/store' {
  const store: import('./types').RemoteStoreExports
  export default store
}

// app2 Ajax 模块类型
declare module 'app2/ajax' {
  const ajax: import('./types').RemoteAjaxExports
  export default ajax
}

// app2 i18n 语言资源模块类型
declare module 'app2/i18n' {
  const messages: import('./types').RemoteI18nMessages
  export default messages
}

// app2 联邦组件模块类型
declare module 'app2/components' {
  const components: import('./types').RemoteComponentsExports
  export default components
}

// app2 全局弹窗类组件模块类型
declare module 'app2/global-components' {
  const globalComponents: import('./types').RemoteGlobalComponentsExports
  export default globalComponents
}
