<template>
  <div id="app">
    <h1>页面1</h1>
    <img class="img" :src="require('@/pages/page1/img/img.jpg').default">
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

<style lang="scss" scoped>
  #app {
    box-sizing: border-box;
    .img {
      width: 300px;
    }
  }
</style>