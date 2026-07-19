<template>
  <div 
    class="w-drag"
    :class="{ dragging: dragging, disabled: disabled }"
    :style="style"
    @mousedown="onMouseDown"
    @mouseup="onInnerMounseUp">
    <slot></slot>
  </div>
</template>

<script>
  import { debounce } from '../../utils/utils'

  export default {
    name: 'wDrag',
    props: {
      disabled: Boolean
    },
    data() {
      return {
        dragging: false,
        style: null
      }
    },
    methods: {
      find: debounce(function (event) {
        if (!this.dragging) return
        this.$emit('find', event)
      }),
      onMoving(event) {
        if (!this.dragging) return

        // 更新位置
        const translate3d = `translate(${event.clientX - this.prevX}px, ${event.clientY - this.prevY}px)`
        this.style = { transform: translate3d }
        
        this.$emit('dragging', event)
        
        // 寻找目标元素
        this.find(event)
      },
      onMouseUp(event) {
        // 销毁事件
        document.removeEventListener('mousemove', this.onMoving)
        document.removeEventListener('mouseup', this.onMouseUp)

        // 重置状态
        this.dragging = false
        this.style = { transition: 'all .2s ease' }
        document.body.style.cursor = this.prevCursor
        document.body.style.userSelect = this.prevUserSelect

        this.$emit('end', event)
      },
      onInnerMounseUp() {
        clearTimeout(this.startTimer)
      },
      onMouseDown(event) {
        if (this.disabled) return

        // 延迟触发拖拽，避免用户只是想点击而已
        this.startTimer = setTimeout(() => {
          this.$emit('start', event)

          // 监听事件
          document.addEventListener('mousemove', this.onMoving)
          document.addEventListener('mouseup', this.onMouseUp)

          // 更新状态
          this.dragging = true
          this.style = null
          this.prevX = event.clientX
          this.prevY = event.clientY
          this.prevCursor = document.body.style.cursor
          this.prevUserSelect = document.body.style.userSelect
          document.body.style.cursor = 'grabbing'
          document.body.style.userSelect = 'none'
        }, 100)
      }
    }
  }
</script>

<style lang="scss">
  .w-drag {
    cursor: grab;
    user-select: none;

    &.dragging {
      pointer-events: none;
      cursor: grabbing;
      z-index: 100;
    }

    &.disabled {
      cursor: not-allowed;
    }
  }
</style>