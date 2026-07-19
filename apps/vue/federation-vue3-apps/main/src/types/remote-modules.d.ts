declare module 'app1/routes' {
  const routes: import('vue-router').RouteRecordRaw[]
  export default routes
}

declare module 'app1/store' {
  export const useApp1Store: import('pinia').StoreDefinition
  export const useStore: import('pinia').StoreDefinition
}

declare module 'app1/ajax' {
  const ajax: import('@/types/remotes').SubAppAjaxFactory
  export default ajax
}

declare module 'app1/i18n' {
  const messages: import('@/types/remotes').RemoteI18nMessages
  export default messages
}

declare module 'app1/components' {
  const components: import('@/types/remotes').RemoteComponentsExports
  export default components
}

declare module 'app1/global-components' {
  const globalComponents: import('@/types/remotes').RemoteGlobalComponentsExports
  export default globalComponents
}

declare module 'app2/routes' {
  const routes: import('vue-router').RouteRecordRaw[]
  export default routes
}

declare module 'app2/store' {
  export const useApp2Store: import('pinia').StoreDefinition
  export const useStore: import('pinia').StoreDefinition
}

declare module 'app2/ajax' {
  const ajax: import('@/types/remotes').SubAppAjaxFactory
  export default ajax
}

declare module 'app2/i18n' {
  const messages: import('@/types/remotes').RemoteI18nMessages
  export default messages
}

declare module 'app2/components' {
  const components: import('@/types/remotes').RemoteComponentsExports
  export default components
}

declare module 'app2/global-components' {
  const globalComponents: import('@/types/remotes').RemoteGlobalComponentsExports
  export default globalComponents
}
