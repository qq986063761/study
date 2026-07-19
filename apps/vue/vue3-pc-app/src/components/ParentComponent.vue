<template>
  <div class="parent-component">
    <h4>父组件 (Provide/Inject 示例)</h4>
    <p>当前主题: {{ theme }}</p>
    <button @click="toggleTheme">切换主题</button>
    <ChildComponent />
  </div>
</template>

<script setup>
import { inject } from 'vue'
import ChildComponent from './ChildComponent.vue'

// 注入祖先组件提供的数据
const theme = inject('theme')
const toggleTheme = inject('toggleTheme')
</script>

<style scoped>
.parent-component {
  padding: 15px;
  background-color: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  margin: 10px 0;
}

.parent-component h4 {
  margin-top: 0;
  color: #409eff;
}

.parent-component button {
  margin: 5px;
  padding: 6px 12px;
  background-color: #e6a23c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.parent-component button:hover {
  background-color: #cf9236;
}
</style>
