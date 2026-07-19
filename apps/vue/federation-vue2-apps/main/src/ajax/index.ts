import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { AjaxConfig, InjectedSubAppAjax, SubAppAjaxModule } from '../remote/types'

export type AjaxRequestMethod = (...args: unknown[]) => Promise<unknown>

export interface MainAjaxList {
  getUsers: AjaxRequestMethod
  [key: string]: AjaxRequestMethod
}

type SubAppAjaxMethodName = 'get' | 'post' | 'put' | 'patch' | 'delete'
type SubAppAjaxLoader = (name: string) => Promise<void>

// 主应用自身的 ajax 实例
const mainAjax: AxiosInstance = axios.create({
  baseURL: '/',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 —— 主应用
mainAjax.interceptors.request.use(
  config => {
    console.log('[main] request:', config.url)
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器 —— 主应用
mainAjax.interceptors.response.use(
  response => {
    console.log('[main] response:', response.config.url)
    return response
  },
  error => {
    const url = error && error.config ? error.config.url : undefined
    console.error('[main] response error:', url)
    return Promise.reject(error)
  }
)

// 主应用自身接口配置
const mainApiList = {
  getUsers: '/getUsers'
}

const mainAjaxList: MainAjaxList = {
  getUsers(params = {}) {
    return mainAjax.post(mainApiList.getUsers, params)
  }
}

/**
 * 子应用 ajax 配置注册表
 * key: 子应用名称 (app1 / app2)
 * value: 子应用声明的 apiList 经主应用 path 前缀处理后的 apiList 和 ajaxList
 */
let subAppAjaxMap: Record<string, SubAppAjaxModule> = {}
let subAppAjaxLoader: SubAppAjaxLoader | undefined

function normalizePath(path: string): string {
  const normalized = path.replace(/\/+$/, '')
  return normalized.startsWith('/') ? normalized : `/${normalized}`
}

function createApiPath(path: string, api: string): string {
  return `${path.replace(/\/+$/, '')}/${api.replace(/^\/+/, '')}`
}

function prefixSubAppApiList(path: string, apiList: Record<string, string>): Record<string, string> {
  return Object.keys(apiList).reduce<Record<string, string>>((prefixedApiList, key) => {
    prefixedApiList[key] = createApiPath(path, apiList[key])
    return prefixedApiList
  }, {})
}

function resolveSubAppApiUrl(appName: string, key: string): string {
  const apiList = subAppAjaxMap[appName] && subAppAjaxMap[appName].apiList
  if (!apiList) {
    throw new Error(`[main] 未找到子应用 ${appName} 的 apiList 配置`)
  }

  const url = apiList[key]
  if (!url) {
    throw new Error(`[main] 未找到子应用 ${appName} 的接口映射: ${key}`)
  }

  return url
}

function requestSubAppApi(
  this: InjectedSubAppAjax,
  method: SubAppAjaxMethodName,
  key: string,
  params?: unknown,
  config?: AxiosRequestConfig
): Promise<unknown> {
  const url = resolveSubAppApiUrl(this.appName, key)

  switch (method) {
    case 'get': {
      const requestConfig: AxiosRequestConfig = { ...(config || {}) }
      if (params !== undefined) requestConfig.params = params
      return mainAjax.get(url, requestConfig)
    }
    case 'post':
      return mainAjax.post(url, params, config)
    case 'put':
      return mainAjax.put(url, params, config)
    case 'patch':
      return mainAjax.patch(url, params, config)
    case 'delete': {
      const requestConfig: AxiosRequestConfig = { ...(config || {}) }
      if (params !== undefined) requestConfig.data = params
      return mainAjax.delete(url, requestConfig)
    }
    default:
      return Promise.reject(new Error(`[main] 不支持的请求方法: ${method}`))
  }
}

function createSubAppAjaxProxy(appName: string): InjectedSubAppAjax {
  return {
    appName,
    get(key, params, config) {
      return requestSubAppApi.call(this, 'get', key, params, config)
    },
    post(key, params, config) {
      return requestSubAppApi.call(this, 'post', key, params, config)
    },
    put(key, params, config) {
      return requestSubAppApi.call(this, 'put', key, params, config)
    },
    patch(key, params, config) {
      return requestSubAppApi.call(this, 'patch', key, params, config)
    },
    delete(key, params, config) {
      return requestSubAppApi.call(this, 'delete', key, params, config)
    }
  }
}

async function ensureSubAppAjaxModule(appName: string): Promise<SubAppAjaxModule> {
  const currentAjaxModule = subAppAjaxMap[appName]
  if (currentAjaxModule) return currentAjaxModule

  if (!subAppAjaxLoader) {
    throw new Error(`[main] 子应用 ${appName} 的 ajax 懒加载器未初始化`)
  }

  // 子应用 ajax 未注册时，只拉取该子应用的 ./ajax 模块，避免顺带加载 routes/store。
  await subAppAjaxLoader(appName)

  const loadedAjaxModule = subAppAjaxMap[appName]
  if (!loadedAjaxModule) {
    throw new Error(`[main] 子应用 ${appName} 加载完成，但未注册 ajax 配置`)
  }

  return loadedAjaxModule
}

/**
 * 注入子应用 ajax 懒加载器，由 runtime 首次调用对应子应用接口时触发。
 */
export function setSubAppAjaxLoader(loader: SubAppAjaxLoader): void {
  subAppAjaxLoader = loader
}

/**
 * 按应用名和方法名调用接口，子应用接口未注册时保持原有懒加载行为。
 */
export async function invokeAjax(
  appName: string,
  method: string,
  params?: unknown,
  config?: AxiosRequestConfig
): Promise<unknown> {
  if (!method) {
    throw new Error(`[main] 调用 ${appName} ajax 时缺少方法名`)
  }

  if (appName === 'main') {
    const mainAjaxMethod = mainAjaxList[method]
    if (!mainAjaxMethod) {
      throw new Error(`[main] 未找到主应用 ajax 方法: ${method}`)
    }
    return mainAjaxMethod(params, config)
  }

  const appAjaxModule = await ensureSubAppAjaxModule(appName)
  const appAjaxMethod = appAjaxModule.ajaxList[method]
  if (!appAjaxMethod) {
    throw new Error(`[main] 未找到子应用 ${appName} 的 ajax 方法: ${method}`)
  }

  return appAjaxMethod(params, config)
}

/**
 * 注册子应用 ajax 配置
 * 子应用只声明相对接口配置，主应用在这里注入统一的 axios 实例并统一追加子应用 url 前缀
 */
export function registerSubAppAjax(configs: AjaxConfig[]): void {
  subAppAjaxMap = configs.reduce<Record<string, SubAppAjaxModule>>((ajaxMap, { name, path, ajax }) => {
    if (ajaxMap[name]) {
      console.log(`[main] 子应用 ${name} 的 ajax 配置已存在，跳过重复注册`)
      return ajaxMap
    }

    const appPath = normalizePath(path || `/${name}`)
    const subAppAjax = createSubAppAjaxProxy(name)
    const appAjaxModule = ajax({ ajax: subAppAjax })
    const prefixedAjaxModule = {
      ...appAjaxModule,
      apiList: prefixSubAppApiList(appPath, appAjaxModule.apiList)
    }
    console.log(`[main] 子应用 ${name} 的 ajax 配置已注册，path: ${appPath}`)

    return {
      ...ajaxMap,
      [name]: prefixedAjaxModule
    }
  }, subAppAjaxMap)

  console.log('[main] 当前注册的子应用 ajax 配置:', subAppAjaxMap)
}

/**
 * 获取指定子应用组合后的 ajax 配置
 * @param name - 子应用名称
 * @returns 子应用 apiList 和 ajaxList，未注册时返回 undefined
 */
export function getSubAppAjax(name: string): SubAppAjaxModule | undefined {
  return subAppAjaxMap[name]
}

export { mainAjax }
export default mainAjax
