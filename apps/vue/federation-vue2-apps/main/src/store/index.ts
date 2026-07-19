import Vue from 'vue'
import Vuex from 'vuex'
import type { StoreModuleConfig } from '../remote/types'

Vue.use(Vuex)

// ============ 主应用自身 Store ============
const store = new Vuex.Store({
  state: {
    appName: 'main'
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {}
})

// ============ 子应用 Store 模块动态注册 ============

/**
 * 动态注册子应用的 Vuex Store 模块（命名空间隔离）
 *
 * 每个子应用模块以 namespaced: true 方式注册，
 * 主应用中通过 this.$store.state.app1.xxx / this.$store.state.app2.xxx 访问，
 * 通过 this.$store.dispatch('app1/someAction') / this.$store.dispatch('app2/someAction') 分发
 *
 * @param configs - 子应用 store 模块配置 [{ namespace: 'app1', module: {...} }, ...]
 */
export function registerSubAppStores(configs: StoreModuleConfig[]): void {
  configs.forEach(({ namespace, module }) => {
    if ((store as any).hasModule(namespace)) {
      console.log(`[main] 子应用 Store 模块已存在，跳过重复注册: ${namespace}`)
      return
    }

    const namespacedModule = {
      ...module,
      namespaced: true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.registerModule(namespace, namespacedModule as any)
    console.log(`[main] 子应用 Store 模块已注册: ${namespace}`)
  })

  console.log('[main] 当前所有 Store 模块:', store)
}

export default store
