import Vue from 'vue'
import type { ComponentOptions, VueConstructor } from 'vue'
import router from '../router'
import store from '../store'
import MainModal from '../components/modal.vue'
import { loadRemoteGlobalComponents } from './modules'
import type {
  RemoteGlobalAsyncComponentOptions,
  RemoteGlobalComponentExport,
  RemoteGlobalComponentLoader,
  RemoteGlobalComponentModule,
  RemoteGlobalComponentsExports
} from './types'

type GlobalComponentVm = Vue & Record<string, unknown>
type GlobalComponentMethod = (...args: unknown[]) => unknown

const localGlobalComponents: RemoteGlobalComponentsExports = {
  modal: MainModal
}

const remoteGlobalComponentMap: Record<string, RemoteGlobalComponentsExports> = {}
const globalComponentVmMap: Record<string, Record<string, GlobalComponentVm>> = {}
const loadingRemoteGlobalComponents = new Map<string, Promise<RemoteGlobalComponentsExports>>()
const loadingGlobalComponentVms = new Map<string, Promise<GlobalComponentVm>>()

/**
 * 按应用、组件及方法调用命令式组件，远程组件保持首次调用时懒加载。
 */
export async function invokeGlobalComponent(
  appName: string,
  componentName: string,
  methodName: string,
  ...args: unknown[]
): Promise<unknown> {
  if (!componentName) {
    throw new Error(`[main] 调用 ${appName} 全局组件时缺少组件名`)
  }
  if (!methodName) {
    throw new Error(`[main] 调用 ${appName} 全局组件 ${componentName} 时缺少方法名`)
  }

  if (appName === 'main') {
    return invokeLocalGlobalComponent(componentName, methodName, ...args)
  }

  const components = await ensureRemoteGlobalComponents(appName)
  const exported = components[componentName]
  if (!exported) {
    throw new Error(`[main] 子应用 ${appName} 的 global-components 未导出 ${componentName}`)
  }

  return invokeGlobalComponentMethod(appName, componentName, exported, methodName, ...args)
}

function invokeLocalGlobalComponent(
  componentName: string,
  methodName: string,
  ...args: unknown[]
): Promise<unknown> {
  const exported = localGlobalComponents[componentName]
  if (!exported) {
    return Promise.reject(new Error(`[main] 本地 global-components 未注册 ${componentName}`))
  }

  return invokeGlobalComponentMethod('main', componentName, exported, methodName, ...args)
}

async function ensureRemoteGlobalComponents(appName: string): Promise<RemoteGlobalComponentsExports> {
  const cachedComponents = remoteGlobalComponentMap[appName]
  if (cachedComponents) return cachedComponents

  const existingLoader = loadingRemoteGlobalComponents.get(appName)
  if (existingLoader) return existingLoader

  const loader = loadRemoteGlobalComponents(appName)
    .then((components) => {
      remoteGlobalComponentMap[appName] = components
      console.log(`[main] 子应用 ${appName} global-components 已加载:`, components)
      return components
    })
    .finally(() => {
      loadingRemoteGlobalComponents.delete(appName)
    })

  loadingRemoteGlobalComponents.set(appName, loader)
  return loader
}

async function invokeGlobalComponentMethod(
  appName: string,
  componentName: string,
  exported: RemoteGlobalComponentExport,
  methodName: string,
  ...args: unknown[]
): Promise<unknown> {
  const vm = await getGlobalComponentVm(appName, componentName, exported)
  const method = vm[methodName]

  if (typeof method !== 'function') {
    throw new Error(`[main] 全局组件 ${appName}.${componentName} 未提供方法 ${methodName}`)
  }

  return Promise.resolve((method as GlobalComponentMethod).apply(vm, args))
}

