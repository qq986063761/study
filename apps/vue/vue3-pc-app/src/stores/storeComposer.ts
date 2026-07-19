import { useBaseStore } from './base'
import { useChild1Store } from './child1'
import { useChild2Store } from './child2'

/**
 * Store 组合器 - 解决循环引用问题
 * 通过延迟获取 store 实例来避免循环引用
 */
export function useStoreComposer() {
  // 延迟获取 store 实例，避免循环引用
  const getBaseStore = () => useBaseStore()
  const getChild1Store = () => useChild1Store()
  const getChild2Store = () => useChild2Store()

  // 组合数据的方法
  function getCombinedData() {
    const baseStore = getBaseStore()
    const child1Store = getChild1Store()
    const child2Store = getChild2Store()

    return {
      base: baseStore.baseInfo,
      child1: child1Store.child1Info,
      child2: child2Store.child2Info,
      combined: {
        totalCount: baseStore.baseCount + child1Store.child1Count + child2Store.child2Count,
        allData: [
          baseStore.baseData,
          child1Store.child1Data,
          child2Store.child2Data
        ]
      }
    }
  }

  // 跨 store 操作的方法
  function syncAllStores() {
    const baseStore = getBaseStore()
    const child1Store = getChild1Store()
    const child2Store = getChild2Store()

    // 同步所有计数器的值
    const maxCount = Math.max(baseStore.baseCount, child1Store.child1Count, child2Store.child2Count)
    baseStore.baseCount = maxCount
    child1Store.child1Count = maxCount
    child2Store.child2Count = maxCount
  }

  function resetAllStores() {
    const baseStore = getBaseStore()
    const child1Store = getChild1Store()
    const child2Store = getChild2Store()

    baseStore.resetBase()
    child1Store.resetChild1()
    child2Store.resetChild2()
  }

  return {
    getBaseStore,
    getChild1Store,
    getChild2Store,
    getCombinedData,
    syncAllStores,
    resetAllStores
  }
}
