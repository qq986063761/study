<template>
  <div class="overview">
    <h1 class="overview__title">UI 组件库</h1>
    <p class="overview__desc">
      基于 Vue 3 + TypeScript + Vite 的前端 UI 组件库，提供按钮、输入框、对话框等基础组件。
    </p>

    <div class="overview__stats">
      <div class="stat-card">
        <span class="stat-card__num">{{ componentCount }}</span>
        <span class="stat-card__label">组件数量</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__num">Vue 3</span>
        <span class="stat-card__label">框架版本</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__num">TS</span>
        <span class="stat-card__label">类型支持</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__num">SCSS</span>
        <span class="stat-card__label">样式方案</span>
      </div>
    </div>

    <div class="overview__quick-start">
      <h2>快速开始</h2>
      <pre class="code-block"><code>// 全量引入
import UiLib from "vite-vue3-ui-lib";
app.use(UiLib);

// 按需引入
import { UiButton, UiInput } from "vite-vue3-ui-lib";
app.component("UiButton", UiButton);</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const componentCount = 4
</script>

<style scoped lang="scss">
@use "../styles/variables" as *;

.overview {
  max-width: 800px;
}

.overview__title {
  font-size: 26px;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 12px;
}

.overview__desc {
  font-size: $font-size-base;
  color: $text-secondary;
  line-height: 1.8;
  margin-bottom: 32px;
}

.overview__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 36px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 12px;
  background: #f8f9fc;
  border-radius: 10px;
  border: 1px solid $border-color-lighter;

  &__num {
    font-size: 22px;
    font-weight: 700;
    color: $primary-color;
  }

  &__label {
    margin-top: 6px;
    font-size: $font-size-extra-small;
    color: $text-secondary;
  }
}

.overview__quick-start {
  h2 {
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 12px;
    padding-left: 10px;
    border-left: 3px solid $primary-color;
  }
}

.code-block {
  padding: 16px 20px;
  background: #1d1e2c;
  color: #a6accd;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.8;
  overflow-x: auto;

  code {
    font-family: "Fira Code", "Cascadia Code", Consolas, monospace;
  }
}
</style>
