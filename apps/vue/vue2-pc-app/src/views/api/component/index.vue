<template>
  <div class="api-component-demo">
    <div class="block">
      <p>我是父组件</p>
      <counter 
        class="block"
        :init-num="1" 
        @on-click="onCounterClick">
      </counter>
      <p>接收 v-model 实现双向绑定的值 text：{{ text }}</p>
      <p>接收 :propName.sync 实现双向绑定的值 text1：{{ text1 }}</p>
      <my-input 
        class="block"
        v-model="text"
        :text1.sync="text1">
      </my-input>
      <my-button 
        class="block"
        type="danger"
        @click="onClickBtn">
      </my-button>
      <keep-alive-demo class="block"></keep-alive-demo>
      <async class="block"></async>
      <deep class="block" :data="treeData"></deep>
      <slot-demo class="block">
        <!-- 新语法：#head="{title}"，如果 head 是变量，
          可以直接通过动态插槽 #[head]="{...}" 注入内容到变量名对应的插槽位置 -->
        <p slot="head" slot-scope="{title}">
          获取到子组件内通过插槽传递的信息：{{ title }}
        </p>
        <!-- 新语法：v-slot="{content}"  -->
        <p slot-scope="{content}">
          没定义插槽名的部分占用默认位置，获取到子组件通过插槽传递的信息：{{ content }}
        </p>
      </slot-demo>
    </div>
  </div>
</template>

<script>
import Counter from './Counter'
import MyInput from './Input'
import MyButton from './Button'
import KeepAliveDemo from './KeepAlive'
import AsyncLoading from './AsyncLoading'
import AsyncError from './AsyncError'
import Deep from './Deep'
import SlotDemo from './Slot'

export default {
  // provide 提供的数据，可以跨子组件，给子孙组件直接获取到数据
  provide() {
    return {
      deepRoot: this
    }
  },
  components: {
    SlotDemo,
    Deep,
    // 这是复杂配置的异步组件，简单的异步组件可使用：
    // Async: () => import('./Async'),
    Async: () => ({
      // 需要加载的组件 (应该是一个 `Promise` 对象)
      component: new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(import('./Async'))
        }, 4000)
      }),
      // 加载中使用的组件
      loading: AsyncLoading,
      // 加载失败时的组件
      error: AsyncError,
      // 显示加载中组件的延迟时间
      delay: 0,
      // 组件加载超时时间
      timeout: 6000
    }),
    Counter,
    MyInput,
    MyButton,
    KeepAliveDemo
  },
  data() {
    return {
      text: '',
      text1: '',
      treeData: [
        {
          label: '第一层',
          children: [
            {
              label: '第二层',
              children: [
                {
                  label: '第三层',
                  children: [
                    {
                      label: '第四层'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    onClickBtn() {
      console.log('点击了一下我二次封装的按钮')
    },
    onCounterClick() {
      console.log('接收到子组件 counter 的事件')
    }
  }
}
</script>

<style lang="scss">
  .api-component-demo {
    padding: 20px;
  }
</style>