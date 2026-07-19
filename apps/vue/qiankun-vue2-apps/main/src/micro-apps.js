import { registerMicroApps, start } from 'qiankun'

const isDev = process.env.NODE_ENV === 'development'
const child1Entry = isDev ? '//localhost:8081' : '//localhost:8081'
const child2Entry = isDev ? '//localhost:8082' : '//localhost:8082'

// 按 hash 区分子应用：哪个路由匹配就挂载哪个，切换时会先卸载上一个再挂载当前
function activeRuleByHash(prefix) {
  return (location) =>
    location.hash === prefix || location.hash.startsWith(prefix + '/')
}

/** 生成子应用 props：$app + init(opts) 写入 window.$app.apps[appKey].window / .vm */
function createChildProps(appKey) {
  return {
    $app: window.$app,
    init(opts) {
      if (opts) {
        window.$app.apps[appKey].window = opts.window
        window.$app.apps[appKey].vm = opts.vm
      }
    }
  }
}

let qiankunStarted = false

/**
 * 在 MicroApp 组件首次挂载时调用，确保容器已存在后再注册并启动 qiankun（只执行一次）
 */
export function ensureAppsRegistered() {
  if (qiankunStarted) return
  qiankunStarted = true

  console.log('ensureAppsRegistered', child1Entry, child2Entry, document.getElementById('subapp-child1'))
  registerMicroApps(
    [
      {
        name: 'child1-app',
        entry: child1Entry,
        container: '#subapp-child1',
        activeRule: activeRuleByHash('#/child1'),
        props: createChildProps('child1')
      },
      {
        name: 'child2-app',
        entry: child2Entry,
        container: '#subapp-child2',
        activeRule: activeRuleByHash('#/child2'),
        props: createChildProps('child2')
      }
    ],
    {
      beforeLoad: (app) => {
        console.log('qiankun beforeLoad', app.name)
      },
      beforeMount: (app) => {
        console.log('qiankun beforeMount', app.name)
      },
      afterMount: (app) => {
        console.log('qiankun afterMount', app.name)
        // 同步主应用 store 到子应用
        if (window.$app?.store?.state && window.$app.emit) {
          setTimeout(() => {
            const state = window.$app.store.state
            if (state.usrs) {
              window.$app.emit('store-state', { prop: 'usrs', value: state.usrs })
            }
          }, 100)
        }
      },
      beforeUnmount: (app) => {
        console.log('qiankun beforeUnmount', app.name)
        const appKey = app.name === 'child1-app' ? 'child1' : app.name === 'child2-app' ? 'child2' : app.name
        const slot = window.$app?.apps?.[appKey]
        const $app = slot?.window?.$app
        if ($app?.onBeforeUnmount) {
          try {
            $app.onBeforeUnmount()
          } catch (e) {
            console.warn('qiankun beforeUnmount child callback error', e)
          }
        }
      },
      afterUnmount: (app) => {
        console.log('qiankun afterUnmount', app.name)
        const appKey = app.name === 'child1-app' ? 'child1' : app.name === 'child2-app' ? 'child2' : app.name
        const slot = window.$app?.apps?.[appKey]
        if (slot) {
          slot.window = null
          slot.vm = null
        }
      }
    }
  )

  // 禁用预加载
  start({ prefetch: false })
}

/** @deprecated 改为在 MicroApp 首次挂载时调用 ensureAppsRegistered()，避免 container 尚未渲染 */
export function registerApps() {
  ensureAppsRegistered()
}
