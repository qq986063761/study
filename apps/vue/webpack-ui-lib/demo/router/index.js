import Vue from 'vue'
import VueRouter from 'vue-router'
import textEllipsis from '../views/textEllipsis'
import sticky from '../views/sticky'
import drag from '../views/drag'

Vue.use(VueRouter)

const routes = [
  { 
    path: '/',
    redirect: '/textEllipsis'
  },
  {
    path: '/textEllipsis',
    name: 'textEllipsis',
    component: textEllipsis
  },
  {
    path: '/sticky',
    name: 'sticky',
    component: sticky
  },
  {
    path: '/drag',
    name: 'drag',
    component: drag
  }
]

const router = new VueRouter({
  routes
})

export default router
