<!-- defineExpose 演示组件：通过 defineExpose 暴露方法/属性给父组件 -->
<template>
  <div class="expose-component">
    <p>内部计数: {{ internalCount }}</p>
    <p>内部消息: {{ internalMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const internalCount = ref(0)
const internalMsg = ref('Hello')

// 暴露对外方法
function increment() {
  internalCount.value++
}

function reset(n = 0) {
  internalCount.value = n
}

function getData() {
  return { count: internalCount.value, msg: internalMsg.value }
}

// defineExpose: 只暴露这些，internalMsg 等未被暴露的父组件无法访问
defineExpose({ internalCount, increment, reset, getData })
</script>

<style scoped>
.expose-component {
  padding: 15px;
  background-color: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  margin: 10px 0;
}
.expose-component p {
  margin: 5px 0;
}
</style>
