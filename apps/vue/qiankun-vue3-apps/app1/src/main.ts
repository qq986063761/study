import { createApp, type App as VueApp } from 'vue'
import { createPinia } from 'pinia'
import { exportQiankunLifeCycles, qiankunWindow } from '@tiny-codes/vite-plugin-qiankun'

import App from './App.vue'
import { createAppRouter } from './router'

interface QiankunProps {
  container?: HTMLElement
}

let app: VueApp<Element> | null = null
let mountRoot: Element | null = null

function render(props: QiankunProps = {}) {
  mountRoot = props.container?.querySelector('#app') ?? document.querySelector('#app')

  if (!mountRoot) return

  const router = createAppRouter(qiankunWindow.__POWERED_BY_QIANKUN__ ? '/app1' : '/')

  app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount(mountRoot)
}

if (qiankunWindow.__POWERED_BY_QIANKUN__) {
  exportQiankunLifeCycles({
    name: 'app1',
    bootstrap() {},
    mount(props: QiankunProps) {
      render(props)
    },
    unmount() {
      app?.unmount()
      app = null
      mountRoot = null
    },
  })
} else {
  render()
}
