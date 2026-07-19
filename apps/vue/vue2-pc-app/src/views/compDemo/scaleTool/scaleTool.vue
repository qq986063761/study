<template>
  <div class="scale-tool-demo">
    <div class="scroller" ref="scroller">
      <div ref="content" class="content">
        <node :data="item" v-for="(item, i) in data" :key="i"></node>
      </div>
    </div>
    <scale-tool
      node-class="node-content"
      :scroller="scroller"
      :content="content"
    >
    </scale-tool>
  </div>
</template>

<script>
import node from './node.vue'

export default {
  components: { node },
  data() {
    return {
      scroller: null,
      content: null,
      data: [{}, {}, {}, {}],
    }
  },
  mounted() {
    this.scroller = this.$refs.scroller
    this.content = this.$refs.content
  },
}
</script>

<style lang="scss">
.scale-tool-demo {
  position: relative;
  height: 100%;
  padding: 0 !important;
  .scroller {
    height: 100%;
    padding: 20px;
  }
  .content {
    float: left;
  }
}
</style>