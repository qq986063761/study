<template>
  <div>
    <div 
      class="items-wrap"
      @mouseenter="stop"
      @mouseleave="start">
      <div 
        ref="items"
        class="items" 
        v-for="n in 2"
        :style="itemsStyles[n - 1].style"
        :key="n">
        <div 
          class="item"
          v-for="(item, j) in list"
          :key="j">
          {{j}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        itemsStyles: [{}, {}],
        list: new Array(10).map(() => ({}))
      }
    },
    methods: {
      stop() {
        clearInterval(this.timer)
      },
      start() {
        const {items} = this.$refs
        const oneCycleWidth = items[0].offsetWidth
        
        this.timer = setInterval(() => {
          this.itemsStyles.forEach((item, i) => {
            if (!item.cycleTime) this.$set(item, 'cycleTime', 0) // 被放到后面循环的次数
            if (!item.offsetX) this.$set(item, 'offsetX', 0)
            item.offsetX -= 0.8
            
            // 如果当前 item 从前面消失后，马上放到最后实现循环
            const itemDisappearOffsetX = !i ? oneCycleWidth : (2 * oneCycleWidth)
            if (Math.abs(item.offsetX) > itemDisappearOffsetX) {
              // 因为总数组一直没变，所以这里距离每次重新把 item 放最后都要多加一轮的偏移量
              item.offsetX = !i ? oneCycleWidth : 0
            }
            
            this.$set(item, 'style', {
              transform: `translateX(${item.offsetX}px)`
            })
          })
        }, 1000 / 60)
      },
      init() {
        this.start()
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style lang="scss" scoped>
  .items-wrap {
    display: flex;
    width: 100%;
    overflow: hidden;
    .items {
      display: flex;
    }
    .item {
      width: 140px;
      height: 200px;
      border: 1px solid #ddd;
      flex-shrink: 0;
      margin-right: 10px;
    }
  }
</style>