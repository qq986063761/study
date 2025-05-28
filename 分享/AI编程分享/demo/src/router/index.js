import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/ganttDemo' // 添加默认重定向
  },
  {
    path: '/ganttDemo',
    name: 'ganttDemo',
    component: () => import('@/views/ganttDemo')
  },
  {
    path: '/ganttDemo1',
    name: 'ganttDemo1',
    component: () => import('@/views/ganttDemo1')
  },
  {
    path: '/password',
    name: 'password',
    component: () => import('@/views/password')
  },
  {
    path: '/password1',
    name: 'password1',
    component: () => import('../views/password1.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
