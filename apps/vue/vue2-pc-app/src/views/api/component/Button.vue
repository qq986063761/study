<template>
  <div>
    <p>
      v-bind="$attrs" v-on="$listeners" 配合 inheritAttrs 可以
      渗透一层传递除了 props 之外的其他原始属性和事件，为了二次开发组件
    </p>
    <el-button
      v-bind="$attrs"
      v-on="$listeners">
      我没有配置任何属性，通过父组件的配置可以透传配置到组件中
    </el-button>
  </div>
</template>

<script>
  export default {
    inheritAttrs: false
  }
</script>

<style>

</style>