<template>
  <div class="z-ellipsis-box" :style="wrapStyle">
    <div 
      ref="el"
      class="z-ellipsis"
      :class="{html: isHtml}"
      :style="style"
      v-title="titleDir"
      @click="onClick"
      v-pad-click="padClick">

      <!-- 等计算好了再显示 -->
      <template v-if="computedReady">
        <slot name="before"></slot>
        <span class="z-ellipsis-text" ref="text" v-name="contentHtml" @click="onClickText"></span>
        <span class="z-ellipsis-more" ref="more" v-show="oversize && (!isShowAll || isShowAll && expandRows)">
          ...
        </span>
        <el-button 
          ref="moreBtn"
          class="btn-more primary" 
          :class="{'is-open': isShowAll}"
          type="text" 
          after-icon="icon-dropdown"
          :hover-bg="false"
          v-if="oversize && showMore || isShowAll && expandRows" 
          @click="clickMore">
          {{showMore ? (isShowAll ? $t('okr.putAway') : $t('okr.seeMore')) : '...'}}
        </el-button>
      </template>
      <!-- 还没计算好的时候利用不显示的内容计算 -->
      <div class="z-ellipsis-hidden" v-else>
        <slot name="before"></slot>
        <span class="z-ellipsis-text" ref="text" v-name="contentHtml"></span>
        <span class="z-ellipsis-more" ref="more" v-show="oversize">
          ...
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import debounce from 'lodash/debounce'
  import { 
    formatHyperLink,
    addResizeListener, 
    removeResizeListener 
  } from '@/assets/js/utils.js'

  export default {
    name: 'TextEllipsis',
    props: {
      isHtmlFormat: null, // 外部可以强制告诉我们是否不按 html 格式处理
      // 外部传入 title 指令配置
      titleDirective: Object,
      // 需要显示的内容
      content: String,
      // 行高
      lineHeight: {
        type: Number,
        default: 20
      },
      // 行数
      rows: {
        type: Number,
        default: 2
      },
      // 是否显示查看全部按钮
      showMore: Boolean,
      // 如果展开后还想限制行数，则传入行数
      expandRows: Number, 
      // 禁止处理溢出隐藏
      disabled: Boolean,
      hideTitle: Boolean,
    },
    data() {
      return {
        testText: '持续强调阿米巴经营',
        // 是否溢出
        oversize: false,
        computedReady: false, // 先隐形计算，计算好后，再根据配置显示
			  computedText: '', // 计算后的 text 内容
        isShowAll: false
      }
    },
    computed: {
      ...mapState(['printing']),
      height() {
        // 如果展开后还想限制行数，则返回指定行数的高度
        if (this.isShowAll && this.expandRows) {
          return this.lineHeight * this.expandRows
        }

        return this.lineHeight * this.rows
      },
      wrapStyle() {
        return {
          maxHeight: (this.isShowAll && !this.expandRows) ? '' : `${this.height}px`
        }
      },
      style() {
        return {
          lineHeight: `${this.lineHeight}px`,
          // 是 html 的时候给一个最大高，因为 html 不会去截取，要展示全内容
          maxHeight: this.isHtml ? this.wrapStyle.maxHeight : ''
        }
      },
      contentHtml() {
        if (!this.content) return ''
        
        let content = this.content.replace(/&nbsp;/g, '')
        // 将 div 包裹的内容替换为 br 作为换行，无缘无故前面多了很多 <br>
        content = content.replace(new RegExp('<div>+|<div sel-id="([^"]+)">+|<\/div>+', 'g'), '<br>')
        content = formatHyperLink(content) // 支持链接显示

        return content
      },
      // 内容是否是 html 格式的内容
      isHtml() {
        if (typeof this.isHtmlFormat === 'boolean') return this.isHtmlFormat
        return this.contentHtml.includes('</') && this.contentHtml.includes('<')
      },
      // hover title 指令
      titleDir() {
        if (this.titleDirective) return this.titleDirective // 外部传入指令
        if (this.hideTitle) return ''

        // 显示更多后，如果展开后还想限制行数，则需要显示 title
        const isNeedTitle = this.isShowAll && this.expandRows && this.oversize
        
        // 如果已经显示了更多，或者没溢出，则不用 hover 显示 title
        return (this.showMore && !isNeedTitle || !this.oversize)
          ? null
          : {
            txt: this.content,
            type: 'normal', 
            isHtml: true
          }
      }
    },
    watch: {
      printing: 'init',
      disabled: 'init',
      contentHtml: 'init',
      computedReady(val) {
        this.$emit('computed-ready', val)
      }
    },
    methods: {
      onClickText(event) {
        this.$emit('click-text', event)
      },
      padClick(event) {
        event && event.stopPropagation()
        this.$emit('pad-click', event)
      },
      onClick(event) {
        // a 链接手动触发事件
        if (event.target.nodeName === 'A' && event.target.href) {
          event.preventDefault()
          event.stopPropagation()
          window.open(event.target.href)
        }
      },
      clickMore(val) {
        let { text } = this.$refs

        const isBool = typeof val === 'boolean' // 外部传入的值
        const nextVal = isBool ? val : !this.isShowAll // 下一个展开状态

        if (!this.showMore || // 没配置需要展开收起则不继续
          nextVal && !this.oversize || // 没溢出但是需要展开，也不继续避免问题
          !nextVal && !this.prevContent) return // 如果需要收起，但是之前没点过展开，也不继续

        this.isShowAll = nextVal

        if (this.isShowAll) {
          this.prevContent = text.innerHTML
          text.innerHTML = this.contentHtml

          // 如果展开后，还是希望保留指定行显示，则重新初始化
          if (this.expandRows) {
            this.init()
          }
        } else if (this.prevContent) {
          // 如果是收起的，表示之前肯定溢出了恢复一下，避免配置了 expandRow 后，如果展开后没溢出
          // 则收起后 oversize 是 false 了，也不会溢出了
          this.oversize = true 
          text.innerHTML = this.prevContent
        }

        this.$emit('on-show-more', this)
      },
      init() {
        this._init()
      },
      computeText() {
        this.oversize = false
        this.computedReady = false
        
        // 打印模式恢复后不用继续了
        if (this.printing) return

        this.$nextTick(() => {
          let $text = this.$refs.text
          let $el = this.$refs.el
          let $more = this.$refs.more
          let n = 1000
          let text = this.contentHtml
          let height = this.height

          // 如果当前是 html 格式，则不用当纯文字计算了
          if (this.isHtml) {
            this.oversize = $el && ($el.scrollHeight > $el.offsetHeight)
            this.computedReady = true
            return
          }

          if ($text && $el.offsetHeight > (height + 1)) { // 允许误差 1、2 px
            this.oversize = true
            $more.style.display = 'inline-block'

            while ($el.offsetHeight > height && n > 0) {
              // 文本实际高度比目标高度多几倍高时，可以大胆减半
              if ($el.offsetHeight > height * 3) {
                $text.innerHTML = text = text.substring(
                  0,
                  Math.floor(text.length / 2)
                )
              } else {
                // 如果剩余文本高度接近 height 时，就慢慢减
                $text.innerHTML = text = text.substring(0, text.length - 1)
              }

              n--
            }
          }

          this.computedText = text
          this.limitShow()
        })
      },
      limitShow() {
        this.computedReady = true

        // 如果没有溢出，就不用后面的逻辑了，因为不用再减少文字用来给更多按钮显示位置
        if (!this.oversize) return

        this.$nextTick(() => {
          let $text = this.$refs.text
          let $el = this.$refs.el

          // 如果还有更多按钮，则再减少几个字让更多按钮能放下
          if (this.$refs.moreBtn) {
            let num = Math.ceil(this.$refs.moreBtn.$el.offsetWidth / 14) + 3
            this.computedText = this.computedText.slice(0, this.computedText.length - num)
          }

          if ($text) {
            $text.innerHTML = this.computedText
            if ($el.offsetHeight > this.height) {
              this.$emit('hide')
            } else {
              this.$emit('show')
            }
          }
        })
      }
    },
    mounted() {
      this._init = debounce(() => {
        if (this.disabled) return

        this.computeText()
      }, 150)

      this.oldWidth = this.$refs.el && this.$refs.el.offsetWidth
     
      this.onResize = debounce(() => {
        // 避免高度变化也触发导致一直闪动，这里只有宽度变化才重新 init
        if (this.$refs.el && this.$refs.el.offsetWidth === this.oldWidth) return
        this.oldWidth = this.$refs.el && this.$refs.el.offsetWidth

        this.init()
      }, 150)
      addResizeListener(this.$refs.el, this.onResize)
      this.init()
    },
    beforeDestroy() {
      removeResizeListener(this.$refs.el, this.onResize)
    }
  }
</script>

<style lang="scss">
.z-ellipsis-box {
  overflow: hidden;
}

.z-ellipsis-text {
  white-space: pre-wrap;
}

.z-ellipsis {
  position: relative;
  // 这个必须的，高度被外部 flex 影响会直接导致问题
  align-self: center !important;

  .btn-more {
    &.is-open {
      .after-icon {
        transform: scale(-0.8);
      }
    }
  }

  &.html {
    overflow: hidden;

    p {
      margin: 0 !important;
    }

    .z-ellipsis-more {
      position: absolute;
      width: 26px;
      right: 0;
      padding-right: 2px;
      bottom: 1px;
      text-align: right;
      // background: #fff;
      background: linear-gradient(to right, rgba(255, 255, 255, 0), #fff);
    }
  }
}
</style>
