<template>
  <div class="demo-page">
    <h1 class="demo-page__title">Input 输入框</h1>
    <p class="demo-page__desc">通过鼠标或键盘输入字符。</p>

    <!-- 基础用法 -->
    <section class="demo-block">
      <h2>基础用法</h2>
      <div class="demo-block__body" style="max-width: 400px">
        <ui-input v-model="input1" placeholder="请输入内容" />
      </div>
      <p class="demo-block__result">输入内容：{{ input1 }}</p>
    </section>

    <!-- 禁用状态 -->
    <section class="demo-block">
      <h2>禁用状态</h2>
      <div class="demo-block__body" style="max-width: 400px">
        <ui-input v-model="input2" disabled placeholder="禁用状态" />
      </div>
    </section>

    <!-- 可清空 -->
    <section class="demo-block">
      <h2>可清空</h2>
      <div class="demo-block__body" style="max-width: 400px">
        <ui-input v-model="input3" clearable placeholder="可清空的输入框" />
      </div>
    </section>

    <!-- 不同尺寸 -->
    <section class="demo-block">
      <h2>不同尺寸</h2>
      <div class="demo-block__body" style="max-width: 400px; flex-direction: column; align-items: stretch">
        <ui-input v-model="input4" size="small" placeholder="小尺寸" />
        <ui-input v-model="input5" placeholder="默认尺寸" />
        <ui-input v-model="input6" size="large" placeholder="大尺寸" />
      </div>
    </section>

    <!-- 错误提示 -->
    <section class="demo-block">
      <h2>错误提示</h2>
      <div class="demo-block__body" style="max-width: 400px">
        <ui-input v-model="input7" error-msg="请输入有效的邮箱地址" placeholder="请输入邮箱" />
      </div>
    </section>

    <!-- 前后缀插槽 -->
    <section class="demo-block">
      <h2>前后缀插槽</h2>
      <div class="demo-block__body" style="max-width: 400px; flex-direction: column; align-items: stretch">
        <ui-input v-model="input8" placeholder="请输入网址">
          <template #prefix>🌐</template>
        </ui-input>
        <ui-input v-model="input9" placeholder="请输入域名">
          <template #suffix>.com</template>
        </ui-input>
      </div>
    </section>

    <!-- API 表格 -->
    <section class="demo-block">
      <h2>Props</h2>
      <table class="api-table">
        <thead>
          <tr><th>参数</th><th>说明</th><th>类型</th><th>默认值</th></tr>
        </thead>
        <tbody>
          <tr><td>modelValue</td><td>绑定值</td><td>string / number</td><td>—</td></tr>
          <tr><td>type</td><td>类型</td><td>string</td><td>text</td></tr>
          <tr><td>placeholder</td><td>占位文本</td><td>string</td><td>请输入</td></tr>
          <tr><td>size</td><td>尺寸</td><td>string</td><td>medium</td></tr>
          <tr><td>disabled</td><td>是否禁用</td><td>boolean</td><td>false</td></tr>
          <tr><td>readonly</td><td>是否只读</td><td>boolean</td><td>false</td></tr>
          <tr><td>clearable</td><td>是否可清空</td><td>boolean</td><td>false</td></tr>
          <tr><td>maxlength</td><td>最大输入长度</td><td>number</td><td>—</td></tr>
          <tr><td>errorMsg</td><td>错误提示信息</td><td>string</td><td>—</td></tr>
        </tbody>
      </table>

      <h2 style="margin-top: 24px">Slots</h2>
      <table class="api-table">
        <thead>
          <tr><th>插槽名</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>prefix</td><td>输入框头部内容</td></tr>
          <tr><td>suffix</td><td>输入框尾部内容</td></tr>
        </tbody>
      </table>

      <h2 style="margin-top: 24px">Events</h2>
      <table class="api-table">
        <thead>
          <tr><th>事件名</th><th>说明</th><th>回调参数</th></tr>
        </thead>
        <tbody>
          <tr><td>update:modelValue</td><td>绑定值更新</td><td>value: string</td></tr>
          <tr><td>input</td><td>输入时触发</td><td>value: string</td></tr>
          <tr><td>focus</td><td>获得焦点</td><td>event: FocusEvent</td></tr>
          <tr><td>blur</td><td>失去焦点</td><td>event: FocusEvent</td></tr>
          <tr><td>enter</td><td>按下回车</td><td>event: KeyboardEvent</td></tr>
          <tr><td>clear</td><td>点击清除按钮</td><td>—</td></tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const input1 = ref('')
const input2 = ref('')
const input3 = ref('')
const input4 = ref('')
const input5 = ref('')
const input6 = ref('')
const input7 = ref('')
const input8 = ref('')
const input9 = ref('')
</script>

<style scoped lang="scss">
@use "../styles/variables" as *;

.demo-page {
  max-width: 860px;

  &__title {
    font-size: 26px;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 8px;
  }

  &__desc {
    color: $text-secondary;
    font-size: $font-size-base;
    margin-bottom: 32px;
    line-height: 1.6;
  }
}

.demo-block {
  margin-bottom: 28px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8px;
    padding-left: 10px;
    border-left: 3px solid $primary-color;
  }

  &__body {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    padding: 20px;
    background: #fafbfc;
    border: 1px solid $border-color-lighter;
    border-radius: 8px;
  }

  &__result {
    margin-top: 10px;
    font-size: 13px;
    color: $text-secondary;
  }
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 10px;

  th, td {
    padding: 10px 14px;
    text-align: left;
    border-bottom: 1px solid $border-color-lighter;
  }

  th {
    background: #f8f9fc;
    color: $text-primary;
    font-weight: 600;
    white-space: nowrap;
  }

  td {
    color: $text-regular;
    &:nth-child(1) {
      color: $danger-color;
      font-family: Consolas, monospace;
    }
  }
}
</style>
