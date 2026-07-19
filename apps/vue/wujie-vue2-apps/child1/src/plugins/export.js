import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import ajax from '@/ajax'
import ElementUI from 'element-ui';
import Button from '@/components/Button.vue'
import modal from '@/components/modal.js'

// 样式可以不引入，会继承其他应用的 element-ui 样式
// import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

// 内部能访问自己的 ajax
Vue.prototype.$ajax = ajax

// 构造一个支持应用内 router、store 的构造器
const ImportedButton = Vue.extend({
  extends: Button,
  router,
  store,
})

const init = async () => {
  await store.dispatch('getData')
}

// 初始化应用内的数据
init()

export default {
  Button: ImportedButton,
  modal,
  store,
}