import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/gantt' // 添加默认重定向
  },
  {
    path: '/gantt',
    name: 'gantt',
    component: () => import('@/views/gantt')
  },
  {
    path: '/password',
    name: 'password',
    component: () => import('@/views/password')
  },
  {
    path: '/sta',
    name: 'sta',
    component: () => import('@/views/sta')
  },
  {
    path: '/atWeb',
    name: 'atWeb',
    component: () => import('@/views/atWeb')
  }
]

const router = new VueRouter({
  routes
})

export default router
