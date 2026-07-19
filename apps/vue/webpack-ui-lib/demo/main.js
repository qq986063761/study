import Vue from 'vue'
import router from './router'
import App from './App'
import Wape from '../src'
Vue.config.productionTip = false

Vue.use(Wape)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')