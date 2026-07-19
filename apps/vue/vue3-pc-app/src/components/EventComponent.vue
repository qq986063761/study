<template>
  <div class="event-component">
    <h4>事件组件</h4>
    <p>点击按钮向父组件发送事件</p>
    <button @click="sendEvent">发送自定义事件</button>
    <button @click="sendDataEvent">发送带数据的事件</button>
  </div>
</template>

<script setup>
// 定义 emits - defineEmits 是编译器宏，无需导入
const emit = defineEmits(['custom-event'])

// 发送简单事件
const sendEvent = () => {
  emit('custom-event', {
    message: '简单事件',
    timestamp: new Date().toLocaleTimeString()
  })
}

// 发送带数据的事件
const sendDataEvent = () => {
  emit('custom-event', {
    message: '带数据的事件',
    timestamp: new Date().toLocaleTimeString(),
    data: {
      id: Math.random(),
      value: '一些重要数据'
    }
  })
}
</script>

<style scoped>
.event-component {
  padding: 15px;
  background-color: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  margin: 10px 0;
}

.event-component h4 {
  margin-top: 0;
  color: #409eff;
}

.event-component button {
  margin: 5px;
  padding: 6px 12px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.event-component button:hover {
  background-color: #529b2e;
}
</style>
