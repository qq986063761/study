import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

function resolveHistoryBase(appName: string) {
  if (!import.meta.env.PROD) {
    return import.meta.env.BASE_URL
  }

  const segments = window.location.pathname.split('/').filter(Boolean)
  const appIndex = segments.indexOf(appName)

  if (appIndex >= 0) {
    return `/${segments.slice(0, appIndex + 1).join('/')}/`
  }

  return new URL(import.meta.env.BASE_URL, window.location.href).pathname
}

const router = createRouter({
  history: createWebHistory(resolveHistoryBase('web')),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
