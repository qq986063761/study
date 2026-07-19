<template>
  <p>组件2</p>
</template>

<script>
export default {
  activated() {
    console.log('组件2 activated')
  },
  deactivated() {
    console.log('组件2 deactivated')
  }
}
</script>

<style>

</style>