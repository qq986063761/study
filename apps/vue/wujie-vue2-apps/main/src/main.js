import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import WujieVue from 'wujie-vue2'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import plugin from './plugins'

Vue.config.productionTip = false

// 过滤报错
Vue.config.warnHandler = function (msg, vm, trace) {
  // 忽略 style 保留属性的警告
  if (msg.includes('"style" is a reserved attribute')) {
    return
  }
  console.warn(msg, trace)
}

// 全局配置子应用的远程暴露地址
window.__REMOTES__ = {
  "child1": "http://localhost:8081/remoteEntry.js"
}

Vue.use(WujieVue)
Vue.use(ElementUI);
Vue.use(plugin)

window.$app.vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
