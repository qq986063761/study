import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/global.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import plugin from './plugins'

Vue.config.productionTip = false

// 过滤报错
Vue.config.warnHandler = function (msg, vm, trace) {
  if (msg.includes('"style" is a reserved attribute')) {
    return
  }
  console.warn(msg, trace)
}

// 全局配置子应用的远程暴露地址（主应用 Module Federation 用）
window.__REMOTES__ = {
  child1: 'http://localhost:8081/remoteEntry.js'
}

Vue.use(ElementUI)
Vue.use(plugin)

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

window.$app.vm = vm

// 微应用改为在 MicroApp 组件首次挂载时再注册并启动（见 MicroApp.vue），保证对应 container 已存在
