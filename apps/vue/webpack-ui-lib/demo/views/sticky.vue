<template>
  <div class="sticky-page">
    <div ref="scroller" class="scroller">
      <div v-for="n in 30" :key="n">
        上方内容上方内容上方内容上方内容上方内容上方内容上方内容上方内容上方内容上方内容上方内容
      </div>
      <w-sticky 
        :top="10"
        :bottom="10"
        :scroller="scroller">
        <div class="content">
          需要固定部分
        </div>
      </w-sticky>
      <div v-for="n in 50" :key="n + 'b'">
        下方内容下方内容下方内容下方内容下方内容下方内容下方内容下方内容下方内容下方内容下方内容
      </div>
    </div>
<pre class="code">
  &lt;w-sticky 
    :top="50"
    :scroller="scroller"
  &gt;&lt;/w-sticky&gt;
</pre>
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
  .sticky-page {
    display: flex;
    flex-direction: column;
    .scroller {
      flex: 1;
      overflow: auto;
    }
    .content {
      padding: 10px;
      background: skyblue;
    }
  }
</style>