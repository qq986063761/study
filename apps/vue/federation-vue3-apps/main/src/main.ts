import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ElButton, ElCard, ElDialog, ElIcon, ElLoading, ElMenu, ElMenuItem } from 'element-plus'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/card/style/css'
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/icon/style/css'
import 'element-plus/es/components/loading/style/css'
import 'element-plus/es/components/menu/style/css'
import 'element-plus/es/components/menu-item/style/css'
import 'element-plus/es/components/message/style/css'

import App from './App.vue'
import router from './router'
import { setSubAppAjaxLoader } from './ajax'
import { setupGlobalComponents } from './global-components'
import { registerRemoteComponents } from './remote-components'
import {
  loadSubAppAjax,
  loadSubAppStore,
  setupSubAppLazyLoadGuard,
} from './sub-app-loader'
import { setSubAppStoreLoader, setupStoreRegistry } from './stores'
import i18n, { registerRemoteI18nMessages } from './i18n'
// 确保 @main/runtime 作为 shared provider 进入 share scope
import './runtime'

async function bootstrap(): Promise<void> {
  const app = createApp(App)
  const pinia = createPinia()

  setupStoreRegistry(pinia)
  setSubAppStoreLoader(loadSubAppStore)
  setSubAppAjaxLoader(loadSubAppAjax)
  setupGlobalComponents(app)
  setupSubAppLazyLoadGuard()

  app.use(pinia)
  app.use(router)
  app.use(i18n)
  app.use(ElButton)
  app.use(ElCard)
  app.use(ElDialog)
  app.use(ElIcon)
  app.use(ElLoading)
  app.use(ElMenu)
  app.use(ElMenuItem)

  await Promise.all([registerRemoteComponents(app), registerRemoteI18nMessages()])

  app.mount('#app')
}

void bootstrap()
