import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './bones/registry'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import plugin from './plugins'

Vue.config.productionTip = false

// 插件注册
Vue.use(ElementUI)
Vue.use(plugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
