<template>
  <div class="pretext-demo">
    <p>
      <a
        href="https://www.npmjs.com/package/@chenglou/pretext"
        target="_blank"
        rel="noopener noreferrer">
        @chenglou/pretext
      </a>
      用 canvas 测量文本，<code>layout</code> 为纯算术换行，避免依赖 DOM 测量引发回流。
    </p>

    <div class="block">
      <p><strong>示例文案</strong>（含中英文与 emoji，与 README 类似）</p>
      <el-input
        v-model="sampleText"
        type="textarea"
        :rows="4"
        placeholder="输入多行文本"/>
    </div>

    <div class="block">
      <p><strong>布局参数</strong></p>
      <p>
        最大宽度 {{ maxWidth }}px
        <el-slider
          v-model="maxWidth"
          :min="120"
          :max="640"
          :show-tooltip="false"/>
      </p>
      <p>当前字体（来自 CSS）：<code>{{ fontCss }}</code></p>
      <p>当前行高（来自 CSS）：<code>{{ cssLineHeight }}px</code></p>
    </div>

    <div class="block">
      <p><strong>prepare + layout（无 DOM 测量高度）</strong></p>
      <p v-if="measure">
        总行数：<code>{{ measure.lineCount }}</code>，
        总高度：<code>{{ measure.height.toFixed(2) }}</code> px
      </p>
    </div>

    <div class="block">
      <p><strong>prepareWithSegments + layoutWithLines（逐行排版预览）</strong></p>
      <p class="hint">测量参数从 CSS 自动读取，便于对比实际渲染。</p>
      <div ref="styleProbe" class="style-probe">style probe</div>
      <div
        v-if="lines"
        class="line-preview"
        :style="previewBoxStyle">
        <div
          v-for="(line, i) in lines.lines"
          :key="i"
          class="line-preview__row"
          :style="lineRowStyle">
          {{ line.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    // 预处理文本（轻量结果，给 layout 用）
    prepare,
    // 预处理文本（包含 segments 细节，给 layoutWithLines 用）
    prepareWithSegments,
    // 计算总行数和总高度
    layout,
    // 计算总行数/总高度，并返回每一行内容
    layoutWithLines
  } from '@chenglou/pretext'

  export default {
    name: 'PretextDemo',
    data() {
      return {
        sampleText:
          'AGI 春天到了. بدأت الرحلة 🚀 Pretext measures paragraphs without DOM reflow.',
        maxWidth: 320,
        fontCss: '',
        cssLineHeight: 24,
        prepared: null,
        preparedSeg: null
      }
    },
    computed: {
      measure() {
        if (!this.prepared) {
          return null
        }
        return layout(this.prepared, this.maxWidth, this.cssLineHeight)
      },
      lines() {
        if (!this.preparedSeg) {
          return null
        }
        return layoutWithLines(
          this.preparedSeg,
          this.maxWidth,
          this.cssLineHeight
        )
      },
      previewBoxStyle() {
        return {
          width: `${this.maxWidth}px`,
          font: this.fontCss,
          lineHeight: `${this.cssLineHeight}px`
        }
      },
      lineRowStyle() {
        return {
          minHeight: `${this.cssLineHeight}px`,
          lineHeight: `${this.cssLineHeight}px`
        }
      }
    },
    mounted() {
      this.refreshTextMetrics()
    },
    watch: {
      sampleText: {
        immediate: true,
        handler(val) {
          if (!this.fontCss) {
            return
          }
          const text = val == null ? '' : String(val)
          this.prepared = prepare(text, this.fontCss)
          this.preparedSeg = prepareWithSegments(text, this.fontCss)
        }
      }
    },
    methods: {
      refreshTextMetrics() {
        this.$nextTick(() => {
          const probe = this.$refs.styleProbe
          if (!probe) {
            return
          }
          const styles = window.getComputedStyle(probe)
          this.fontCss = styles.font
          const pxLineHeight = parseFloat(styles.lineHeight)
          const pxFontSize = parseFloat(styles.fontSize)
          this.cssLineHeight = Number.isNaN(pxLineHeight)
            ? Math.round((Number.isNaN(pxFontSize) ? 16 : pxFontSize) * 1.2)
            : pxLineHeight

          const text = this.sampleText == null ? '' : String(this.sampleText)
          this.prepared = prepare(text, this.fontCss)
          this.preparedSeg = prepareWithSegments(text, this.fontCss)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pretext-demo {
    code {
      padding: 0 4px;
      background: #f5f5f5;
      border-radius: 2px;
      font-size: 13px;
    }
  }

  .hint {
    color: #666;
    font-size: 13px;
    margin-top: 0;
  }

  .line-preview {
    border: 1px solid #ccc;
    padding: 8px;
    background: #fafafa;
    box-sizing: content-box;
    overflow-wrap: normal;
    word-break: normal;
    font-size: 16px;
    line-height: 24px;
    font-family: Arial, sans-serif;
  }

  .line-preview__row {
    white-space: pre;
    overflow-wrap: normal;
    word-break: normal;
  }

  .style-probe {
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    font-size: 16px;
    line-height: 24px;
    font-family: Arial, sans-serif;
  }
</style>
