import './public-path'
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { createRouter } from './router'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import plugin, { initWindowParentApp } from './plugins'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(plugin)

let routerInstance = null
let instance = null

/** 配合主应用 keep-alive：unmount 时不销毁实例，仅移出 DOM；mount 时优先复用 */
const instanceCache = { instance: null, routerInstance: null }

function render(props = {}) {
  const { container } = props
  routerInstance = createRouter()
  window.__CHILD_ROUTER_INSTANCE__ = routerInstance
  instance = new Vue({
    router: routerInstance,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')

  if (props.init) {
    props.init({ window, vm: instance })
  }
}

/** 将已存在的实例挂回容器，不重新创建 Vue（用于配合主应用 keep-alive 缓存状态） */
function restoreFromCache(props) {
  const { container } = props
  const cached = instanceCache.instance
  if (!cached || !cached.$el) return false
  const wrap = container || document.getElementById('subapp-child1')
  if (!wrap) return false
  const appEl = wrap.querySelector('#app')
  if (appEl && appEl.parentNode) {
    appEl.parentNode.replaceChild(cached.$el, appEl)
  } else {
    wrap.appendChild(cached.$el)
  }
  instance = cached
  routerInstance = instanceCache.routerInstance
  window.__CHILD_ROUTER_INSTANCE__ = routerInstance
  if (props.init) {
    props.init({ window, vm: instance })
  }
  return true
}

if (!window.__POWERED_BY_QIANKUN__) {
  initWindowParentApp()
  render()
}

export async function bootstrap() {
  console.log('child1 bootstrap')
}

export async function mount(props) {
  console.log('child1 mount', props)
  window.__QIANKUN_PROPS__ = props
  initWindowParentApp()
  if (restoreFromCache(props)) {
    return
  }
  render(props)
}

export async function unmount() {
  console.log('child1 unmount')
  if (instance) {
    instanceCache.instance = instance
    instanceCache.routerInstance = routerInstance
    const el = instance.$el
    if (el && el.parentNode) {
      el.parentNode.removeChild(el)
    }
    instance = null
    routerInstance = null
  }
  window.__CHILD_ROUTER_INSTANCE__ = null
}
