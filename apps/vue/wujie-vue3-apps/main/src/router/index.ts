import { createRouter, createWebHistory } from 'vue-router'

import { microApps } from '@/micro-apps'
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
      path: '/app1',
      name: 'app1',
      component: MicroAppView,
      props: {
        app: microApps.app1,
      },
    },
    {
      path: '/app2',
      name: 'app2',
      component: MicroAppView,
      props: {
        app: microApps.app2,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
