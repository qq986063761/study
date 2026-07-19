<template>
  <div class="demo-page">
    <h1 class="demo-page__title">Input 输入框</h1>
    <p class="demo-page__desc">通过鼠标或键盘输入字符。</p>

    <!-- 基础用法 -->
    <section class="demo-block">
      <h2>基础用法</h2>
      <p class="demo-block__tip">使用 <code>v-model</code> 双向绑定输入值。</p>
      <div class="demo-block__body demo-block__body--col">
        <ui-input v-model="input1" placeholder="请输入内容" />
        <p class="output-text">输入值: {{ input1 || "(空)" }}</p>
      </div>
    </section>

    <!-- 可清空 -->
    <section class="demo-block">
      <h2>可清空</h2>
      <p class="demo-block__tip">
        设置 <code>clearable</code> 属性在输入值后显示清除按钮。
      </p>
      <div class="demo-block__body demo-block__body--col">
        <ui-input v-model="input2" placeholder="可清空输入框" clearable />
        <p class="output-text">输入值: {{ input2 || "(空)" }}</p>
      </div>
    </section>

    <!-- 禁用 & 只读 -->
    <section class="demo-block">
      <h2>禁用与只读</h2>
      <div class="demo-block__body demo-block__body--col">
        <ui-input v-model="input3" placeholder="禁用状态" disabled />
        <ui-input
          v-model="input4"
          placeholder="只读状态"
          readonly
          style="margin-top: 12px"
        />
      </div>
    </section>

    <!-- 错误状态 -->
    <section class="demo-block">
      <h2>错误提示</h2>
      <p class="demo-block__tip">使用 <code>error-msg</code> 显示错误信息。</p>
      <div class="demo-block__body demo-block__body--col">
        <ui-input
          v-model="input5"
          placeholder="邮箱地址"
          error-msg="请输入正确的邮箱地址"
        />
      </div>
    </section>

    <!-- 不同尺寸 -->
    <section class="demo-block">
      <h2>不同尺寸</h2>
      <div class="demo-block__body demo-block__body--col">
        <ui-input v-model="input6" size="small" placeholder="小尺寸" />
        <ui-input
          v-model="input7"
          placeholder="默认尺寸"
          style="margin-top: 12px"
        />
        <ui-input
          v-model="input8"
          size="large"
          placeholder="大尺寸"
          style="margin-top: 12px"
        />
      </div>
    </section>

    <!-- 前缀 & 后缀 -->
    <section class="demo-block">
      <h2>前缀与后缀</h2>
      <p class="demo-block__tip">
        通过 <code>prefix</code> 和 <code>suffix</code> 插槽添加前后内容。
      </p>
      <div class="demo-block__body demo-block__body--col">
        <ui-input v-model="input9" placeholder="用户名">
          <template #prefix>👤</template>
        </ui-input>
        <ui-input
          v-model="input10"
          placeholder="搜索"
          clearable
          style="margin-top: 12px"
        >
          <template #prefix>🔍</template>
          <template #suffix>
            <span style="font-size: 12px; color: #909399">⌘K</span>
          </template>
        </ui-input>
      </div>
    </section>

    <!-- API 表格 -->
    <section class="demo-block">
      <h2>Props</h2>
      <table class="api-table">
        <thead>
          <tr>
            <th>参数</th>
            <th>说明</th>
            <th>类型</th>
            <th>默认值</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>value / v-model</td>
            <td>绑定值</td>
            <td>string | number</td>
            <td>—</td>
          </tr>
          <tr>
            <td>type</td>
            <td>原生 input type</td>
            <td>string</td>
            <td>text</td>
          </tr>
          <tr>
            <td>placeholder</td>
            <td>占位文本</td>
            <td>string</td>
            <td>请输入</td>
          </tr>
          <tr>
            <td>size</td>
            <td>尺寸</td>
            <td>string</td>
            <td>medium</td>
          </tr>
          <tr>
            <td>disabled</td>
            <td>是否禁用</td>
            <td>boolean</td>
            <td>false</td>
          </tr>
          <tr>
            <td>readonly</td>
            <td>是否只读</td>
            <td>boolean</td>
            <td>false</td>
          </tr>
          <tr>
            <td>clearable</td>
            <td>是否可清空</td>
            <td>boolean</td>
            <td>false</td>
          </tr>
          <tr>
            <td>maxlength</td>
            <td>最大输入长度</td>
            <td>number</td>
            <td>—</td>
          </tr>
          <tr>
            <td>errorMsg</td>
            <td>错误信息</td>
            <td>string</td>
            <td>—</td>
          </tr>
        </tbody>
      </table>

      <h2 style="margin-top: 24px">Slots</h2>
      <table class="api-table">
        <thead>
          <tr>
            <th>插槽名</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>prefix</td>
            <td>输入框前缀</td>
          </tr>
          <tr>
            <td>suffix</td>
            <td>输入框后缀</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class InputDemo extends Vue {
  input1 = "";
  input2 = "";
  input3 = "不可编辑";
  input4 = "只读内容";
  input5 = "";
  input6 = "";
  input7 = "";
  input8 = "";
  input9 = "";
  input10 = "";
}
</script>

<style scoped lang="scss">
@import "../styles/variables";

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

  &__tip {
    margin-bottom: 14px;
    font-size: 13px;
    color: $text-secondary;
    code {
      color: $danger-color;
      background: #fdf6ec;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 12px;
    }
  }

  &__body {
    padding: 20px;
    background: #fafbfc;
    border: 1px solid $border-color-lighter;
    border-radius: 8px;

    &--col {
      display: flex;
      flex-direction: column;
      max-width: 480px;
    }
  }
}

.output-text {
  margin-top: 10px;
  font-size: 13px;
  color: $text-secondary;
  font-family: Consolas, monospace;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-top: 10px;

  th,
  td {
    padding: 10px 14px;
    text-align: left;
    border-bottom: 1px solid $border-color-lighter;
  }

  th {
    background: #f8f9fc;
    color: $text-primary;
    font-weight: 600;
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
