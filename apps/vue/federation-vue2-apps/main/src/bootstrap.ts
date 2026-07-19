import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { setSubAppAjaxLoader } from './ajax'
import {
  i18n,
  loadSubAppAjax,
  registerRemoteComponents,
  registerRemoteI18nMessages,
  setupSubAppLazyLoadGuard
} from './remote'

Vue.use(ElementUI)

async function bootstrap(): Promise<void> {
  console.log('bootstrap before')

  setSubAppAjaxLoader(loadSubAppAjax)
  setupSubAppLazyLoadGuard()
  await Promise.all([
    registerRemoteComponents(),
    registerRemoteI18nMessages()
  ])

  console.log('bootstrap after')
  new Vue({ router, store, i18n, render: (h) => h(App) }).$mount('#app')
}

void bootstrap()
