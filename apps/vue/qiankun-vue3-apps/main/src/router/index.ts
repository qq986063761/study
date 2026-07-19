import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MicroAppView from '@/views/MicroAppView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/app1/:pathMatch(.*)*',
      name: 'app1',
      component: MicroAppView,
    },
    {
      path: '/app2/:pathMatch(.*)*',
      name: 'app2',
      component: MicroAppView,
    },
  ],
})

export default router
