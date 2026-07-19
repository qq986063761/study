<template>
  <div class="child-view">
    <MicroApp name="child2" />
  </div>
</template>

<script>
import MicroApp from '@/components/MicroApp.vue'

export default {
  name: 'Child2View',
  components: {
    MicroApp
  }
}
</script>

<style lang="scss" scoped>
.child-view {
  width: 100%;
  height: 100%;
}
</style>
