import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export function createAppRouter(base = import.meta.env.BASE_URL) {
  return createRouter({
    history: createWebHistory(base),
    routes: [
      {
        path: '/',
        name: 'home',
        component: HomeView,
      },
    ],
  })
}

export default createAppRouter()
