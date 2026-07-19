<template>
  <div class="async-component">
    <h4>异步组件已加载</h4>
    <p>这个组件是异步加载的，使用了 2 秒的延迟</p>
    <p>当前时间: {{ currentTime }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentTime = ref(new Date().toLocaleString())
</script>

<style lang="scss" scoped>
.async-component {
  padding: 20px;
  background-color: #f0f9ff;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}
</style>
