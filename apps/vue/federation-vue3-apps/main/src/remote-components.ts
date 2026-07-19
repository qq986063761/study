import { defineAsyncComponent, h, type App, type Component } from 'vue'
import { getRemoteAppNames, loadRemoteComponents } from './sub-app-loader'
import type {
  RemoteComponentExport,
  RemoteComponentLoader,
  RemoteComponentModule,
  RemoteComponentsExports,
} from './types/remotes'

const registeredRemoteComponentNames = new Set<string>()

export async function registerRemoteComponents(app: App): Promise<void> {
  const componentMap: Record<string, RemoteComponentsExports> = {}

  await Promise.all(
    getRemoteAppNames().map(async (appName) => {
      try {
        componentMap[appName] = await registerRemoteAppComponents(app, appName)
      } catch (err) {
        console.warn(`[main] 子应用 ${appName} 的联邦组件自动注册失败:`, err)
      }
    }),
  )

  console.log('[main] 子应用联邦组件自动注册结果:', componentMap)
}

async function registerRemoteAppComponents(
  vueApp: App,
  appName: string,
): Promise<RemoteComponentsExports> {
  const components = await loadRemoteComponents(appName)

  Object.keys(components).forEach((name) => {
    const exported = components[name]
    if (exported) {
      registerRemoteComponent(vueApp, appName, name, exported)
    }
  })

  return components
}

function registerRemoteComponent(
  vueApp: App,
  appName: string,
  name: string,
  exported: RemoteComponentExport,
): void {
  if (registeredRemoteComponentNames.has(name)) return
  registeredRemoteComponentNames.add(name)

  vueApp.component(
    name,
    defineAsyncComponent({
      loader: () => resolveRemoteComponent(appName, name, exported),
      loadingComponent: {
        render: () =>
          h('div', { class: 'remote-component-loading' }, `加载 ${name} 中...`),
      },
      errorComponent: {
        render: () => h('div', { class: 'remote-component-error' }, `${name} 加载失败`),
      },
      delay: 0,
      timeout: 15000,
    }),
  )
}

async function resolveRemoteComponent(
  appName: string,
  name: string,
  exported: RemoteComponentExport,
): Promise<Component> {
  if (!exported) {
    throw new Error(`[main] 子应用 ${appName} 的 './components' 未导出 ${name}`)
  }

  if (typeof exported === 'function') {
    const componentModule = await (exported as RemoteComponentLoader)()
    return unwrapRemoteComponent(appName, name, componentModule)
  }

  return unwrapRemoteComponent(appName, name, exported)
}

function unwrapRemoteComponent(
  appName: string,
  name: string,
  exported: RemoteComponentModule | RemoteComponentExport,
): Component {
  if (isVueComponentLike(exported)) {
    return exported as Component
  }

  if (exported && typeof exported === 'object' && 'default' in exported) {
    const maybeModule = exported as { default?: Component }
    if (maybeModule.default) return maybeModule.default
  }

  throw new Error(`[main] 子应用 ${appName} 的 './components' 导出 ${name} 不是可用组件`)
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
