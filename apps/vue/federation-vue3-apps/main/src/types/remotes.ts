import type { StoreDefinition } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import type { AxiosRequestConfig } from 'axios'
import type { Component } from 'vue'

export type SubAppStoreDefinitions = Record<string, StoreDefinition>

export interface StoreModuleConfig {
  namespace: string
  stores: SubAppStoreDefinitions
}

export type SubAppAjaxRequestMethod = (
  key: string,
  params?: unknown,
  config?: AxiosRequestConfig,
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
  ajax: SubAppAjaxFactory
}

export interface SubAppConfig {
  prefix: string
  routes: RouteRecordRaw[]
}

export type RemoteComponentModule = Component | { default: Component }
export type RemoteComponentLoader = () => Promise<RemoteComponentModule>
export type RemoteComponentExport = RemoteComponentLoader | RemoteComponentModule

export interface RemoteComponentsExports {
  [name: string]: RemoteComponentExport
}

export type RemoteGlobalComponentModule = Component | { default: Component }
export type RemoteGlobalComponentLoader = () => Promise<RemoteGlobalComponentModule>
export type RemoteGlobalComponentExport =
  | RemoteGlobalComponentLoader
  | RemoteGlobalComponentModule

export interface RemoteGlobalComponentsExports {
  [name: string]: RemoteGlobalComponentExport
}

export type RemoteI18nMessages = Record<string, Record<string, unknown>>

export interface SubAppExports {
  routes: RouteRecordRaw[]
  store: SubAppStoreDefinitions
  ajax: SubAppAjaxFactory
}
