export default {
  // 函数式组件没有响应式，只有简单的 prop 和 context 对象
  // 用于封装简单的工具用
  functional: true,
  render(h, context) {
    return h('transition', {
      props: {
        name: 'fade',
        appear: true
      }
    }, [
      h('div', {
        class: {
          block: true
        },
      }, [
        h('p', '函数式组件'),
        ...context.children
      ])
    ])
  }
}