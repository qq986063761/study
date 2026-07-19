import { RouteConfig } from 'vue-router'
import { AxiosRequestConfig } from 'axios'
import type { LocaleMessages } from 'vue-i18n'

// ============ 子应用 Store 模块配置 ============
export interface StoreModuleConfig {
  namespace: string
  module: {
    namespaced?: boolean
    state?: Record<string, unknown>
    getters?: Record<string, (...args: unknown[]) => unknown>
    mutations?: Record<string, (...args: unknown[]) => void>
    actions?: Record<string, (...args: unknown[]) => unknown>
    modules?: Record<string, unknown>
  }
}

// ============ 子应用 Ajax 配置 ============
export type SubAppAjaxRequestMethod = (
  key: string,
  params?: unknown,
  config?: AxiosRequestConfig
) => Promise<unknown>

export interface InjectedSubAppAjax {
  appName: string
  get: SubAppAjaxRequestMethod
  post: SubAppAjaxRequestMethod
  put: SubAppAjaxRequestMethod
  patch: SubAppAjaxRequestMethod
  delete: SubAppAjaxRequestMethod
}

export interface SubAppAjaxFactoryOptions {
  ajax: InjectedSubAppAjax
}

export interface SubAppAjaxModule {
  apiList: Record<string, string>
  ajaxList: Record<string, (...args: unknown[]) => Promise<unknown>>
}

export type SubAppAjaxFactory = (options: SubAppAjaxFactoryOptions) => SubAppAjaxModule

export interface AjaxConfig {
  name: string
  path?: string
  ajax: SubAppAjaxFactory
}

// ============ 子应用配置（路由注册用） ============
export interface SubAppConfig {
  prefix: string
  routes: Array<RouteConfig>
}

// ============ 子应用拆分入口类型 ============
export type RemoteRoutesExports = RouteConfig[]
export type RemoteStoreExports = StoreModuleConfig['module']
export type RemoteAjaxExports = SubAppAjaxFactory

// ============ 子应用 i18n 语言资源入口类型 ============
export type RemoteI18nMessages = LocaleMessages

// ============ 子应用联邦组件入口类型 ============
export type RemoteComponentModule = import('vue').Component | { default: import('vue').Component }
export type RemoteComponentLoader = () => Promise<RemoteComponentModule>
export type RemoteComponentExport = RemoteComponentLoader | RemoteComponentModule
export interface RemoteComponentsExports {
  [name: string]: RemoteComponentExport
}

// ============ 子应用全局弹窗类组件入口类型 ============
export type RemoteGlobalComponentModule = import('vue').Component | { default: import('vue').Component }
export interface RemoteGlobalAsyncComponentOptions {
  component: Promise<RemoteGlobalComponentModule>
}
export type RemoteGlobalComponentLoader = () => Promise<RemoteGlobalComponentModule> | RemoteGlobalAsyncComponentOptions
export type RemoteGlobalComponentExport = RemoteGlobalComponentLoader | RemoteGlobalComponentModule
export interface RemoteGlobalComponentsExports {
  [name: string]: RemoteGlobalComponentExport
}

// ============ 联邦容器内部类型 ============
export type RemoteExposedModule =
  | './routes'
  | './store'
  | './ajax'
  | './i18n'
  | './components'
  | './global-components'

export interface RemoteModule {
  name: string
  entry: string
}

export interface RemoteContainer {
  init: (shareScope: unknown) => Promise<void> | void
  get: (module: string) => Promise<() => unknown>
}

export interface RemoteDefaultExport<T> {
  default: T
}
