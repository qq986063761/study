import type { AxiosRequestConfig } from 'axios'
import type { StoreGeneric } from 'pinia'
import { invokeAjax } from '../ajax'
import { invokeGlobalComponent } from '../global-components'
import { invokeSubAppStore } from '../stores'

type AjaxInvoker = (
  method: string,
  params?: unknown,
  config?: AxiosRequestConfig,
) => Promise<unknown>

type UiInvoker = (
  componentName: string,
  methodName: string,
  ...args: unknown[]
) => Promise<unknown>

type StoreInvoker = (storeName: string) => Promise<StoreGeneric>

function createAjaxInvoker(appName: string): AjaxInvoker {
  return (method, params, config) => invokeAjax(appName, method, params, config)
}

function createUiInvoker(appName: string): UiInvoker {
  return (componentName, methodName, ...args) =>
    invokeGlobalComponent(appName, componentName, methodName, ...args)
}

function createStoreInvoker(appName: string): StoreInvoker {
  return (storeName) => invokeSubAppStore(appName, storeName)
}

// runtime 是各联邦应用唯一的命令式能力入口，具体加载与实例管理仍由 main 负责。
export const ajax = {
  main: createAjaxInvoker('main'),
  app1: createAjaxInvoker('app1'),
  app2: createAjaxInvoker('app2'),
}

export const ui = {
  main: createUiInvoker('main'),
  app1: createUiInvoker('app1'),
  app2: createUiInvoker('app2'),
}

export const store = {
  app1: createStoreInvoker('app1'),
  app2: createStoreInvoker('app2'),
}

/**
 * 默认导出：子应用（import: false 的 consumer）侧 MF loadShare 只 re-export default，
 * 命名导入 `import { ajax, ui, store }` 会链接失败。
 * 统一：`import runtime from '@main/runtime'` 后使用 runtime.ajax / runtime.ui / runtime.store
 */
const runtime = { ajax, ui, store }
export default runtime
