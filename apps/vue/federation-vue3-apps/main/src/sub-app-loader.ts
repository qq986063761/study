import router, { registerSubAppRoutes } from '@/router'
import { getSubAppAjax, registerSubAppAjax } from '@/ajax'
import { registerSubAppStores } from '@/stores'
import type {
  AjaxConfig,
  RemoteComponentsExports,
  RemoteGlobalComponentsExports,
  RemoteI18nMessages,
  StoreModuleConfig,
  SubAppConfig,
  SubAppExports,
  SubAppAjaxFactory,
} from '@/types/remotes'

interface RemoteModule {
  name: string
  loaders: {
    routes: () => Promise<unknown>
    store: () => Promise<unknown>
    ajax: () => Promise<unknown>
    i18n: () => Promise<unknown>
    components: () => Promise<unknown>
    plugins: () => Promise<unknown>
  }
}

type RemoteExportKey = 'routes' | 'store' | 'ajax' | 'i18n' | 'components' | 'plugins'

const REMOTE_MODULES: RemoteModule[] = [
  {
    name: 'app1',
    loaders: {
      routes: () => import('app1/routes'),
      store: () => import('app1/store'),
      ajax: () => import('app1/ajax'),
      i18n: () => import('app1/i18n'),
      components: () => import('app1/components'),
      plugins: () => import('app1/plugins'),
    },
  },
  {
    name: 'app2',
    loaders: {
      routes: () => import('app2/routes'),
      store: () => import('app2/store'),
      ajax: () => import('app2/ajax'),
      i18n: () => import('app2/i18n'),
      components: () => import('app2/components'),
      plugins: () => import('app2/plugins'),
    },
  },
]

const remoteModuleMap = REMOTE_MODULES.reduce<Record<string, RemoteModule>>((map, remote) => {
  map[remote.name] = remote
  return map
}, {})

const loadedSubApps = new Set<string>()
const loadingSubApps = new Map<string, Promise<void>>()
const loadingSubAppAjax = new Map<string, Promise<void>>()
const loadedSubAppStores = new Set<string>()
const loadingSubAppStores = new Map<string, Promise<void>>()

let lazyLoadGuardInstalled = false

function normalizeRemoteExport<T>(mod: unknown, key: RemoteExportKey): T {
  if (mod && typeof mod === 'object') {
    const moduleLike = mod as Record<string, unknown>

    if ('default' in moduleLike) {
      return normalizeRemoteExport<T>(moduleLike.default, key)
    }

    if (key in moduleLike) {
      return normalizeRemoteExport<T>(moduleLike[key], key)
    }
  }

  return mod as T
}

function normalizeStoreExports(mod: unknown): SubAppExports['store'] {
  if (!mod || typeof mod !== 'object') return {}

  return Object.entries(mod as Record<string, unknown>).reduce<SubAppExports['store']>(
    (stores, [key, value]) => {
      if (key !== 'default' && typeof value === 'function') {
        stores[key] = value as SubAppExports['store'][string]
      }
      return stores
    },
    {},
  )
}

async function loadRemoteModule(remote: RemoteModule): Promise<SubAppExports> {
  const [routesModule, storeModule, ajaxModule] = await Promise.all([
    remote.loaders.routes(),
    remote.loaders.store(),
    remote.loaders.ajax(),
  ])

  return {
    routes: normalizeRemoteExport<SubAppExports['routes']>(routesModule, 'routes'),
    store: normalizeStoreExports(storeModule),
    ajax: normalizeRemoteExport<SubAppExports['ajax']>(ajaxModule, 'ajax'),
  }
}

export function getRemoteAppNames(): string[] {
  return REMOTE_MODULES.map((remote) => remote.name)
}

export function getSubAppNameFromPath(path: string): string | undefined {
  const name = path.replace(/^\/+/, '').split('/')[0]
  return name && remoteModuleMap[name] ? name : undefined
}

export function isSubAppLoaded(name: string): boolean {
  return loadedSubApps.has(name)
}

export function isSubAppStoreLoaded(name: string): boolean {
  return loadedSubAppStores.has(name)
}

