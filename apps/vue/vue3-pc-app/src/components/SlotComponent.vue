<template>
  <div class="slot-component">
    <h4>插槽组件</h4>
    
    <!-- 具名插槽 - 头部 -->
    <div class="slot-header">
      <slot name="header">
        <p>默认头部内容</p>
      </slot>
    </div>
    
    <!-- 默认插槽 -->
    <div class="slot-content">
      <slot>
        <p>默认内容</p>
      </slot>
    </div>
    
    <!-- 具名插槽 - 底部 -->
    <div class="slot-footer">
      <slot name="footer">
        <p>默认底部内容</p>
      </slot>
    </div>
  </div>
</template>

<script setup>
// 插槽组件不需要特殊的 script 逻辑
</script>

<style scoped>
.slot-component {
  padding: 15px;
  background-color: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  margin: 10px 0;
}

.slot-component h4 {
  margin-top: 0;
  color: #409eff;
}

.slot-header {
  background-color: #e1f3d8;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.slot-content {
  background-color: #fff2e8;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.slot-footer {
  background-color: #f0f9ff;
  padding: 10px;
  border-radius: 4px;
  border: 1px dashed #409eff;
}
</style>
