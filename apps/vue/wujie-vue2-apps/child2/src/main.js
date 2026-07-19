import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugin from './plugins'  // 引入插件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(plugin)

function createApp() {
  const instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
  window.$app.vm = instance
  console.log('child2 main.js', window.$app)
  return instance
}

// 无界生命周期改造：主应用才能收到 afterMount 等钩子
if (window.__POWERED_BY_WUJIE__) {
  let instance
  window.__WUJIE_MOUNT = () => {
    console.log('child2 main.js __WUJIE_MOUNT')
    instance = createApp()
  }
  window.__WUJIE_UNMOUNT = () => {
    console.log('child2 main.js __WUJIE_UNMOUNT')
    instance.$destroy()
  }
} else {
  createApp()
}