export async function loadSubAppStore(name: string): Promise<void> {
  if (loadedSubAppStores.has(name)) return

  const existingLoading = loadingSubAppStores.get(name)
  if (existingLoading) return existingLoading

  const remote = remoteModuleMap[name]
  if (!remote) {
    throw new Error(`[main] missing sub app config: ${name}`)
  }

  const storeLoading = remote.loaders
    .store()
    .then((storeModule) => {
      const stores = normalizeStoreExports(storeModule)
      if (Object.keys(stores).length) {
        registerSubAppStores([{ namespace: name, stores }])
      }

      loadedSubAppStores.add(name)
    })
    .catch((err) => {
      console.warn(`[main] sub app store load failed: ${name}`, err)
      throw err
    })
    .finally(() => {
      loadingSubAppStores.delete(name)
    })

  loadingSubAppStores.set(name, storeLoading)
  return storeLoading
}

export async function loadSubAppAjax(name: string): Promise<void> {
  if (getSubAppAjax(name)) return

  const existingLoading = loadingSubAppAjax.get(name)
  if (existingLoading) return existingLoading

  const remote = remoteModuleMap[name]
  if (!remote) {
    throw new Error(`[main] missing sub app config: ${name}`)
  }

  const ajaxLoading = remote.loaders
    .ajax()
    .then((ajaxModule) => {
      const ajax = normalizeRemoteExport<SubAppAjaxFactory>(ajaxModule, 'ajax')
      registerSubAppAjax([{ name, ajax }])
    })
    .finally(() => {
      loadingSubAppAjax.delete(name)
    })

  loadingSubAppAjax.set(name, ajaxLoading)
  return ajaxLoading
}

export async function loadRemoteI18n(name: string): Promise<RemoteI18nMessages> {
  const remote = remoteModuleMap[name]
  if (!remote) {
    throw new Error(`[main] missing sub app config: ${name}`)
  }

  const i18nModule = await remote.loaders.i18n()
  return normalizeRemoteExport<RemoteI18nMessages>(i18nModule, 'i18n')
}

export async function loadRemoteComponents(name: string): Promise<RemoteComponentsExports> {
  const remote = remoteModuleMap[name]
  if (!remote) {
    throw new Error(`[main] missing sub app config: ${name}`)
  }

  const [components] = await Promise.all([
    remote.loaders
      .components()
      .then((module) => normalizeRemoteExport<RemoteComponentsExports>(module, 'components')),
    loadSubAppAjax(name),
  ])

  return components
}

export async function loadRemotePlugins(
  name: string,
): Promise<RemoteGlobalComponentsExports> {
  const remote = remoteModuleMap[name]
  if (!remote) {
    throw new Error(`[main] missing sub app config: ${name}`)
  }

  const [plugins] = await Promise.all([
    remote.loaders
      .plugins()
      .then((module) =>
        normalizeRemoteExport<RemoteGlobalComponentsExports>(module, 'plugins'),
      ),
    loadSubAppAjax(name),
  ])

  return plugins
}

export async function loadSubApp(name: string): Promise<void> {
  if (loadedSubApps.has(name)) return

  const existingLoading = loadingSubApps.get(name)
  if (existingLoading) return existingLoading

  const remote = remoteModuleMap[name]
  if (!remote) {
    throw new Error(`[main] missing sub app config: ${name}`)
  }

  const subAppLoading = loadRemoteModule(remote)
    .then((mod) => {
      const subAppConfigs: SubAppConfig[] = []
      const storeModules: StoreModuleConfig[] = []
      const ajaxConfigs: AjaxConfig[] = []

      if (mod.routes) subAppConfigs.push({ prefix: `/${name}`, routes: mod.routes })
      if (Object.keys(mod.store).length) storeModules.push({ namespace: name, stores: mod.store })
      if (mod.ajax && !getSubAppAjax(name)) ajaxConfigs.push({ name, ajax: mod.ajax })

      registerSubAppRoutes(subAppConfigs)
      registerSubAppStores(storeModules)
      registerSubAppAjax(ajaxConfigs)
      if (storeModules.length) loadedSubAppStores.add(name)

      loadedSubApps.add(name)
      console.log(`[main] 子应用已加载: ${name}`)
    })
    .catch((err) => {
      console.warn(`[main] sub app load failed: ${name}`, err)
      throw err
    })
    .finally(() => {
      loadingSubApps.delete(name)
    })

  loadingSubApps.set(name, subAppLoading)
  return subAppLoading
}

export function setupSubAppLazyLoadGuard(): void {
  if (lazyLoadGuardInstalled) return
  lazyLoadGuardInstalled = true

  router.beforeEach(async (to) => {
    const name = getSubAppNameFromPath(to.path)

    if (!name || isSubAppLoaded(name)) {
      return true
    }

    try {
      await loadSubApp(name)
      return {
        path: to.path,
        query: to.query,
        hash: to.hash,
        replace: true,
      }
    } catch {
      return false
    }
  })
}
