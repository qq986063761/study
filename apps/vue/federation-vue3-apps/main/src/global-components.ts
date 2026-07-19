import { createVNode, render, type App, type Component } from 'vue'
import MainModal from './components/modal.vue'
import type {
  RemoteGlobalComponentExport,
  RemoteGlobalComponentLoader,
  RemoteGlobalComponentModule,
  RemoteGlobalComponentsExports,
} from './types/remotes'

type GlobalComponentVm = Record<string, unknown>
type GlobalComponentMethod = (...args: unknown[]) => unknown

const localGlobalComponents: RemoteGlobalComponentsExports = {
  modal: MainModal,
}

const remoteGlobalComponentMap: Record<string, RemoteGlobalComponentsExports> = {}
const globalComponentVmMap: Record<string, Record<string, GlobalComponentVm>> = {}
const loadingRemoteGlobalComponents = new Map<string, Promise<RemoteGlobalComponentsExports>>()
const loadingGlobalComponentVms = new Map<string, Promise<GlobalComponentVm>>()

let vueApp: App | undefined

/**
 * 绑定 main Vue 应用上下文，供命令式弹窗实例复用 router / pinia / Element Plus。
 */
export function setupGlobalComponents(app: App): void {
  vueApp = app
}

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
    throw new Error(`[main] 子应用 ${appName} 的 plugins 未导出 ${componentName}`)
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
    return Promise.reject(new Error(`[main] 本地 plugins 未注册 ${componentName}`))
  }

  return invokeGlobalComponentMethod('main', componentName, exported, methodName, ...args)
}

async function ensureRemoteGlobalComponents(appName: string): Promise<RemoteGlobalComponentsExports> {
  const cachedComponents = remoteGlobalComponentMap[appName]
  if (cachedComponents) return cachedComponents

  const existingLoader = loadingRemoteGlobalComponents.get(appName)
  if (existingLoader) return existingLoader

  // 动态 import，避免 runtime → global-components → sub-app-loader → router → HomeView → runtime 的静态循环
  const loader = import('./sub-app-loader')
    .then(({ loadRemotePlugins }) => loadRemotePlugins(appName))
    .then((components) => {
      remoteGlobalComponentMap[appName] = components
      console.log(`[main] 子应用 ${appName} plugins 已加载:`, components)
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

  return Promise.resolve((method as GlobalComponentMethod)(...args))
}

async function getGlobalComponentVm(
  appName: string,
  componentName: string,
  exported: RemoteGlobalComponentExport,
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
  exported: RemoteGlobalComponentExport,
): Promise<GlobalComponentVm> {
  const component = await resolveGlobalComponent(appName, componentName, exported)
  const container = document.createElement('div')
  const vnode = createVNode(component)

  // 让弹窗实例复用 main 的 router、pinia、Element Plus。
  if (vueApp) vnode.appContext = vueApp._context

  document.body.appendChild(container)
  render(vnode, container)

  const vm = vnode.component?.exposed || vnode.component?.proxy
  if (!vm) {
    render(null, container)
    container.remove()
    throw new Error(`[main] 全局组件 ${appName}.${componentName} 创建失败`)
  }

  console.log(`[main] 全局组件 ${appName}.${componentName} 单例已创建`)
  return vm as GlobalComponentVm
}

async function resolveGlobalComponent(
  appName: string,
  componentName: string,
  exported: RemoteGlobalComponentExport,
): Promise<Component> {
  if (!exported) {
    throw new Error(`[main] 子应用 ${appName} 的 plugins 未导出 ${componentName}`)
  }

  if (isRemoteGlobalComponentLoader(exported)) {
    const componentModule = await exported()
    return unwrapGlobalComponent(appName, componentName, componentModule)
  }

  return unwrapGlobalComponent(appName, componentName, exported)
}

function unwrapGlobalComponent(
  appName: string,
  componentName: string,
  exported: RemoteGlobalComponentModule | RemoteGlobalComponentExport,
): Component {
  if (isVueComponentLike(exported)) {
    return exported as Component
  }

  if (exported && typeof exported === 'object' && 'default' in exported) {
    const maybeModule = exported as { default?: Component }
    if (maybeModule.default) return maybeModule.default
  }

  throw new Error(`[main] 子应用 ${appName} 的 plugins 导出 ${componentName} 不是可用组件`)
}

function isRemoteGlobalComponentLoader(
  value: RemoteGlobalComponentExport,
): value is RemoteGlobalComponentLoader {
  return typeof value === 'function'
}

function isVueComponentLike(value: unknown): boolean {
  return Boolean(
    value &&
      (typeof value === 'function' ||
        (typeof value === 'object' &&
          ('render' in (value as Record<string, unknown>) ||
            'setup' in (value as Record<string, unknown>) ||
            'template' in (value as Record<string, unknown>) ||
            'components' in (value as Record<string, unknown>)))),
  )
}
