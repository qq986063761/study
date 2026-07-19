<template>
  <div>
    <p>
      内置组件 keep-alive 可以控制内部组件切换，和组件缓存优化体验；
      component 组件可以实现动态变化组件
    </p>
    <el-button
      type="primary"
      @click="compName = compName === 'child1' ? 'child2' : 'child1'">
      切换下面的组件
    </el-button>
    <keep-alive>
      <component class="block" :is="compName"></component>
    </keep-alive>
  </div>
</template>

<script>
import Child1 from './Child1'
import Child2 from './Child2'

export default {
  components: {
    Child1,
    Child2
  },
  data() {
    return {
      compName: 'child1'
    }
  }
}
</script>

<style>

</style>