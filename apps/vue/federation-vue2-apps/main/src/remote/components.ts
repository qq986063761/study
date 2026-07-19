import Vue, { CreateElement } from 'vue'
import { getRemoteAppNames } from './config'
import { loadRemoteComponents } from './modules'
import type {
  RemoteComponentExport,
  RemoteComponentLoader,
  RemoteComponentModule,
  RemoteComponentsExports
} from './types'

const registeredRemoteComponentNames = new Set<string>()

/**
 * 把子应用暴露的联邦组件注册为主应用全局异步组件
 *
 * - 先读取每个子应用 './components' 的默认导出映射，自动发现组件名。
 * - 采用 Vue2 异步组件工厂：组件首次渲染时才拉取真实组件 chunk。
 * - main 会同步拉取对应子应用的 './ajax'，便于组件自发请求；不会触发 routes/store 注册。
 * - 全局注册后，主应用自身页面与各子应用页面均可直接使用这些标签。
 */
export async function registerRemoteComponents(): Promise<void> {
  const componentMap: Record<string, RemoteComponentsExports> = {}

  await Promise.all(getRemoteAppNames().map(async (app) => {
    try {
      componentMap[app] = await registerRemoteAppComponents(app)
    } catch (err) {
      console.warn(`[main] 子应用 ${app} 的联邦组件自动注册失败:`, err)
    }
  }))

  console.log('[main] 子应用联邦组件自动注册结果:', componentMap)
}

async function registerRemoteAppComponents(app: string): Promise<RemoteComponentsExports> {
  const components = await loadRemoteComponents(app)
  Object.keys(components).forEach((name) => {
    registerRemoteComponent(app, name, components[name])
  })
  return components
}

function registerRemoteComponent(app: string, name: string, exported: RemoteComponentExport): void {
  if (registeredRemoteComponentNames.has(name)) return
  registeredRemoteComponentNames.add(name)

  // Vue2 高级异步组件：提供 loading/error 占位，提升首次加载体验。
  Vue.component(name, () => ({
    component: resolveRemoteComponent(app, name, exported),
    loading: {
      render: (h: CreateElement) => h('div', { class: 'text-xs text-gray-400 p-2' }, `加载 ${name} 中…`)
    },
    error: {
      render: (h: CreateElement) => h('div', { class: 'text-xs text-red-400 p-2' }, `${name} 加载失败`)
    },
    delay: 0,
    timeout: 15000
  }))
}

async function resolveRemoteComponent(
  app: string,
  name: string,
  exported: RemoteComponentExport
): Promise<RemoteComponentModule> {
  if (!exported) {
    throw new Error(`[main] 子应用 ${app} 的 './components' 未导出 ${name}`)
  }

  if (typeof exported === 'function') {
    const comp = await (exported as RemoteComponentLoader)()
    return unwrapRemoteComponent(app, name, comp)
  }

  return unwrapRemoteComponent(app, name, exported)
}

function unwrapRemoteComponent(app: string, name: string, exported: unknown): RemoteComponentModule {
  if (!exported || typeof exported !== 'object') {
    return exported as RemoteComponentModule
  }

  const maybeModule = exported as { default?: import('vue').Component }
  if (maybeModule.default) {
    return maybeModule.default
  }

  if (isVueComponentLike(exported)) {
    return exported as RemoteComponentModule
  }

  throw new Error(`[main] 子应用 ${app} 的 './components' 导出 ${name} 不是可用组件`)
}

function isVueComponentLike(value: unknown): boolean {
  return Boolean(
    value
    && typeof value === 'object'
    && ('render' in (value as Record<string, unknown>)
      || 'template' in (value as Record<string, unknown>)
      || 'functional' in (value as Record<string, unknown>)
      || 'components' in (value as Record<string, unknown>))
  )
}
