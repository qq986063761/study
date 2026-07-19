<template>
  <el-button 
    class="child1-button" 
    type="primary" 
    @click="handleClick">
    {{ text || '没获取到 child1 中 store 数据' }}
  </el-button>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Child1Button',
  mounted() {
    console.log('child1 Button mounted', this)
  },
  computed: {
    ...mapState(['text'])
  },
  methods: {
    handleClick(e) {
      // 先触发自定义的点击处理
      this.$ajax.post()
    }
  }
}
</script>