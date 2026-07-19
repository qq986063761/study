<template>
  <transition name="ui-dialog-fade">
    <div
      v-if="visible"
      class="ui-dialog-overlay"
      @click.self="handleOverlayClick"
    >
      <div
        class="ui-dialog"
        :class="{ 'is-fullscreen': fullscreen }"
        :style="{ width: fullscreen ? '100%' : width }"
      >
        <!-- 头部 -->
        <div class="ui-dialog__header">
          <h3 class="ui-dialog__title">
            <slot name="title">{{ title }}</slot>
          </h3>
          <button
            v-if="showClose"
            class="ui-dialog__close"
            @click="handleClose"
          >
            ✕
          </button>
        </div>

        <!-- 内容 -->
        <div class="ui-dialog__body">
          <slot></slot>
        </div>

        <!-- 底部 -->
        <div v-if="$slots.footer" class="ui-dialog__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineOptions({ name: 'UiDialog' })

withDefaults(defineProps<{
  visible?: boolean
  title?: string
  width?: string
  showClose?: boolean
  closeOnClickOverlay?: boolean
  fullscreen?: boolean
}>(), {
  visible: false,
  title: '提示',
  width: '480px',
  showClose: true,
  closeOnClickOverlay: true,
  fullscreen: false,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

function handleClose(): void {
  emit('update:visible', false)
  emit('close')
}

function handleOverlayClick(): void {
  emit('update:visible', false)
  emit('close')
}
</script>

<style scoped lang="scss">
@use "../styles/variables" as *;

.ui-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.ui-dialog {
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  background: $bg-color;
  border-radius: $border-radius-base;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  &.is-fullscreen {
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
}

.ui-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid $border-color-lighter;
  flex-shrink: 0;
}

.ui-dialog__title {
  font-size: $font-size-medium;
  font-weight: 600;
  color: $text-primary;
  margin: 0;
}

.ui-dialog__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: $text-secondary;
  font-size: 16px;
  cursor: pointer;
  transition: all $transition-duration;
  flex-shrink: 0;

  &:hover {
    background: $bg-color-light;
    color: $text-primary;
  }
}

.ui-dialog__body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  color: $text-regular;
  font-size: $font-size-base;
  line-height: 1.6;
}

.ui-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 20px;
  border-top: 1px solid $border-color-lighter;
  flex-shrink: 0;
}

// 过渡动画
.ui-dialog-fade-enter-active,
.ui-dialog-fade-leave-active {
  transition: opacity $transition-duration;
  .ui-dialog {
    transition: transform $transition-duration;
  }
}

.ui-dialog-fade-enter-from,
.ui-dialog-fade-leave-to {
  opacity: 0;
  .ui-dialog {
    transform: scale(0.9) translateY(-20px);
  }
}
</style>