async function getGlobalComponentVm(
  appName: string,
  componentName: string,
  exported: RemoteGlobalComponentExport
): Promise<GlobalComponentVm> {
  const vmMap = globalComponentVmMap[appName] || (globalComponentVmMap[appName] = {})
  const cachedVm = vmMap[componentName]
  if (cachedVm) return cachedVm

  const cacheKey = `${appName}:${componentName}`
  const existingLoader = loadingGlobalComponentVms.get(cacheKey)
  if (existingLoader) return existingLoader

  const loader = createGlobalComponentVm(appName, componentName, exported)
    .then((vm) => {
      vmMap[componentName] = vm
      return vm
    })
    .finally(() => {
      loadingGlobalComponentVms.delete(cacheKey)
    })

  loadingGlobalComponentVms.set(cacheKey, loader)
  return loader
}

async function createGlobalComponentVm(
  appName: string,
  componentName: string,
  exported: RemoteGlobalComponentExport
): Promise<GlobalComponentVm> {
  const component = await resolveGlobalComponent(appName, componentName, exported)
  const ComponentCtor = createGlobalComponentCtor(component)
  const vm = new ComponentCtor({ router, store }) as GlobalComponentVm

  vm.$mount()
  document.body.appendChild(vm.$el)
  console.log(`[main] 全局组件 ${appName}.${componentName} 单例已创建`)

  return vm
}

function createGlobalComponentCtor(component: import('vue').Component): VueConstructor<Vue> {
  if (isVueComponentConstructor(component)) {
    return component
  }

  return Vue.extend(component as unknown as ComponentOptions<Vue>)
}

async function resolveGlobalComponent(
  appName: string,
  componentName: string,
  exported: RemoteGlobalComponentExport
): Promise<import('vue').Component> {
  if (!exported) {
    throw new Error(`[main] 子应用 ${appName} 的 global-components 未导出 ${componentName}`)
  }

  if (isRemoteGlobalComponentLoader(exported)) {
    const componentModule = await exported()
    return resolveGlobalComponentModule(appName, componentName, componentModule)
  }

  return resolveGlobalComponentModule(appName, componentName, exported)
}

async function resolveGlobalComponentModule(
  appName: string,
  componentName: string,
  exported: RemoteGlobalAsyncComponentOptions | RemoteGlobalComponentModule | RemoteGlobalComponentExport
): Promise<import('vue').Component> {
  if (isRemoteGlobalAsyncComponentOptions(exported)) {
    const componentModule = await exported.component
    return unwrapGlobalComponent(appName, componentName, componentModule)
  }

  return unwrapGlobalComponent(appName, componentName, exported)
}

function unwrapGlobalComponent(
  appName: string,
  componentName: string,
  exported: RemoteGlobalComponentModule | RemoteGlobalComponentExport
): import('vue').Component {
  if (isVueComponentConstructor(exported) || isVueComponentLike(exported)) {
    return exported
  }

  if (exported && typeof exported === 'object' && 'default' in exported) {
    const maybeModule = exported as { default?: import('vue').Component }
    if (maybeModule.default) return maybeModule.default
  }

  throw new Error(`[main] 子应用 ${appName} 的 global-components 导出 ${componentName} 不是可用组件`)
}

function isRemoteGlobalAsyncComponentOptions(value: unknown): value is RemoteGlobalAsyncComponentOptions {
  const component = value && typeof value === 'object'
    ? (value as { component?: unknown }).component
    : undefined

  return Boolean(component && typeof (component as Promise<unknown>).then === 'function')
}

function isRemoteGlobalComponentLoader(
  value: RemoteGlobalComponentExport
): value is RemoteGlobalComponentLoader {
  return typeof value === 'function' && !isVueComponentConstructor(value)
}

function isVueComponentConstructor(value: unknown): value is VueConstructor<Vue> {
  return Boolean(
    value
    && typeof value === 'function'
    && ('cid' in value
      || 'options' in value
      || 'superOptions' in value
      || 'extendOptions' in value)
  )
}

function isVueComponentLike(value: unknown): value is import('vue').Component {
  return Boolean(
    value
    && typeof value === 'object'
    && ('render' in (value as Record<string, unknown>)
      || 'template' in (value as Record<string, unknown>)
      || 'functional' in (value as Record<string, unknown>)
      || 'components' in (value as Record<string, unknown>))
  )
}
