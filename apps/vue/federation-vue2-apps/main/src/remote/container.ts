import { getRemoteModule } from './config'
import type { RemoteContainer, RemoteDefaultExport, RemoteExposedModule, RemoteModule } from './types'

declare const __webpack_init_sharing__: (scope: string) => Promise<void>
declare const __webpack_share_scopes__: Record<string, unknown>

const remoteEntryLoaders = new Map<string, Promise<void>>()
const containerInitializers = new Map<string, Promise<void>>()
const initializedContainers = new Set<string>()

function getRemoteContainer(name: string): RemoteContainer | undefined {
  return (window as unknown as Record<string, RemoteContainer | undefined>)[name]
}

function loadRemoteEntry(remote: RemoteModule): Promise<void> {
  const existingContainer = getRemoteContainer(remote.name)
  if (existingContainer) return Promise.resolve()

  const existingLoader = remoteEntryLoaders.get(remote.name)
  if (existingLoader) return existingLoader

  const loader = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[data-remote="${remote.name}"]`)
    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        resolve()
        return
      }

      if (existingScript.dataset.error === 'true') {
        reject(new Error(`[main] ${remote.name} remoteEntry.js 加载失败: ${remote.entry}`))
        return
      }

      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error(`[main] ${remote.name} remoteEntry.js 加载失败`)), {
        once: true
      })
      return
    }

    const script = document.createElement('script')
    script.src = remote.entry
    script.type = 'text/javascript'
    script.async = true
    script.dataset.remote = remote.name
    script.onload = () => {
      script.dataset.loaded = 'true'
      resolve()
    }
    script.onerror = () => {
      script.dataset.error = 'true'
      reject(new Error(`[main] ${remote.name} remoteEntry.js 加载失败: ${remote.entry}`))
    }
    document.head.appendChild(script)
  }).finally(() => {
    remoteEntryLoaders.delete(remote.name)
  })

  remoteEntryLoaders.set(remote.name, loader)
  return loader
}

async function initRemoteContainer(name: string, container: RemoteContainer): Promise<void> {
  if (initializedContainers.has(name)) return

  const existingInitializer = containerInitializers.get(name)
  if (existingInitializer) return existingInitializer

  const initializer = Promise.resolve(container.init(__webpack_share_scopes__.default))
    .then(() => {
      initializedContainers.add(name)
    })
    .finally(() => {
      containerInitializers.delete(name)
    })

  containerInitializers.set(name, initializer)
  return initializer
}

/**
 * 通用：按 name + 暴露名加载远程模块（init sharing + 初始化容器 + container.get）
 * 用于加载 './routes'、'./store'、'./ajax'、'./i18n'、'./components' 等拆分后的联邦模块
 */
export async function getRemoteExposed<T>(name: string, exposedModule: RemoteExposedModule): Promise<T> {
  const remote = getRemoteModule(name)
  if (!remote) {
    throw new Error(`[main] 未找到子应用配置: ${name}`)
  }

  await loadRemoteEntry(remote)
  await __webpack_init_sharing__('default')

  const container = getRemoteContainer(name)
  if (!container) {
    throw new Error(`[main] 子应用 ${name} 的容器不存在`)
  }

  await initRemoteContainer(name, container)

  const factory = await container.get(exposedModule)
  return factory() as unknown as T
}

export async function loadRemoteDefault<T>(name: string, exposedModule: RemoteExposedModule): Promise<T> {
  const mod = await getRemoteExposed<RemoteDefaultExport<T>>(name, exposedModule)
  return mod.default
}
