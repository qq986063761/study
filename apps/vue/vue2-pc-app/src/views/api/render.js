import child from './renderChild'
import child2 from './renderChild2'

export default {
  components: {
    child,
    child2
  },
  directives: {
    blue(el) {
      el.style.background = 'skyblue'
    }
  },
  render(h) {
    // 渲染函数非常灵活，可以利用 js 实现灵活业务
    let list = []
    for (let i = 0; i < 3; i++) {
      list.push(h(
        'p', 
        {
          // 传递 key
          key: i,
          // ref 挂载对象
          ref: 'item',
          // 如果 ref 是遍历组件，则设置为 true，让 ref 变成数组用于访问
          refInFor: true
        },
        '渲染函数很灵活的渲染节点' + i)
      )
    }

    // h 是用于创建虚拟 dom 的函数
    return h('div', {
      // class 配置
      class: {
        'api-render-demo': true
      }
    }, [
      ...list,
      h('child', {
        // 传递 props 给子组件
        props: {
          text: '传递给子组件的 props 内容'
        },
        // 样式
        style: {
          color: 'red'
        },
        // 原始属性
        attrs: {
          id: 'child'
        },
        // DOM 属性
        domProps: {
          // innerHTML: 'baz'
        },
        // 传递作用域插槽给子组件
        scopedSlots: {
          header: props => {
            return h('div', '作用域插槽 header：' + props)
          }
        },
        // 原生事件，用在组件上
        nativeOn: {
          click: event => {
            console.log('原生事件', event)
          }
        },
        // 事件，但不支持修饰符
        on: {
          click: event => {
            console.log('事件', event)
          }
        },
        // 使用指令
        directives: [
          {
            name: 'blue',
            value: ''
          }
        ]
      }, [
        h('p', '默认内容'),
      ]),
      h('child2', [
        h('p', '默认内容')
      ])
    ])
  },
  mounted() {
    console.log('获取到了 ref 挂载对象', this.$refs.item)
  }
}