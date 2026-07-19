import Vue from 'vue'
import ComponentVue from './Modal.vue'
import store from '@/store'

const Component = Vue.extend(ComponentVue)

// 使用当前 mount 的路由实例（qiankun 每次加载子应用新建）
const getRouter = () => window.__CHILD_ROUTER_INSTANCE__ || null

export default {
  show(...args) {
    if (!this.vm) {
      this.vm = new Component({
        router: getRouter(),
        store
      })
      
      this.vm.$mount()
      document.body.appendChild(this.vm.$el)
    }

    this.vm.show(...args)
  }
}