import './css/base.css'
import Vue from 'vue'
import App from './App.vue'
import MyUI from 'my-ui'
console.log('MyUI', MyUI)

// 测试 eslint 规则
// const a = '1'
// const b = "2"

Vue.use(MyUI)

new Vue({
  el: '#app',
  render: h => h(App)
})