export default {
  props: {
    text: String
  },
  render(h) {

    return h('div', {
      class: {
        block: true
      }
    }, [
      // 作用域插槽
      this.$scopedSlots.header('header 参数'), 
      // 获取默认 slot
      this.$slots.default,
      h('p', '接收到父组件的 props：' + this.text)
    ])
  }
}