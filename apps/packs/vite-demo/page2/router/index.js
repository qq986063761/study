import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from 'p2/Home.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('p2/About.vue')
    }
  ]
})