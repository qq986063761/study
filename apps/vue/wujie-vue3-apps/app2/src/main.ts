import { createApp, type App as VueApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

let app: VueApp<Element> | null = null

const render = () => {
  app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
}

const unmount = () => {
  app?.unmount()
  app = null
}

declare global {
  interface Window {
    __POWERED_BY_WUJIE__?: boolean
    __WUJIE_MOUNT?: () => void
    __WUJIE_UNMOUNT?: () => void
  }
}

if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = render
  window.__WUJIE_UNMOUNT = unmount
} else {
  render()
}
