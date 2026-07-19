<template>
  <div class="api-mixin-demo">
    <p>{{ mixinText }}</p>
    <p>
      <input 
        type="text" 
        v-insert
        v-model="text"
        style="width: 300px">
    </p>
    <p>
      上面的文案重新输入内容后，过滤器过滤后的内容：{{ text | spaceFilter('、') }}
    </p>
  </div>
</template>

<script>
import mixin from './mixins.js'
export default {
  // 局部混入
  mixins: [mixin],
  // 局部指令
  directives: {
    insert: {
      // 初始化绑定触发一次
			bind(el, binding, vnode, oldVnode) {
				// console.log('bind', el, binding, vnode, oldVnode)
			},
			// 元素插入到父节点下时触发，父节点不一定插入到文档中
			inserted(el, binding, vnode, oldVnode) {
				// console.log('inserted', el, binding, vnode, oldVnode)
				el.value = '我绑定了指令 v-insert 指令自动插入了文案'
			},
			// 组件 vnode 和子 vnode 全更新后触发
			componentUpdated(el, binding, vnode, oldVnode) {
				// console.log('componentUpdated', el, binding, vnode, oldVnode)
			},
			// 元素和指令解绑时触发
			unbind(el, binding, vnode, oldVnode) {
				// console.log('unbind', el, binding, vnode, oldVnode)
			}
    }
  },
  // 局部过滤器 
  filters: {
    spaceFilter(value, param) {
      return value.split('').join(param)
    }
  },
  data() {
    return {
      text: ''
    }
  }
}
</script>

<style lang="scss">
  .api-mixin-demo {

  }
</style>