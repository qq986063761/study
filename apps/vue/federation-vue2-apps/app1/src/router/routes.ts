import { RouteConfig } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "app1-about" */ '../views/AboutView.vue')
  }
]

export default routes
