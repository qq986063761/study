import CommentInput from '@/components/CommentInput.vue'
import SsBar from '@/components/SsBar.vue'
import ScaleTool from '@/components/ScaleTool.vue'

import drClick from '@/directives/dr-click'
import drag from '@/directives/drag'
import scrollActiveItem from '@/directives/scroll-active-item'
import input from '@/directives/input'
import kbSelect from '@/directives/kb-select'

let components = [
  CommentInput,
  SsBar,
  ScaleTool
]

let directives = [
  drClick,
  drag,
  scrollActiveItem,
  input,
  kbSelect
]

// 插件定义
export default {
  install(Vue, opts) {
    components.forEach(component => {
      // 全局组件
      Vue.component(component.name, component)
    })

    directives.forEach(directive => {
      // 全局指令
      Vue.directive(directive.name, directive)
    })
  }
}