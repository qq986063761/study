import type { RouteRecordRaw } from 'vue-router'

// 懒加载：避免 loadRemote(routes) 时同步评估 HomeView（依赖 @main/runtime）导致加载失败
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
]

export default routes
