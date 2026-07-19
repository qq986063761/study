<template>
  <div class="scale-tool-node">
    <div class="node-content" @click="onOpen"></div>
    <div class="children" v-if="open && data.children">
      <node
        :data="item" 
        v-for="(item, i) in data.children" 
        :key="i">
      </node>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'node',
    props: {
      data: Object
    },
    data() {
      return {
        open: false
      }
    },
    methods: {
      onOpen() {
        // 如果全局有被拖拽的行为，就不执行点击
        if (window.isDragged) return

        this.open = !this.open
        if (!this.data.children) {
          this.data.children = [{}, {}, {}]
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .scale-tool-node {
    display: flex;
    .node-content {
      width: 200px;
      height: 150px;
      background: #fff;
      border: 1px solid lightgray;
      border-radius: 4px;
      cursor: pointer;
      flex-shrink: 0;
      &:hover {
        border: 1px solid blue;
      }
    }
    .children {
      padding-left: 10px;
      flex-shrink: 0;
    }
    + .scale-tool-node {
      margin-top: 10px;
    }
  }
</style>