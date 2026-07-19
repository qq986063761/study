<template>
  <div class="kb-select-demo">
    <div 
      class="scroller"
      v-kb-select="{
        index: index,
        itemClass: 'item',
        onChange: onChange, // onKeyBoardChange({index}) {}
        onEnter: onEnter
      }"
    >
      <div class="item" 
        :class="{active: index === n - 1}"
        :key="n" 
        v-for="n in 100">
        {{ n }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: 0
    }
  },
  methods: {
    onChange(data) {
      this.index = data.index
      console.log('change', data)
    },
    onEnter() {
      console.log('enter')
    }
  }
}
</script>

<style lang="scss">
  .kb-select-demo {
    .scroller {
      max-height: 500px;
      border: 1px solid #999;
      overflow: auto;
    }
    .item {
      height: 40px;
      + .item {
        border-top: 1px solid #999;
      }
      &.active {
        background: #999;
      }
    }
  }
</style>