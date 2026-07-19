<template>
  <div>
    <el-button type="primary" v-dr-click @click="onClick">点击</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    onClick() {
      console.log('click')
    }
  }
}
</script>