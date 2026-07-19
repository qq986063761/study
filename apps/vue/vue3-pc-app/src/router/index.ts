import { createRouter, createWebHistory } from 'vue-router'
import Data from '../views/data.vue'
import Component from '../views/component.vue'
import BuiltinComponents from '../views/builtin-components.vue'
import StoreDemo from '../views/store-demo.vue'
import RouterDemo from '../views/router-demo.vue'
import RouterDemoIndex from '../views/router-demo-index.vue'
import RouterDemoUser from '../views/router-demo-user.vue'
import RouterDemoSearch from '../views/router-demo-search.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/data'
    },
    {
      path: '/data',
      name: 'Data',
      component: Data
    },
    {
      path: '/component',
      name: 'Component',
      component: Component
    },
    {
      path: '/builtin-components',
      name: 'BuiltinComponents',
      component: BuiltinComponents
    },
    {
      path: '/store-demo',
      name: 'StoreDemo',
      component: StoreDemo
    },
    {
      path: '/router-demo',
      component: RouterDemo,
      meta: { title: 'vue-router 4 API 演示', requireAuth: false },
      children: [
        {
          path: '',
          name: 'RouterDemoIndex',
          component: RouterDemoIndex
        },
        {
          path: 'user/:id',
          name: 'RouterDemoUser',
          component: RouterDemoUser
        },
        {
          path: 'search',
          name: 'RouterDemoSearch',
          component: RouterDemoSearch
        }
      ]
    }
  ],
})

export default router
