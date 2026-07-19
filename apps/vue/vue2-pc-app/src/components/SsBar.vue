<template>
  <div 
    class="suspend-scrollbar" 
    :style="outStyle"
    v-show="style">
    <div 
      class="scrollbar-inner"
      :style="style" 
      @mousedown="onScrollBarMouseDown"> 
    </div>
  </div>
</template>

<script>
  import {getScrollParents} from '@/assets/dom'
  import {debounce} from 'throttle-debounce'

  export default {
    name: 'ssBar',
    props: {
      scroller: HTMLElement, // 以哪个容器滚动为参考
    },
    data() {
      return {
        style: null,
        outStyle: null
      }
    },
    watch: {
      scroller: 'init'
    },
    methods: {
      init(scroller, oldScroller) {
        if (!this.scroller) return
        this.scrollers = getScrollParents(this.$el).filter(el => el !== this.scroller)

        if (!this.scrollers.length) return
        this.scrollers.forEach(el => el.addEventListener('scroll', this.update))
        window.addEventListener('resize', this.update)
        this.update()
      },
      onScrollBarMounseMove(event) {
        if (!this.dragging) return;

        let nextLeft = this.initScrollBarLeft + event.clientX - this.clientX;
        if (nextLeft < 0) nextLeft = 0;
        if ((nextLeft + this.initScrollBarWidth) > this.scroller.clientWidth) {
          nextLeft = this.scroller.clientWidth - this.initScrollBarWidth;
        }

        const ratio = nextLeft / this.scroller.clientWidth;
        this.scroller.scrollLeft = this.scroller.scrollWidth * ratio;
        this.nextLeft = nextLeft;

        Object.assign(this.style, {
          transform: `translateX(${ this.nextLeft }px)`
        });
      },
      onScrollBarMounseUp() {
        if (!this.dragging) return;

        document.removeEventListener('mousemove', this.onScrollBarMounseMove);
        document.removeEventListener('mouseup', this.onScrollBarMounseUp);

        this.initScrollBarLeft = this.nextLeft;
        this.dragging = false;
        document.body.style.userSelect = this.prevUserSelect;
      },
      onScrollBarMouseDown(event) {
        if (!this.style) return;

        document.addEventListener('mousemove', this.onScrollBarMounseMove);
        document.addEventListener('mouseup', this.onScrollBarMounseUp);

        this.dragging = true;
        this.clientX = event.clientX;
        this.prevUserSelect = document.body.style.userSelect;
        document.body.style.userSelect = 'none';
      },
      onUpdate(event) {
        const isScrollEvent = event && event.type !== 'resize'
        if (isScrollEvent) {
          // 如果垂直位置没变化就不用更新状态
          if (event.target.scrollTop &&
            this.scroller._parentPrevScrollTop &&
            event.target.scrollTop === this.scroller._parentPrevScrollTop) {
            return
          }
          this.scroller._parentPrevScrollTop = event.target.scrollTop
        }
        // 内部都没有滚动内容就不需要继续了
        if (!this.scroller || this.scroller.scrollWidth === this.scroller.clientWidth) {
          return
        }

        const mountScroller = (isScrollEvent ? event.target : this.scrollers[0]) || document.body
        const mountScrollRect = mountScroller.getBoundingClientRect()
        const scrollBarHeight = (mountScroller.offsetHeight - mountScroller.clientHeight) || 0
        const scrollRect = this.scroller.getBoundingClientRect()
        const isContainHalf = scrollRect.top < mountScrollRect.bottom && scrollRect.bottom > mountScrollRect.bottom
        const isShow = isContainHalf
        
        this.outStyle = {
          left: scrollRect.left + 'px',
          top: (mountScrollRect.bottom - 15 - scrollBarHeight) + 'px',
          width: this.scroller.clientWidth + 'px'
        }
        
        if (isShow) {
          const residueTotal = this.scroller.scrollWidth - this.scroller.clientWidth;
          const current = this.scroller.scrollLeft;
          const ratio = this.scroller.clientWidth / this.scroller.scrollWidth
          this.initScrollBarWidth = this.scroller.clientWidth * ratio
          this.initScrollBarLeft = (this.scroller.clientWidth - this.initScrollBarWidth) * current / residueTotal
          
          this.style = {
            width: `${this.initScrollBarWidth}px`,
            transform: `translateX(${this.initScrollBarLeft}px)`
          }
        } else {
          this.style = null
        }
      }
    },
    mounted() {
      this.update = debounce(100, this.onUpdate)
      this.init()
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.update)
      this.scrollers && this.scrollers.forEach(el => el.removeEventListener('scroll', this.update))
    },
  }
</script>

<style lang="scss">
  .suspend-scrollbar {
    position: fixed;
    height: 15px;
    width: 100%;
    background: rgba(0, 0, 0, .2);
    opacity: 0.7;
    z-index: 10;
    &:hover {
      opacity: 1;
    }
    .scrollbar-inner {
      height: 100%;
      background-color: rgba(0, 0, 0, .7);
      cursor: pointer;
    }
  }
</style>