<template>
  <div class="scollbar-demo">
    <div class="scroll2">
      <div ref="scroller" class="scroll1">
        <div class="content" :key="n" v-for="n in 20">
          很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多很多内容
        </div>
      </div>
      <ss-bar :scroller="scroller"></ss-bar>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        scroller: null
      }
    },
    mounted() {
      this.scroller = this.$refs.scroller
    }
  }
</script>

<style lang="scss">
  .scollbar-demo {
    .scroll2 {
      height: 300px;
      background: #fff;
      overflow: auto;
    }
    .scroll1 {
      width: 80%;
      height: 400px;
      background: #fff;
      overflow: auto;
    }
    .content {
      width: 1000px;
    }
  }
</style>