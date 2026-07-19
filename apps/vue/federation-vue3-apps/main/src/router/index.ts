import { h } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import type { SubAppConfig } from '@/types/remotes'

const SubAppLoadingView = {
  name: 'SubAppLoadingView',
  setup() {
    return () => h('div')
  },
}

const mainRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'main-home',
    // 懒加载，避免 router → HomeView → @main/runtime → sub-app-loader → router 的循环依赖 TDZ
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/app1/:pathMatch(.*)*',
    component: SubAppLoadingView,
  },
  {
    path: '/app2/:pathMatch(.*)*',
    component: SubAppLoadingView,
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: mainRoutes,
})

const registeredSubAppRoutePrefixes = new Set<string>()

function prefixRoutes(routes: RouteRecordRaw[], prefix: string): RouteRecordRaw[] {
  return routes.map((route) => {
    const prefixedRoute = {
      ...route,
      path: prefix + (route.path === '/' ? '' : route.path),
      name: route.name ? `${prefix.replace('/', '')}-${String(route.name)}` : undefined,
    } as RouteRecordRaw

    if (route.children) {
      prefixedRoute.children = prefixRoutes(route.children, prefix)
    }

    return prefixedRoute
  })
}

export function registerSubAppRoutes(configs: SubAppConfig[]): void {
  configs.forEach(({ prefix, routes }) => {
    if (registeredSubAppRoutePrefixes.has(prefix)) {
      console.log(`[main] sub app routes already registered: ${prefix}`)
      return
    }

    const prefixedRoutes = prefixRoutes(routes, prefix)
    prefixedRoutes.forEach((route) => {
      router.addRoute(route)
    })
    registeredSubAppRoutePrefixes.add(prefix)
    console.log(`[main] 子应用路由已注册: ${prefix}`, {
      subAppRoutes: routes,
      registeredSubAppRoutes: prefixedRoutes,
      mainRoutes: router.getRoutes(),
    })
  })
}

export default router
