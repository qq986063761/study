<template>
  <div class="page2">
    <h1>页面2</h1>
  </div>
</template>

<script>
  import { getData } from '@/common/utils.js'

  export default {
    mounted() {
      getData()
    }
  }
</script>

<style>

</style>