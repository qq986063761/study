import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'overview',
      component: () => import('../views/Overview.vue'),
      meta: { title: '概览', icon: '🏠' },
    },
    {
      path: '/button',
      name: 'button',
      component: () => import('../views/ButtonDemo.vue'),
      meta: { title: 'Button 按钮', icon: '🔘' },
    },
    {
      path: '/input',
      name: 'input',
      component: () => import('../views/InputDemo.vue'),
      meta: { title: 'Input 输入框', icon: '✏' },
    },
    {
      path: '/dialog',
      name: 'dialog',
      component: () => import('../views/DialogDemo.vue'),
      meta: { title: 'Dialog 对话框', icon: '💬' },
    },
  ],
})

export default router
