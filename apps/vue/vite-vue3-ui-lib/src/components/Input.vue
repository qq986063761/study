<template>
  <div
    class="ui-input"
    :class="[
      `ui-input--${size}`,
      {
        'is-disabled': disabled,
        'is-focus': isFocused,
        'is-error': !!errorMsg,
      },
    ]"
  >
    <div class="ui-input__wrapper">
      <span v-if="$slots.prefix" class="ui-input__prefix">
        <slot name="prefix"></slot>
      </span>
      <input
        ref="inputRef"
        class="ui-input__inner"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleEnter"
      />
      <span
        v-if="clearable && modelValue && !disabled"
        class="ui-input__clear"
        @click="handleClear"
      >✕</span>
      <span v-if="$slots.suffix" class="ui-input__suffix">
        <slot name="suffix"></slot>
      </span>
    </div>
    <p v-if="errorMsg" class="ui-input__error">{{ errorMsg }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'UiInput' })

withDefaults(defineProps<{
  modelValue?: string | number
  type?: string
  placeholder?: string
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  maxlength?: number
  errorMsg?: string
}>(), {
  modelValue: '',
  type: 'text',
  placeholder: '请输入',
  size: 'medium',
  disabled: false,
  readonly: false,
  clearable: false,
  errorMsg: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [value: string]
  focus: [e: FocusEvent]
  blur: [e: FocusEvent]
  enter: [e: KeyboardEvent]
  clear: []
}>()

const isFocused = ref(false)
const inputRef = ref<HTMLInputElement>()

function handleInput(e: Event): void {
  const target = e.target as HTMLInputElement
  emit('input', target.value)
  emit('update:modelValue', target.value)
}

function handleFocus(e: FocusEvent): void {
  isFocused.value = true
  emit('focus', e)
}

function handleBlur(e: FocusEvent): void {
  isFocused.value = false
  emit('blur', e)
}

function handleEnter(e: KeyboardEvent): void {
  emit('enter', e)
}

function handleClear(): void {
  emit('input', '')
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

function focus(): void {
  inputRef.value?.focus()
}

function blur(): void {
  inputRef.value?.blur()
}

defineExpose({ focus, blur })
</script>

<style scoped lang="scss">
@use "../styles/variables" as *;

.ui-input {
  display: inline-block;
  width: 100%;

  &--small {
    .ui-input__inner {
      padding: 6px 10px;
      font-size: $font-size-small;
    }
  }

  &--large {
    .ui-input__inner {
      padding: 14px 18px;
      font-size: $font-size-large;
    }
  }
}

.ui-input__wrapper {
  display: flex;
  align-items: center;
  border: 1px solid $border-color-base;
  border-radius: $border-radius-base;
  background: $bg-color;
  transition: border-color $transition-duration;
  overflow: hidden;

  .is-focus & {
    border-color: $primary-color;
  }

  .is-error & {
    border-color: $danger-color;
  }

  .is-disabled & {
    background: $bg-color-light;
    cursor: not-allowed;
  }
}

.ui-input__prefix,
.ui-input__suffix {
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: $text-secondary;
}

.ui-input__inner {
  flex: 1;
  padding: 10px 14px;
  font-size: $font-size-base;
  color: $text-primary;
  background: transparent;
  border: none;
  outline: none;
  width: 100%;

  &::placeholder {
    color: $text-placeholder;
  }

  &:disabled {
    color: $text-secondary;
    cursor: not-allowed;
  }
}

.ui-input__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 50%;
  background: $text-placeholder;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  transition: background $transition-duration;

  &:hover {
    background: $text-secondary;
  }
}

.ui-input__error {
  margin-top: 4px;
  font-size: $font-size-extra-small;
  color: $danger-color;
  line-height: 1.4;
}
</style>
