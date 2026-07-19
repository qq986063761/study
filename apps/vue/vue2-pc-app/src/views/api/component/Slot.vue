<template>
  <div>
    <p>插槽，用于父组件传递节点，在子组件对应位置显示</p>
    <!-- name 定义插槽名，父组件通过对应名字将内容插入到目标位置 -->
    <slot name="head" :title="title">
      默认 head 显示内容
    </slot>
    <slot content="默认信息">
      默认显示内容
    </slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '标题信息'
    }
  }
}
</script>

<style>

</style>