import {
  Router,
  Switch,
  Route
} from 'react-router-dom'
import { createBrowserHistory } from "history"
import routes from './routes.js'

// 获取指定路由对象
function getRoute(nameOrPath, routeArr) {
  if (!routeArr) routeArr = routes
  for (let i = 0; i < routeArr.length; i++) {
    const route = routeArr[i]
    if (route.component.name === nameOrPath) {
      return route
    } else if (route.children) {
      return getRoute(nameOrPath, route.children)
    }
  }
}

// 模拟 vue router
let rootHistory = null
export const router = {
  map: {},
  push(path, params) {
    let history = router.map[path] || rootHistory
    history.push(path, params)
  },
  back() {
    
  }
} 

// 获取匹配的 router
export function getRouter(name) {
  let history = createBrowserHistory()
  let _routes = name ? [] : routes

  // 子 router
  if (name) {
    let route = getRoute(name)
    if (route) {
      _routes = route.children || []
      // 记录 path history map
      route.children.forEach(childRoute => {
        router.map[childRoute.path] = history
      })
    }
  } else { // 根 router
    rootHistory = history
  }

  return <Router history={ history }>
    <Switch>
      {  
        _routes.map(route => <Route 
          key={ route.path }
          exact 
          path={ route.path } 
          component={ route.component }/>
        )
      }
    </Switch>
  </Router>
}