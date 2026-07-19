<template>
  <div class="child-component">
    <h4>子组件</h4>
    <p>接收到的消息: {{ message }}</p>
    <p>接收到的计数: {{ count }}</p>
    <p>用户信息: {{ user.name }} ({{ user.age }}岁)</p>
    <button @click="updateCount">更新计数</button>
  </div>
</template>

<script setup>
// 定义 props - defineProps 和 defineEmits 是编译器宏，无需导入
const props = defineProps({
  message: {
    type: String,
    default: '默认消息'
  },
  count: {
    type: Number,
    default: 0
  },
  user: {
    type: Object,
    default: () => ({})
  }
})

// 定义 emits
const emit = defineEmits(['update-count'])

// 子组件方法
const updateCount = () => {
  const newCount = props.count + 1
  emit('update-count', newCount)
}
</script>

<style scoped>
.child-component {
  padding: 15px;
  background-color: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  margin: 10px 0;
}

.child-component h4 {
  margin-top: 0;
  color: #409eff;
}

.child-component button {
  margin-top: 10px;
  padding: 6px 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.child-component button:hover {
  background-color: #337ecc;
}
</style>
