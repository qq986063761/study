import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/components' // 修改默认重定向到组件页面
  },
  {
    path: '/components',
    name: 'components',
    component: () => import('@/views/atLink')
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
  },
  {
    path: '/atLink',
    name: 'atLink',
    component: () => import('@/views/atLink')
  }
]

const router = new VueRouter({
  routes
})

export default router
