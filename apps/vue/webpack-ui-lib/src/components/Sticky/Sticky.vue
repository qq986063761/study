<template>
  <div 
    class="w-sticky"
    :style="outStyle">
    <div 
      ref="container" 
      class="w-sticky-container"
      :style="containerStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'wSticky',
  props: {
    // 向上固定时，距离滚动容器顶部的距离
    top: {
      type: Number,
      default: 0
    },
    // 需要向下固定时，距离滚动容器底部的距离
    bottom: Number,
    // 所在滚动容器
    scroller: HTMLElement
  },
  data() {
    return {
      outStyle: null,
      containerStyle: null
    }
  },
  watch: {
    scroller: 'init'
  },
  methods: {
    update() {
      const { container } = this.$refs
      const wrapRect = this.$el.getBoundingClientRect()
      const scrollRect = this.scroller.getBoundingClientRect()
      const rect = container.getBoundingClientRect()
      const scrollTop = this.scroller.scrollTop
      const topLimit = scrollRect.top + this.top
      const bottomLimit = scrollRect.bottom - (this.bottom || 0)

      // 如果粘性容器超出范围就固定
      const isOutTop = wrapRect.top < topLimit
      const isOutBottom = this.isFixedBottom && wrapRect.bottom > bottomLimit
      const isOut = isOutTop || isOutBottom
      if (!isOut) {
        const isReset = this.outScrollTop !== null && (scrollTop < this.outScrollTop || scrollTop > this.outScrollTop)
        // 如果滚动到了之前的位置就还原
        if (isReset) {
          this.outStyle = null
          this.containerStyle = null
          this.outScrollTop = null
        }
        return
      }
      
      // 超出范围后记录一下之前的状态，方便滚动过程中还原
      if (this.outScrollTop === null) {
        this.outScrollTop = scrollTop

        // 设置样式完成固定
        this.outStyle = {
          height: rect.height + 'px'
        }
        this.containerStyle = {
          position: 'fixed',
          top: (isOutBottom ? (bottomLimit - rect.height) : topLimit) + 'px',
          left: rect.left + 'px',
          width: rect.width + 'px',
          zIndex: 1
        }
      }
    },
    init() {
      if (!this.scroller) return
      this.scroller.addEventListener('scroll', this.update)

      this.outScrollTop = null
      this.isFixedBottom = this.bottom !== undefined
      if (this.isFixedBottom) this.update()
    }
  },
  beforeDestroy() {
    if (!this.scroller)
    this.scroller.removeEventListener('scroll', this.update)
  },
  mounted() {
    this.init()
  }
}
</script>