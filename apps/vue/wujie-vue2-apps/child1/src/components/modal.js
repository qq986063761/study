import Vue from 'vue'
import ComponentVue from './Modal.vue'
import router from '@/router'
import store from '@/store'

const Component = Vue.extend(ComponentVue)

export default {
  show(...args) {
    if (!this.vm) {
      this.vm = new Component({
        router,
        store
      })
      
      this.vm.$mount()
      document.body.appendChild(this.vm.$el)
    }

    this.vm.show(...args)
  }
}