import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './assets/tailwind.css'
import router from './router'
import store from './store'
// 子项目如果不用独立启动，就用不到了
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

// Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
