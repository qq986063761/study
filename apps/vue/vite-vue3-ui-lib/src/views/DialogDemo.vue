<template>
  <div class="demo-page">
    <h1 class="demo-page__title">Dialog 对话框</h1>
    <p class="demo-page__desc">在保留当前页面状态的情况下，告知用户并承载相关操作。</p>

    <!-- 基础用法 -->
    <section class="demo-block">
      <h2>基础用法</h2>
      <p class="demo-block__tip">
        Dialog 组件使用 <code>visible</code> 属性控制显示，通过 <code>update:visible</code> 事件关闭。
      </p>
      <div class="demo-block__body">
        <ui-button type="primary" @click="visible1 = true">打开 Dialog</ui-button>
      </div>
      <ui-dialog
        :visible="visible1"
        title="基础对话框"
        @update:visible="visible1 = $event"
      >
        <p>这是一段对话框内容。</p>
        <p style="margin-top: 10px; color: #909399; font-size: 13px">
          点击遮罩层或右上角关闭按钮可关闭对话框。
        </p>
        <template #footer>
          <ui-button @click="visible1 = false">取消</ui-button>
          <ui-button type="primary" @click="visible1 = false">确定</ui-button>
        </template>
      </ui-dialog>
    </section>

    <!-- 自定义宽度 -->
    <section class="demo-block">
      <h2>自定义宽度</h2>
      <div class="demo-block__body">
        <ui-button type="primary" @click="visible2 = true">宽度 600px</ui-button>
      </div>
      <ui-dialog
        :visible="visible2"
        title="自定义宽度"
        width="600px"
        @update:visible="visible2 = $event"
      >
        <p>通过 <code>width</code> 属性可以设置对话框的宽度。</p>
        <template #footer>
          <ui-button type="primary" @click="visible2 = false">知道了</ui-button>
        </template>
      </ui-dialog>
    </section>

    <!-- 全屏对话框 -->
    <section class="demo-block">
      <h2>全屏对话框</h2>
      <div class="demo-block__body">
        <ui-button type="primary" @click="visible3 = true">全屏 Dialog</ui-button>
      </div>
      <ui-dialog
        :visible="visible3"
        title="全屏对话框"
        fullscreen
        @update:visible="visible3 = $event"
      >
        <p>这是一个全屏对话框，适合展示大量内容或复杂表单。</p>
        <template #footer>
          <ui-button type="primary" @click="visible3 = false">关闭</ui-button>
        </template>
      </ui-dialog>
    </section>

    <!-- API 表格 -->
    <section class="demo-block">
      <h2>Props</h2>
      <table class="api-table">
        <thead>
          <tr><th>参数</th><th>说明</th><th>类型</th><th>默认值</th></tr>
        </thead>
        <tbody>
          <tr><td>visible</td><td>是否显示 Dialog</td><td>boolean</td><td>false</td></tr>
          <tr><td>title</td><td>Dialog 标题</td><td>string</td><td>提示</td></tr>
          <tr><td>width</td><td>宽度</td><td>string</td><td>480px</td></tr>
          <tr><td>showClose</td><td>是否显示关闭按钮</td><td>boolean</td><td>true</td></tr>
          <tr><td>closeOnClickOverlay</td><td>点击遮罩是否关闭</td><td>boolean</td><td>true</td></tr>
          <tr><td>fullscreen</td><td>是否全屏</td><td>boolean</td><td>false</td></tr>
        </tbody>
      </table>

      <h2 style="margin-top: 24px">Slots</h2>
      <table class="api-table">
        <thead>
          <tr><th>插槽名</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>default</td><td>Dialog 内容</td></tr>
          <tr><td>title</td><td>Dialog 标题区</td></tr>
          <tr><td>footer</td><td>Dialog 底部操作区</td></tr>
        </tbody>
      </table>

      <h2 style="margin-top: 24px">Events</h2>
      <table class="api-table">
        <thead>
          <tr><th>事件名</th><th>说明</th><th>回调参数</th></tr>
        </thead>
        <tbody>
          <tr><td>update:visible</td><td>visible 状态更新</td><td>visible: boolean</td></tr>
          <tr><td>close</td><td>关闭时触发</td><td>—</td></tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible1 = ref(false)
const visible2 = ref(false)
const visible3 = ref(false)
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
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    padding: 20px;
    background: #fafbfc;
    border: 1px solid $border-color-lighter;
    border-radius: 8px;
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
