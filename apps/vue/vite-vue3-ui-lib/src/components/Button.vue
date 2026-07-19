<template>
  <button
    class="ui-button"
    :class="[
      `ui-button--${type}`,
      `ui-button--${size}`,
      {
        'is-disabled': disabled,
        'is-loading': loading,
        'is-round': round,
        'is-plain': plain,
      },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="ui-button__loading">⟳</span>
    <span v-if="$slots.icon && !loading" class="ui-button__icon">
      <slot name="icon"></slot>
    </span>
    <span class="ui-button__text">
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
defineOptions({ name: 'UiButton' })

withDefaults(defineProps<{
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  round?: boolean
  plain?: boolean
}>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  loading: false,
  round: false,
  plain: false,
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

function handleClick(e: MouseEvent): void {
  emit('click', e)
}
</script>

<style scoped lang="scss">
@use 'sass:color';
@use "../styles/variables" as *;

.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  font-size: $font-size-base;
  font-weight: 500;
  line-height: 1;
  border: 1px solid $border-color-base;
  border-radius: $border-radius-base;
  background: $bg-color;
  color: $text-primary;
  cursor: pointer;
  user-select: none;
  outline: none;
  transition: all $transition-duration;
  white-space: nowrap;

  &:hover {
    color: $primary-color;
    border-color: $primary-color;
  }

  &:active {
    color: color.adjust($primary-color, $lightness: -10%);
    border-color: color.adjust($primary-color, $lightness: -10%);
  }

  // 尺寸
  &--small {
    padding: 6px 12px;
    font-size: $font-size-small;
  }

  &--large {
    padding: 14px 28px;
    font-size: $font-size-large;
  }

  // 类型
  &--primary {
    background: $primary-color;
    border-color: $primary-color;
    color: #fff;
    &:hover {
      background: color.adjust($primary-color, $lightness: 8%);
      border-color: color.adjust($primary-color, $lightness: 8%);
    }
    &:active {
      background: color.adjust($primary-color, $lightness: -8%);
      border-color: color.adjust($primary-color, $lightness: -8%);
    }
  }

  &--success {
    background: $success-color;
    border-color: $success-color;
    color: #fff;
    &:hover {
      background: color.adjust($success-color, $lightness: 8%);
      border-color: color.adjust($success-color, $lightness: 8%);
    }
    &:active {
      background: color.adjust($success-color, $lightness: -8%);
      border-color: color.adjust($success-color, $lightness: -8%);
    }
  }

  &--warning {
    background: $warning-color;
    border-color: $warning-color;
    color: #fff;
    &:hover {
      background: color.adjust($warning-color, $lightness: 8%);
      border-color: color.adjust($warning-color, $lightness: 8%);
    }
    &:active {
      background: color.adjust($warning-color, $lightness: -8%);
      border-color: color.adjust($warning-color, $lightness: -8%);
    }
  }

  &--danger {
    background: $danger-color;
    border-color: $danger-color;
    color: #fff;
    &:hover {
      background: color.adjust($danger-color, $lightness: 8%);
      border-color: color.adjust($danger-color, $lightness: 8%);
    }
    &:active {
      background: color.adjust($danger-color, $lightness: -8%);
      border-color: color.adjust($danger-color, $lightness: -8%);
    }
  }

  &--info {
    background: $info-color;
    border-color: $info-color;
    color: #fff;
    &:hover {
      background: color.adjust($info-color, $lightness: 8%);
      border-color: color.adjust($info-color, $lightness: 8%);
    }
    &:active {
      background: color.adjust($info-color, $lightness: -8%);
      border-color: color.adjust($info-color, $lightness: -8%);
    }
  }

  // 朴素按钮
  &.is-plain {
    background: transparent;
    &--primary {
      color: $primary-color;
      border-color: $primary-color;
      &:hover {
        background: $primary-color;
        color: #fff;
      }
    }
    &--success {
      color: $success-color;
      border-color: $success-color;
      &:hover {
        background: $success-color;
        color: #fff;
      }
    }
    &--warning {
      color: $warning-color;
      border-color: $warning-color;
      &:hover {
        background: $warning-color;
        color: #fff;
      }
    }
    &--danger {
      color: $danger-color;
      border-color: $danger-color;
      &:hover {
        background: $danger-color;
        color: #fff;
      }
    }
    &--info {
      color: $info-color;
      border-color: $info-color;
      &:hover {
        background: $info-color;
        color: #fff;
      }
    }
  }

  // 圆角
  &.is-round {
    border-radius: $border-radius-round;
  }

  // 禁用
  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  // 加载中
  &.is-loading {
    cursor: wait;
  }
}

.ui-button__loading {
  display: inline-block;
  animation: ui-spin 1s linear infinite;
}

@keyframes ui-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
