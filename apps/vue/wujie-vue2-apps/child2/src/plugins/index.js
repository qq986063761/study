import router from '@/router'
import store from '@/store'

function shallowEqual(a, b) {
  const A = a && typeof a === 'object' ? a : {}
  const B = b && typeof b === 'object' ? b : {}
  const keysA = Object.keys(A)
  const keysB = Object.keys(B)
  if (keysA.length !== keysB.length) return false
  return keysA.every(k => A[k] === B[k])
}

// 提供给父应用（主应用在对应无界生命周期会调用以下可选钩子）
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

    console.log('child2 to', name, params, query)
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
    //   // NavigationDuplicated: Avoided redundant navigation to current location: "/home". 避免重复导航报错
    //   if (err.name !== 'NavigationDuplicated') throw err
    // })
  },
  use({ name, method, args }) {
    console.log('child2 use', name, method, args)
    const { use } = window.$parentApp || {}
    let app = ''

    // 不同组件对应不同子应用
    switch (name) {
      case 'modal':
        app = 'child1'
        break
    }

    // window.$wujie?.bus.$off("on-visible", )
    // window.$wujie?.bus.$on("on-visible", )

    return use({ app, name, method, args })
  },
  // 接收其他模块的数据监听事件
  on() {

  }
}

// 主应用 $app 挂到全局，业务中直接用 window.$parentApp（优先无界 props，同域/独立运行回退到 window.parent）
const getParentApp = () => window.$wujie?.props?.$app ?? window.parent?.$app
// Object.defineProperty(window, '$parentApp', {
//   get: getParentApp,
//   configurable: true,
//   enumerable: true
// })
window.$parentApp = getParentApp()

// 异步组件加载中占位（用 render 避免依赖模板编译器）
const Child1ButtonLoading = {
  render(h) {
    return h('div', '组件加载中...')
  }
}

export default {
  async install(Vue) {
    const parentMicroApp = window.$parentApp
    const { child1 } = parentMicroApp?.apps || {}

    Vue.component('Child1Button', () => ({
      component: new Promise(resolve => {
        const next = () => {
          const { Button } = child1
          if (!Button) {
            setTimeout(next, 60)
          } else {
            resolve(Button)
          }
        }
        next()
      }),
      loading: Child1ButtonLoading
    }))
  }
}