<!-- v-model 增强演示组件：支持多个 v-model -->
<template>
  <div class="model-component">
    <p>子组件内部</p>
    <el-input :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" placeholder="主 v-model" />
    <el-input :model-value="title" @update:model-value="$emit('update:title', $event)" placeholder="title v-model" style="margin-top: 5px" />
    <el-input :model-value="desc" @update:model-value="$emit('update:desc', $event)" placeholder="desc v-model" style="margin-top: 5px" />
  </div>
</template>

<script setup>
// Vue 3 支持多个 v-model 绑定，替代 Vue 2 的 .sync 修饰符
defineProps({
  modelValue: String,  // 默认 v-model
  title: String,        // v-model:title
  desc: String          // v-model:desc
})

defineEmits(['update:modelValue', 'update:title', 'update:desc'])
</script>

<style scoped>
.model-component { padding: 15px; background-color: #fef9f0; border: 1px solid #f0c78e; border-radius: 4px; margin: 10px 0; }
</style>
