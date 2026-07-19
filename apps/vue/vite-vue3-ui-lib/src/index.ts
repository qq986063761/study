// UI 组件库入口文件
// 用于 vite build --config vite.lib.config.ts 构建

import type { App } from 'vue'
import UiButton from './components/Button.vue'
import UiInput from './components/Input.vue'
import UiDialog from './components/Dialog.vue'
import UiMenu from './components/Menu.vue'

// 按需引入时使用
export { UiButton, UiInput, UiDialog, UiMenu }

// 全量引入：app.use(UiLib)
const components = [UiButton, UiInput, UiDialog, UiMenu] as const

export const install = (app: App): void => {
  components.forEach((comp) => {
    if (comp.name) {
      app.component(comp.name, comp)
    }
  })
}
