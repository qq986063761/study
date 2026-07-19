<template>
  <div class="comp-counter">
    <p>
      组件是独立的，方便复用
    </p>
    <p>
      <el-button 
        type="primary" 
        @click="onClick">
        计数器加1，并且传递事件出去
      </el-button>
      计数器：{{ num }}
    </p>
  </div>
</template>

<script>
export default {
  // 接收父组件的传递属性
  props: {
    initNum: {
      type: Number,
      default: 0
    }
  },
  // data 是函数，为了和其他组件之间的 data 内部变量不互相污染
  data() {
    return {
      num: this.initNum
    }
  },
  methods: {
    onClick() {
      this.num++

      // 触发事件给父组件
      this.$emit('on-click')
    }
  }
}
</script>

<style lang="scss">
  .comp-counter {
    
  }
</style>