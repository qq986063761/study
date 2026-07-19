import router from '@/router'
import store from '@/store'

// 提供给子应用
window.$app = {
  vm: null,
  store,
  router,
  components: {}, // 提供给子应用的内联组件
  // 子应用列表（乾坤模式下通过 props.init({ window, vm }) 传入，主应用通过 slot.window / slot.vm 访问子应用）
  apps: {
    child1: { 
      window: null,
      vm: null
    },
    child2: { 
      window: null, 
      vm: null 
    }
  },
  /**
   * 跳转路由
   * 子应用：先改主应用 path（hash）激活子应用，再通过子应用 window.$app.to 让子应用自己跳路由（支持 params/query）
   * 子应用未挂载时每 60ms 轮询直到可调用子应用 to
   */
  to({ app, name, query, params, method = 'push' }) {
    if (app) {
      const path = `/${app}/${name}`
      router[method]({ path, query })
      const payload = { name, params, query, method }
      const slot = window.$app.apps[app]
      const childTo = slot?.window?.$app?.to
      if (childTo) {
        childTo(payload)
      } else {
        let count = 0
        const maxRetry = 50 // 约 3 秒后放弃
        const timer = setInterval(() => {
          const s = window.$app.apps[app]
          const to = s?.window?.$app?.to
          if (to) {
            clearInterval(timer)
            to(payload)
          } else if (++count >= maxRetry) {
            clearInterval(timer)
          }
        }, 60)
      }
    } else {
      router[method]({ name, params, query })
    }
  },
  // 使用组件（优先从 MF 暴露的 slot[name]，如 child1 的 modal/Button）
  use({ app, name = '', method = '', args = [] }) {
    console.log('main use', app, name, method, args)
    const slot = window.$app.apps[app]
    const target = slot?.[name] || slot?.window?.[name]
    return target && typeof target[method] === 'function' ? target[method](...args) : undefined
  },
  on() {},
  // 向所有子应用发送事件通知（通过 slot.window.$app 访问子应用）
  emit(type, data) {
    Object.keys(window.$app.apps).forEach(appName => {
      const slot = window.$app.apps[appName]
      const $app = slot?.window?.$app
      if ($app && typeof $app.on === 'function') {
        try {
          $app.on(type, data)
        } catch (e) {
          console.warn(`通知子应用 ${appName} 失败:`, e)
        }
      }
    })
  }
}

// 异步组件加载中占位（用 render 避免依赖模板编译器）
const Child1ButtonLoading = {
  render(h) {
    return h('div', '组件加载中...')
  }
}

export default {
  async install(Vue) {
    const { child1 } = window.$app.apps

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

    // 引入 child1 的插件
    const child1Export = await import('child1/export')
    const { Button, Item, modal } = child1Export.default

    // 保存子组件的组件
    child1.Button = Button
    child1.Item = Item
    child1.modal = modal

    console.log('main 中 child1 组件加载完成', child1Export.default)
  }
}