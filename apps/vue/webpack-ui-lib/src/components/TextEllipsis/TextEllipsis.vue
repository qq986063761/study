<template>
  <div class="w-text-ellipsis">
    <slot name="before"></slot>
    <span 
      ref="text" 
      class="w-text-ellipsis-text" 
      :key="keyIndex"
      :style="{ lineHeight: `${lineHeight}px` }">
      {{ content }}
    </span>
    <span 
      class="w-text-ellipsis-more" 
      v-show="oversize">
      ...
      <slot name="more"></slot>
    </span>
    <slot name="after"></slot>
  </div>
</template>

<script>
export default {
  name: 'wTextEllipsis',
  props: {
    content: String,
    lineHeight: {
      type: Number,
      default: 20
    },
    rows: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      oversize: false,
      keyIndex: 0,
    }
  },
  computed: {
    height() {
      return this.rows * this.lineHeight
    }
  },
  watch: {
    content: 'init',
    height: 'init'
  },
  methods: {
    init() {
      this.oversize = false
      this.keyIndex += 1
      if (this.height) this.limitShow()
    },
    limitShow() {
      this.$nextTick(() => {
        let textEl = this.$refs.text
        let n = 1000
        if (textEl && this.$el.offsetHeight > this.height) {
          this.oversize = true
          let text = this.content
          while (this.$el.offsetHeight > this.height && n > 0) {
            if (this.$el.offsetHeight > this.height * 2) {
              textEl.innerText = text = text.substring(
                0,
                Math.floor(text.length / 2)
              )
            } else {
              textEl.innerText = text = text.substring(0, text.length - 2)
            }
            n--
          }
        }
      })
    },
  },
  mounted() {
    this.init()
  },
}
</script>

<style lang="scss">
.w-text-ellipsis-text {
  word-break: break-all;
}
.w-text-ellipsis-more {
  display: inline-block;
}
</style>