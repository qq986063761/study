<template>
  <div>
    <el-card style="width: 300px">
      <div 
        slot="header" 
        class="clearfix"
        v-drag="{container: '.el-card'}">
        <span>卡片名称</span>
      </div>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style>
</style>