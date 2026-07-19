export type AjaxConfig = Record<string, unknown>

export type AjaxInvoker = (
  method: string,
  params?: unknown,
  config?: AjaxConfig
) => Promise<unknown>

export type UiInvoker = (
  componentName: string,
  methodName: string,
  ...args: unknown[]
) => Promise<unknown>

export interface RuntimeAjax {
  main: AjaxInvoker
  app1: AjaxInvoker
  app2: AjaxInvoker
}

export interface RuntimeUi {
  main: UiInvoker
  app1: UiInvoker
  app2: UiInvoker
}

export const ajax: RuntimeAjax
export const ui: RuntimeUi
