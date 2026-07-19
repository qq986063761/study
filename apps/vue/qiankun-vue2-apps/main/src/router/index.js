import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChildView from '../views/ChildView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  // 子应用挂载页：path 必须与 qiankun activeRule 的 hash 一致；用通配符 /* 统一匹配该子应用下所有路径，无需为每个子路由单独配
  { path: '/child1', name: 'child1', component: ChildView, meta: { app: 'child1' } },
  { path: '/child1/*', name: 'child1-page', component: ChildView, meta: { app: 'child1' } },
  { path: '/child2', name: 'child2', component: ChildView, meta: { app: 'child2' } },
  { path: '/child2/*', name: 'child2-page', component: ChildView, meta: { app: 'child2' } },
]

const router = new VueRouter({
  mode: 'hash', // 必须用 hash，与 qiankun activeRule(location.hash) 一致，否则 push 改的是 pathname 子应用不会激活
  routes
})

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

export default router
