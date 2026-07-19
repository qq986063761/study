import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

// 独立运行时：path 为 /home、/about；乾坤下 hash 为 #/child1/xxx，匹配用的是完整路径 /child1/xxx，故 path 需带 base
function getRoutes() {
  const isQiankun = window.__POWERED_BY_QIANKUN__
  const prefix = isQiankun ? '/child1' : ''
  return [
    ...(isQiankun
      ? [{ path: '/child1', redirect: '/child1/home' }]
      : []),
    {
      path: prefix + '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: prefix + '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    }
  ]
}

function createRouter() {
  const base = window.__POWERED_BY_QIANKUN__ ? '/child1' : '/'
  const r = new VueRouter({
    mode: 'hash',
    base,
    routes: getRoutes()
  })
  r.beforeEach((to, from, next) => {
    console.log('child1 router beforeEach', to, from)
    next()
  })
  return r
}

// 不在此处创建单例，由 main.js 在 render 内每次 mount 时 createRouter(base)，保证 qiankun 每次加载子应用都用新路由实例

// 全局处理路由重复导航错误
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      console.error('Router push error:', err)
      throw err
    }
  })
}

VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') {
      console.error('Router replace error:', err)
      throw err
    }
  })
}

export { createRouter, getRoutes }
