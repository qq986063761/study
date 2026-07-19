import type { Pinia, StoreGeneric } from 'pinia'
import { useCounterStore } from './counter'
import type { StoreModuleConfig, SubAppStoreDefinitions } from '@/types/remotes'

const registeredSubAppStores = new Set<string>()
const subAppStoreDefinitions = new Map<string, SubAppStoreDefinitions>()

let activePinia: Pinia | undefined
let loadSubAppStore: ((name: string) => Promise<void>) | undefined

export function setupStoreRegistry(pinia: Pinia): void {
  activePinia = pinia
}

/**
 * 注入子应用 store 懒加载器，由 runtime 首次调用对应子应用 store 时触发。
 */
export function setSubAppStoreLoader(loader: (name: string) => Promise<void>): void {
  loadSubAppStore = loader
}

function getActivePinia(): Pinia {
  if (!activePinia) {
    throw new Error('[main] missing active pinia')
  }

  return activePinia
}

function getSubAppStoreDefinitions(): Record<string, SubAppStoreDefinitions> {
  const storeDefinitions: Record<string, SubAppStoreDefinitions> = {}
  subAppStoreDefinitions.forEach((stores, namespace) => {
    storeDefinitions[namespace] = { ...stores }
  })
  return storeDefinitions
}

/**
 * 获取主应用自身的 counter store。
 */
export function getMainStore(): StoreGeneric {
  return useCounterStore(getActivePinia()) as StoreGeneric
}

/**
 * 按子应用名 + store 定义名获取远程 Pinia store，未注册时懒加载。
 */
export async function invokeSubAppStore(appName: string, storeName: string): Promise<StoreGeneric> {
  if (!storeName) {
    throw new Error(`[main] 调用 ${appName} store 时缺少 store 名`)
  }

  if (!subAppStoreDefinitions.has(appName)) {
    if (!loadSubAppStore) {
      throw new Error(`[main] missing sub app store loader: ${appName}`)
    }

    await loadSubAppStore(appName)
  }

  const stores = subAppStoreDefinitions.get(appName)
  const useStore = stores?.[storeName]

  if (typeof useStore !== 'function') {
    throw new Error(`[main] missing store "${storeName}" for ${appName}`)
  }

  return useStore(getActivePinia()) as StoreGeneric
}

export function registerSubAppStores(configs: StoreModuleConfig[]): void {
  configs.forEach(({ namespace, stores }) => {
    if (registeredSubAppStores.has(namespace)) {
      console.log(`[main] sub app store already registered: ${namespace}`)
      return
    }

    subAppStoreDefinitions.set(namespace, stores)
    if (activePinia) {
      const pinia = activePinia
      Object.values(stores).forEach((useStore) => {
        useStore(pinia)
      })
    }
    registeredSubAppStores.add(namespace)
    console.log(`[main] 子应用 store 已注册: ${namespace}`, {
      currentSubAppStoreConfig: {
        namespace,
        stores: { ...stores },
      },
      mainStoreConfig: getSubAppStoreDefinitions(),
    })
  })
}

export function getSubAppStore(name: string): SubAppStoreDefinitions | undefined {
  return subAppStoreDefinitions.get(name)
}
