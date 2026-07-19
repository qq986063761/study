<template>
  <div>
    <p>child</p>
  </div>
</template>

<script>
export default {
  methods: {
    init(to, from) {

    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.init(to, from))
  }
}
</script>

<style>

</style>