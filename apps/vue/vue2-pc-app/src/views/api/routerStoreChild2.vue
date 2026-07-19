<template>
  <div>
    <p>child2</p>
  </div>
</template>

<script>
export default {
  methods: {
    init(to, from) {
      console.log('获取到 url 解析参数', to.params)
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.init(to, from))
  }
}
</script>

<style>

</style>