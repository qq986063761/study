import Home from '../pages/Home'
import HomeChild1 from '../pages/HomeChild1'
import HomeChild2 from '../pages/HomeChild2'
import About from '../pages/About'
import Error from '../pages/Error'

const routes = [
  {
    path: '/about',
    component: About
  },
  // path 少的必须放后，因为路由是向下兼容的
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/home/child1',
        component: HomeChild1
      },
      {
        path: '/home/child2',
        component: HomeChild2
      }
    ]
  },
  // 没匹配到的页面
  {
    path: '*',
    component: Error
  }
]

export default routes