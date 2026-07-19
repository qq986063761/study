<template>
  <div class="lifecycle-component">
    <h4>生命周期组件</h4>
    <p>组件已挂载，查看控制台输出生命周期钩子</p>
    <p>计数: {{ count }}</p>
    <button @click="increment">增加计数</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, onUnmounted, onBeforeMount, onBeforeUpdate, onBeforeUnmount } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}

// 生命周期钩子
onBeforeMount(() => {
  console.log('LifecycleComponent: onBeforeMount - 组件挂载前')
})

onMounted(() => {
  console.log('LifecycleComponent: onMounted - 组件已挂载')
})

onBeforeUpdate(() => {
  console.log('LifecycleComponent: onBeforeUpdate - 组件更新前')
})

onUpdated(() => {
  console.log('LifecycleComponent: onUpdated - 组件已更新')
})

onBeforeUnmount(() => {
  console.log('LifecycleComponent: onBeforeUnmount - 组件卸载前')
})

onUnmounted(() => {
  console.log('LifecycleComponent: onUnmounted - 组件已卸载')
})
</script>

<style scoped>
.lifecycle-component {
  padding: 15px;
  background-color: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  margin: 10px 0;
}

.lifecycle-component h4 {
  margin-top: 0;
  color: #409eff;
}

.lifecycle-component button {
  margin: 5px;
  padding: 6px 12px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.lifecycle-component button:hover {
  background-color: #f23030;
}
</style>
