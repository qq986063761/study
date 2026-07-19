<template>
  <!-- Build mode：供 CLI 抓取布局 -->
  <div
    v-if="buildMode"
    ref="containerRef"
    style="position:relative;"
    :data-boneyard="name"
    :data-boneyard-config="serializedSnapshotConfig">
    <div>
      <slot name="fixture">
        <slot />
      </slot>
    </div>
  </div>

  <div
    v-else
    ref="containerRef"
    style="position:relative;"
    :data-boneyard="name"
    :data-boneyard-config="serializedSnapshotConfig">
    <div data-boneyard-content="true" :style="{ visibility: showSkeleton ? 'hidden' : undefined }">
      <template v-if="showFallback">
        <slot name="fallback" />
      </template>
      <template v-else>
        <slot />
      </template>
    </div>

    <div
      v-if="showSkeleton && activeBones"
      data-boneyard-overlay="true"
      style="position:absolute;inset:0;overflow:hidden;">
      <div style="position:relative;width:100%;height:100%;">
        <div
          v-for="(bone, i) in activeBones.bones"
          :key="`${i}-${boneKey(bone)}`"
          data-boneyard-bone="true"
          :style="getBoneStyle(bone, scaleY, resolvedColor, isDark)">
          <div
            v-if="animationStyle !== 'solid'"
            :style="getOverlayStyle(resolvedColor, isDark, animationStyle)" />
        </div>

        <component v-if="animationStyle === 'pulse'" :is="'style'">
          @keyframes bp-{{ uid }}{0%,100%{opacity:0}50%{opacity:1}}
        </component>
        <component v-if="animationStyle === 'shimmer'" :is="'style'">
          @keyframes bs-{{ uid }}{0%{background-position:200% 0}100%{background-position:-200% 0}}
        </component>
      </div>
    </div>
  </div>
</template>

<script>
import { normalizeBone } from 'boneyard-types'
import {
  adjustColor,
  ensureBuildSnapshotHook,
  getRegisteredBones,
  isBuildMode,
  resolveResponsive
} from 'boneyard-shared'

