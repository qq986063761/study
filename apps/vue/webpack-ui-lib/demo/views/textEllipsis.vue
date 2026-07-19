<template>
  <div class="text-ellipsis-page">
    <w-text-ellipsis
      :line-height="30"
      :rows="3"
      :content="content"
      @click.native="click"
    ></w-text-ellipsis>

<pre class="code">
  &lt;w-text-ellipsis
    :line-height="30"
    :rows="3"
    :content="content"
  &gt;&lt;/w-text-ellipsis&gt;
</pre>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        content: ''
      }
    },
    methods: {
      click() {
        if (!this.times) {
          this.times = 20
        } else {
          this.times = this.times === 20 ? 2 : 20
        }
        
        let str = ''
        for (let index = 0; index < this.times; index++) {
          str += '点击我可以调整内容长度来测试内容变化后的溢出隐藏效果；'
        }
        this.content = str
      },
    },
    created() {
      this.click()
    }
  }
</script>

<style lang="scss">
  .text-ellipsis-page {
    .w-text-ellipsis {
      width: 500px;
      cursor: pointer;
    }
  }
</style>