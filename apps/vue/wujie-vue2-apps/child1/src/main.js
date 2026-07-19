import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
// 样式可以不引入，会继承其他应用的 element-ui 样式
import 'element-ui/lib/theme-chalk/index.css'
import plugin from './plugins'

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
  console.log('child1 main.js', window.$app)
  return instance
}

// 无界生命周期改造：主应用才能收到 afterMount 等钩子
if (window.__POWERED_BY_WUJIE__) {
  let instance
  window.__WUJIE_MOUNT = () => {
    console.log('child1 main.js __WUJIE_MOUNT')
    instance = createApp()
  }
  window.__WUJIE_UNMOUNT = () => {
    console.log('child1 main.js __WUJIE_UNMOUNT')
    instance.$destroy()
  }
} else {
  createApp()
}
