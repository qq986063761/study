<template>
  <div class="drag-page">
    <w-drag
      @start="onStart"
      @dragging="onDragging"
      @end="onEnd"
      @find="onFind"
      @click="onClick">
      点我拖动
    </w-drag>
    
<pre class="code">
  &lt;w-drag
    :disabled="false"
    @start="onStart"
    @dragging="onDragging"
    @end="onEnd"
    @find="onFind"
  &gt;&lt;/w-drag&gt;
</pre>
  </div>
</template>

<script>
  export default {
    methods: {
      onClick(event) {
        console.log('click', event)
      },
      onStart(event) {
        console.log('start', event)
      },
      onDragging(event) {
        console.log('dragging', event)
      },
      onEnd(event) {
        console.log('end', event)
      },
      onFind(event) {
        console.log('find', event)
      }
    }
  }
</script>

<style lang="scss">
  .drag-page {
    .w-drag {
      width: 200px;
      height: 200px;
      background-color: skyblue;
      box-shadow: 0 0 10px;
    }
  }
</style>