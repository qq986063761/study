<template>
  <p>组件1</p>
</template>

<script>
export default {
  activated() {
    console.log('组件1 activated')
  },
  deactivated() {
    console.log('组件1 deactivated')
  }
}
</script>

<style>

</style>