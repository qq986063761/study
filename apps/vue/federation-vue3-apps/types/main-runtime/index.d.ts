/**
 * ============ @main/runtime ambient module ============
 *
 * 运行时由 Module Federation shared 提供；
 * TypeScript 通过本 ambient 声明解析 import '@main/runtime'。
 *
 * ⚠️ 此文件不得包含任何顶层 import / export 语句，
 *    否则 TS 会将其视为模块文件，declare module 会变成 augmentation。
 */

declare module '@main/runtime' {
  import type { AxiosRequestConfig } from 'axios'
  import type { StoreGeneric } from 'pinia'

  export type AjaxConfig = AxiosRequestConfig

  export type AjaxInvoker = (
    method: string,
    params?: unknown,
    config?: AjaxConfig,
  ) => Promise<unknown>

  export type UiInvoker = (
    componentName: string,
    methodName: string,
    ...args: unknown[]
  ) => Promise<unknown>

  export type StoreInvoker = (storeName: string) => Promise<StoreGeneric>

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

  export interface RuntimeStore {
    app1: StoreInvoker
    app2: StoreInvoker
  }

  export const ajax: RuntimeAjax
  export const ui: RuntimeUi
  export const store: RuntimeStore

  /**
   * 默认导出。子应用 consumer（import: false）侧 MF loadShare 只 re-export default，
   * 命名导入会链接失败，请优先使用：
   *   import runtime from '@main/runtime'
   *   runtime.ajax / runtime.ui / runtime.store
   */
  export interface MainRuntime {
    ajax: RuntimeAjax
    ui: RuntimeUi
    store: RuntimeStore
  }

  const _default: MainRuntime
  export default _default
}
