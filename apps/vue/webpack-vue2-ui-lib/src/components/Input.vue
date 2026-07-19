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
        ref="input"
        class="ui-input__inner"
        :type="type"
        :value="value"
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
        v-if="clearable && value && !disabled"
        class="ui-input__clear"
        @click="handleClear"
        >✕</span
      >
      <span v-if="$slots.suffix" class="ui-input__suffix">
        <slot name="suffix"></slot>
      </span>
    </div>
    <p v-if="errorMsg" class="ui-input__error">{{ errorMsg }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class UiInput extends Vue {
  @Prop({ default: "" }) readonly value!: string | number;
  @Prop({ default: "text" }) readonly type!: string;
  @Prop({ default: "请输入" }) readonly placeholder!: string;
  @Prop({ default: "medium" }) readonly size!: "small" | "medium" | "large";
  @Prop({ default: false }) readonly disabled!: boolean;
  @Prop({ default: false }) readonly readonly!: boolean;
  @Prop({ default: false }) readonly clearable!: boolean;
  @Prop() readonly maxlength!: number;
  @Prop({ default: "" }) readonly errorMsg!: string;

  isFocused = false;

  handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.$emit("input", target.value);
    this.$emit("update:value", target.value);
  }

  handleFocus(e: FocusEvent): void {
    this.isFocused = true;
    this.$emit("focus", e);
  }

  handleBlur(e: FocusEvent): void {
    this.isFocused = false;
    this.$emit("blur", e);
  }

  handleEnter(e: KeyboardEvent): void {
    this.$emit("enter", e);
  }

  handleClear(): void {
    this.$emit("input", "");
    this.$emit("update:value", "");
    this.$emit("clear");
    (this.$refs.input as HTMLInputElement)?.focus();
  }

  focus(): void {
    (this.$refs.input as HTMLInputElement)?.focus();
  }

  blur(): void {
    (this.$refs.input as HTMLInputElement)?.blur();
  }
}
</script>

<style scoped lang="scss">
@import "../styles/variables";

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
