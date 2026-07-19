import router from '@/router'
import store from '@/store'

const getParentApp = () => window.$wujie?.props?.$app ?? window.parent?.$app
// Object.defineProperty(window, '$parentApp', {
//   get: getParentApp,
//   configurable: true,
//   enumerable: true
// })
window.$parentApp = getParentApp()

function shallowEqual(a, b) {
  const A = a && typeof a === 'object' ? a : {}
  const B = b && typeof b === 'object' ? b : {}
  const keysA = Object.keys(A)
  const keysB = Object.keys(B)
  if (keysA.length !== keysB.length) return false
  return keysA.every(k => A[k] === B[k])
}

// 提供给子应用（主应用在对应无界生命周期会调用以下可选钩子）
window.$app = {
  vm: null,
  store,
  router,
  /** 保活模式下再次被激活时调用，可在此刷新数据等 */
  onActivated() {},
  /** 保活模式下被切走时调用，可在此暂停轮询、动画等 */
  onDeactivated() {},
  /** 子应用即将卸载时调用，可在此做清理、保存状态等 */
  onBeforeUnmount() {},
  to({ app, name = '', params, query }) {
    // 如果是跨应用跳转，则调用父应用的 to 方法
    if (app) {
      window.$parentApp.to({ app, name, params, query })
      return
    }
    
    console.log('child1 to', name, params, query)
    const cur = router.currentRoute
    const sameName = cur.name === name
    const sameParams = shallowEqual(cur.params, params)
    const sameQuery = shallowEqual(cur.query, query)
    if (sameName && sameParams && sameQuery) return
    
    router.push({
      name,
      params: params ?? {},
      query: query ?? {}
    })
    // .catch(err => {
    //   // Vue Router 以 resolved path+query 判断“同一位置”，params 若未写在 path 里不会进 URL，仍会报冗余导航
    //   if (err.name !== 'NavigationDuplicated') throw err
    // })
  },
  use({  }) {

  },
  // 接收其他模块的数据监听事件
  on(type, opts) {
    if (type === 'store-state') {
      // 同步主应用的 store 数据到子应用 store
      const { prop, value } = opts || {}
      if (prop && value !== undefined) {
        // 根据属性名动态更新对应的 store 属性
        switch (prop) {
          case 'usrs':
            store.commit('SET_USRS', value)
            console.log('子应用收到主应用 store-state 更新通知，已同步 usrs 数据', value)
            break
          // 可以在这里添加其他属性的同步逻辑
          // case 'otherProp':
          //   store.commit('SET_OTHER_PROP', value)
          //   console.log('子应用收到主应用 store-state 更新通知，已同步 otherProp 数据', value)
          //   break
          default:
            console.warn(`子应用收到未知的 store-state 属性: ${prop}`)
        }
      }
    }
  }
}

export default {
  async install(Vue) {
    
  }
}