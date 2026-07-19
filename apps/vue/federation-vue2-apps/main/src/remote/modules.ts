import { getSubAppAjax, registerSubAppAjax } from '../ajax'
import { getRemoteModule } from './config'
import { loadRemoteDefault } from './container'
import type {
  RemoteComponentsExports,
  RemoteGlobalComponentsExports,
  RemoteI18nMessages,
  StoreModuleConfig,
  SubAppAjaxFactory,
  SubAppConfig
} from './types'

const loadingSubAppAjax = new Map<string, Promise<void>>()

export function loadRemoteRoutes(name: string): Promise<SubAppConfig['routes']> {
  return loadRemoteDefault<SubAppConfig['routes']>(name, './routes')
}

export function loadRemoteStore(name: string): Promise<StoreModuleConfig['module']> {
  return loadRemoteDefault<StoreModuleConfig['module']>(name, './store')
}

export function loadRemoteAjax(name: string): Promise<SubAppAjaxFactory> {
  return loadRemoteDefault<SubAppAjaxFactory>(name, './ajax')
}

export function loadRemoteI18n(name: string): Promise<RemoteI18nMessages> {
  return loadRemoteDefault<RemoteI18nMessages>(name, './i18n')
}

/**
 * 加载子应用通过 './components' 暴露的联邦组件模块
 * 同步拉取 './ajax' 注册组件自用请求能力，不会注册该子应用的 routes/store
 */
export async function loadRemoteComponents(name: string): Promise<RemoteComponentsExports> {
  const [componentsModule] = await Promise.all([
    loadRemoteDefault<RemoteComponentsExports>(name, './components'),
    loadSubAppAjax(name)
  ])

  return componentsModule
}

/**
 * 加载子应用通过 './global-components' 暴露的弹窗类组件模块
 * 同步拉取 './ajax'，让弹窗实例内部可以通过 @main/runtime 请求对应子应用接口。
 */
export async function loadRemoteGlobalComponents(name: string): Promise<RemoteGlobalComponentsExports> {
  const [globalComponentsModule] = await Promise.all([
    loadRemoteDefault<RemoteGlobalComponentsExports>(name, './global-components'),
    loadSubAppAjax(name)
  ])

  return globalComponentsModule
}

function registerRemoteAjax(name: string, ajax: SubAppAjaxFactory): void {
  if (getSubAppAjax(name)) return

  registerSubAppAjax([
    {
      name,
      path: `/${name}`,
      ajax
    }
  ])
}

/**
 * 仅加载并注册子应用 './ajax'，不触发 routes / store。
 */
export async function loadSubAppAjax(name: string): Promise<void> {
  if (getSubAppAjax(name)) return

  const existingLoading = loadingSubAppAjax.get(name)
  if (existingLoading) return existingLoading

  if (!getRemoteModule(name)) {
    throw new Error(`[main] 未找到子应用配置: ${name}`)
  }

  const ajaxLoading = loadRemoteAjax(name)
    .then((ajax) => {
      registerRemoteAjax(name, ajax)
    })
    .finally(() => {
      loadingSubAppAjax.delete(name)
    })

  loadingSubAppAjax.set(name, ajaxLoading)
  return ajaxLoading
}
