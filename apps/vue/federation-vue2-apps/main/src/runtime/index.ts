import type { AxiosRequestConfig } from 'axios'
import { invokeAjax } from '../ajax'
import { invokeGlobalComponent } from '../remote/global-components'

type AjaxInvoker = (
  method: string,
  params?: unknown,
  config?: AxiosRequestConfig
) => Promise<unknown>

type UiInvoker = (
  componentName: string,
  methodName: string,
  ...args: unknown[]
) => Promise<unknown>

function createAjaxInvoker(appName: string): AjaxInvoker {
  return (method, params, config) => invokeAjax(appName, method, params, config)
}

function createUiInvoker(appName: string): UiInvoker {
  return (componentName, methodName, ...args) => (
    invokeGlobalComponent(appName, componentName, methodName, ...args)
  )
}

// runtime 是各联邦应用唯一的命令式能力入口，具体加载与实例管理仍由 main 负责。
export const ajax = {
  main: createAjaxInvoker('main'),
  app1: createAjaxInvoker('app1'),
  app2: createAjaxInvoker('app2')
}

export const ui = {
  main: createUiInvoker('main'),
  app1: createUiInvoker('app1'),
  app2: createUiInvoker('app2')
}
