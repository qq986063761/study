import store from '@/store'

// 使用当前 render 内创建的路由实例（qiankun 每次 mount 新建），避免与默认单例不一致
const getRouter = () => window.__CHILD_ROUTER_INSTANCE__ || null

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
  get router() {
    return getRouter()
  },
  /** 保活模式下再次被激活时调用，可在此刷新数据等 */
  onActivated() {},
  /** 保活模式下被切走时调用，可在此暂停轮询、动画等 */
  onDeactivated() {},
  /** 子应用即将卸载时调用，可在此做清理、保存状态等 */
  onBeforeUnmount() {},
  to({ app, name = '', params, query, method = 'push' }) {
    // 如果是跨应用跳转，则调用父应用的 to 方法
    if (app) {
      window.$parentApp.to({ app, name, params, query, method })
      return
    }

    console.log('child2 to', name, params, query)
    const r = getRouter()
    if (!r) return
    const cur = r.currentRoute
    const sameName = cur.name === name
    const sameParams = shallowEqual(cur.params, params ?? {})
    const sameQuery = shallowEqual(cur.query, query ?? {})
    if (sameName && sameParams && sameQuery) return
    
    const nav = { name, params: params ?? {}, query: query ?? {} }
    const fn = method === 'replace' ? r.replace : r.push
    fn.call(r, nav)
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


    return use({ app, name, method, args })
  },
  // 接收其他模块的数据监听事件
  on() {

  }
}

// 在 window.__QIANKUN_PROPS__ 赋值之后由 main.js 调用，再挂载 $parentApp
let parentAppInited = false
export function initWindowParentApp() {
  if (parentAppInited) return
  parentAppInited = true
  const getParentApp = () => window.__QIANKUN_PROPS__?.$app ?? window.parent?.$app
  Object.defineProperty(window, '$parentApp', {
    get: getParentApp,
    configurable: true,
    enumerable: true
  })
}

// 异步组件加载中占位（用 render 避免依赖模板编译器）
const Loading = {
  render(h) {
    return h('div', '组件加载中...')
  }
}

export default {
  async install(Vue) {
    // 注册 Child1Button
    Vue.component('Child1Button', () => ({
      component: new Promise(resolve => {
        const next = () => {
          const parentMicroApp = window.$parentApp
          const { child1 } = parentMicroApp?.apps || {}
          const { Button } = child1 || {}
          if (!Button) {
            setTimeout(next, 60)
          } else {
            resolve(Button)
          }
        }
        next()
      }),
      loading: Loading
    }))

    // 注册 Child1Item（用于测试联邦引入局部组件）
    Vue.component('Child1Item', () => ({
      component: new Promise(resolve => {
        const next = () => {
          const parentMicroApp = window.$parentApp
          const { child1 } = parentMicroApp?.apps || {}
          const { Item } = child1 || {}
          if (!Item) {
            setTimeout(next, 60)
          } else {
            resolve(Item)
          }
        }
        next()
      }),
      loading: Loading
    }))
  }
}