export default {
  name: 'BoneyardSkeleton',
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    name: {
      type: String,
      default: undefined
    },
    initialBones: {
      type: Object,
      default: undefined
    },
    color: {
      type: String,
      default: undefined
    },
    darkColor: {
      type: String,
      default: undefined
    },
    animate: {
      type: [String, Boolean],
      default: 'pulse'
    },
    snapshotConfig: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      uid: Math.random().toString(36).slice(2, 8),
      containerWidth: 0,
      containerHeight: 0,
      isDark: false
    }
  },
  computed: {
    buildMode() {
      return isBuildMode()
    },
    rawAnimate() {
      const a = this.animate
      return a !== undefined && a !== null ? a : 'pulse'
    },
    animationStyle() {
      const v = this.rawAnimate
      if (v === true) return 'pulse'
      if (v === false) return 'solid'
      return v
    },
    resolvedColor() {
      return this.isDark
        ? (this.darkColor || 'rgba(255,255,255,0.06)')
        : (this.color || 'rgba(0,0,0,0.08)')
    },
    serializedSnapshotConfig() {
      return this.snapshotConfig ? JSON.stringify(this.snapshotConfig) : undefined
    },
    effectiveBones() {
      return this.initialBones || (this.name ? getRegisteredBones(this.name) : undefined)
    },
    viewportWidth() {
      return typeof window !== 'undefined' ? window.innerWidth : this.containerWidth
    },
    activeBones() {
      const eb = this.effectiveBones
      if (!eb || this.containerWidth <= 0) return null
      return resolveResponsive(eb, this.viewportWidth)
    },
    showSkeleton() {
      return this.loading && !!this.activeBones
    },
    showFallback() {
      return this.loading && !this.activeBones
    },
    effectiveHeight() {
      return this.containerHeight > 0
        ? this.containerHeight
        : (this.activeBones && this.activeBones.height) || 0
    },
    capturedHeight() {
      return (this.activeBones && this.activeBones.height) || 0
    },
    scaleY() {
      const eh = this.effectiveHeight
      const ch = this.capturedHeight
      return eh > 0 && ch > 0 ? eh / ch : 1
    }
  },
  watch: {
    loading() {
      this.$nextTick(this.syncSize)
    }
  },
  created() {
    ensureBuildSnapshotHook()
  },
  mounted() {
    this.updateDarkMode()

    this._mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null
    this._mqHandler = () => this.updateDarkMode()
    if (this._mq && this._mqHandler) {
      this._mq.addEventListener('change', this._mqHandler)
    }

    this._mutationObserver =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => this.updateDarkMode())
        : null
    if (this._mutationObserver) {
      this._mutationObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      })
    }

    this._resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(entries => {
            const rect = entries[0] && entries[0].contentRect
            this.containerWidth = Math.round((rect && rect.width) || 0)
            if (rect && rect.height > 0) {
              this.containerHeight = Math.round(rect.height)
            }
          })
        : null
    this.$nextTick(() => {
      this.syncSize()
      if (this._resizeObserver && this.$refs.containerRef) {
        this._resizeObserver.observe(this.$refs.containerRef)
      }
    })
  },
  beforeDestroy() {
    if (this._mq && this._mqHandler) {
      this._mq.removeEventListener('change', this._mqHandler)
    }
    if (this._mutationObserver) {
      this._mutationObserver.disconnect()
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect()
    }
  },
  methods: {
    boneKey(bone) {
      const b = bone
      return b.x != null ? b.x : (Array.isArray(bone) ? bone[0] : '')
    },
    syncSize() {
      const el = this.$refs.containerRef
      if (!el || typeof el.getBoundingClientRect !== 'function') return
      const rect = el.getBoundingClientRect()
      this.containerWidth = Math.round(rect.width)
      if (rect.height > 0) {
        this.containerHeight = Math.round(rect.height)
      }
    },
    updateDarkMode() {
      if (typeof window === 'undefined') return
      try {
        const el = this.$refs.containerRef
        this.isDark =
          document.documentElement.classList.contains('dark') ||
          !!(el && el.closest && el.closest('.dark'))
      } catch (e) {
        this.isDark = false
      }
    },
    sanitizeRadius(r) {
      if (typeof r === 'number') return `${r}px`
      if (
        /^[0-9.]+(%|px|em|rem)?(\s+[0-9.]+(%|px|em|rem)?)*(\s*\/\s*[0-9.]+(%|px|em|rem)?(\s+[0-9.]+(%|px|em|rem)?)*)?$/.test(
          r
        )
      ) {
        return r
      }
      return '0px'
    },
    getBoneStyle(raw, scale, color, dark) {
      const bone = normalizeBone(raw)
      const radius = this.sanitizeRadius(bone.r)
      const boneColor = bone.c ? adjustColor(color, dark ? 0.03 : 0.45) : color
      return `position:absolute;left:${bone.x}%;top:${bone.y * scale}px;width:${bone.w}%;height:${bone.h * scale}px;border-radius:${radius};background-color:${boneColor};overflow:hidden;`
    },
    getOverlayStyle(color, dark, anim) {
      if (anim === 'solid') return ''
      const lighterColor = adjustColor(color, dark ? 0.04 : 0.3)
      if (anim === 'pulse') {
        return `position:absolute;inset:0;background-color:${lighterColor};animation:bp-${this.uid} 1.8s ease-in-out infinite;`
      }
      if (anim === 'shimmer') {
        return `position:absolute;inset:0;background:linear-gradient(90deg, transparent 30%, ${lighterColor} 50%, transparent 70%);background-size:200% 100%;animation:bs-${this.uid} 2.4s linear infinite;`
      }
      return ''
    }
  }
}
</script>
