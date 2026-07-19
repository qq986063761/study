import router, { registerSubAppRoutes } from '../router'
import { registerSubAppStores } from '../store'
import { getRemoteModule } from './config'
import { loadRemoteRoutes, loadRemoteStore, loadSubAppAjax } from './modules'
import type { StoreModuleConfig, SubAppConfig } from './types'

const loadedSubApps = new Set<string>()
const loadingSubApps = new Map<string, Promise<void>>()

let lazyLoadGuardInstalled = false

export function getSubAppNameFromPath(path: string): string | undefined {
  const name = path.replace(/^\/+/, '').split('/')[0]
  return getRemoteModule(name) ? name : undefined
}

export function isSubAppLoaded(name: string): boolean {
  return loadedSubApps.has(name)
}

/**
 * 完整加载子应用：routes + store + ajax，并完成路由 / store 注册。
 */
export async function loadSubApp(name: string): Promise<void> {
  if (loadedSubApps.has(name)) return

  const existingLoading = loadingSubApps.get(name)
  if (existingLoading) return existingLoading

  if (!getRemoteModule(name)) {
    throw new Error(`[main] 未找到子应用配置: ${name}`)
  }

  const subAppLoading = Promise.all([loadRemoteRoutes(name), loadRemoteStore(name), loadSubAppAjax(name)])
    .then(([routes, store]) => {
      const subAppConfigs: SubAppConfig[] = []
      const storeModules: StoreModuleConfig[] = []

      subAppConfigs.push({ prefix: `/${name}`, routes })
      storeModules.push({ namespace: name, module: store })

      registerSubAppRoutes(subAppConfigs)
      registerSubAppStores(storeModules)

      loadedSubApps.add(name)
      console.log(`[main] 子应用 ${name} 懒加载成功`)
    })
    .catch((err) => {
      console.warn(`[main] 子应用 ${name} 加载失败，请确认 ${name} 的 remoteEntry.js 可访问:`, err)
      throw err
    })
    .finally(() => {
      loadingSubApps.delete(name)
    })

  loadingSubApps.set(name, subAppLoading)
  return subAppLoading
}

/**
 * 路由进入子应用路径时自动懒加载对应联邦模块。
 */
export function setupSubAppLazyLoadGuard(): void {
  if (lazyLoadGuardInstalled) return
  lazyLoadGuardInstalled = true

  router.beforeEach(async (to, _from, next) => {
    const name = getSubAppNameFromPath(to.path)

    if (!name || isSubAppLoaded(name)) {
      next()
      return
    }

    try {
      await loadSubApp(name)
      next({
        path: to.path,
        query: to.query,
        hash: to.hash,
        replace: true
      })
    } catch (err) {
      next(false)
    }
  })
}
