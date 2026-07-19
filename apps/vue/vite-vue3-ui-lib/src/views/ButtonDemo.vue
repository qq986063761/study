<template>
  <div class="demo-page">
    <h1 class="demo-page__title">Button 按钮</h1>
    <p class="demo-page__desc">常用的操作按钮，支持多种类型、尺寸和状态。</p>

    <!-- 基础类型 -->
    <section class="demo-block">
      <h2>基础类型</h2>
      <p class="demo-block__tip">
        使用 <code>type</code> 属性定义按钮类型，支持 default / primary /
        success / warning / danger / info
      </p>
      <div class="demo-block__body">
        <ui-button @click="log('默认')">默认按钮</ui-button>
        <ui-button type="primary" @click="log('主要')">主要按钮</ui-button>
        <ui-button type="success">成功按钮</ui-button>
        <ui-button type="warning">警告按钮</ui-button>
        <ui-button type="danger">危险按钮</ui-button>
        <ui-button type="info">信息按钮</ui-button>
      </div>
    </section>

    <!-- 朴素按钮 -->
    <section class="demo-block">
      <h2>朴素按钮</h2>
      <p class="demo-block__tip">
        设置 <code>plain</code> 属性使按钮背景透明。
      </p>
      <div class="demo-block__body">
        <ui-button type="primary" plain>主要</ui-button>
        <ui-button type="success" plain>成功</ui-button>
        <ui-button type="warning" plain>警告</ui-button>
        <ui-button type="danger" plain>危险</ui-button>
        <ui-button type="info" plain>信息</ui-button>
      </div>
    </section>

    <!-- 圆角按钮 -->
    <section class="demo-block">
      <h2>圆角按钮</h2>
      <p class="demo-block__tip">设置 <code>round</code> 属性获得圆角按钮。</p>
      <div class="demo-block__body">
        <ui-button type="primary" round>圆角</ui-button>
        <ui-button type="success" round>圆角</ui-button>
        <ui-button type="danger" round>圆角</ui-button>
      </div>
    </section>

    <!-- 不同尺寸 -->
    <section class="demo-block">
      <h2>不同尺寸</h2>
      <p class="demo-block__tip">
        通过 <code>size</code> 设置 small / medium / large 三种尺寸。
      </p>
      <div class="demo-block__body">
        <ui-button type="primary" size="small">小尺寸</ui-button>
        <ui-button type="primary">默认尺寸</ui-button>
        <ui-button type="primary" size="large">大尺寸</ui-button>
      </div>
    </section>

    <!-- 状态 -->
    <section class="demo-block">
      <h2>禁用与加载</h2>
      <p class="demo-block__tip">
        <code>disabled</code> 禁用按钮，<code>loading</code> 进入加载态。
      </p>
      <div class="demo-block__body">
        <ui-button type="primary" disabled>禁用状态</ui-button>
        <ui-button type="primary" loading>加载中</ui-button>
        <ui-button disabled>默认禁用</ui-button>
      </div>
    </section>

    <!-- 带图标 -->
    <section class="demo-block">
      <h2>图标按钮</h2>
      <p class="demo-block__tip">
        通过 <code>icon</code> 插槽在按钮文字前添加图标。
      </p>
      <div class="demo-block__body">
        <ui-button type="primary">
          <template #icon>🔍</template>
          搜索
        </ui-button>
        <ui-button type="success">
          <template #icon>✔</template>
          确认
        </ui-button>
        <ui-button type="danger">
          <template #icon>🗑</template>
          删除
        </ui-button>
      </div>
    </section>

    <!-- 事件日志 -->
    <section class="demo-block">
      <h2>点击事件</h2>
      <div class="demo-block__body">
        <ui-button type="primary" @click="log('按钮被点击')">点击我查看日志</ui-button>
      </div>
      <div v-if="logs.length" class="event-log">
        <p v-for="(msg, i) in logs" :key="i" class="event-log__item">
          {{ msg }}
        </p>
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
          <tr><td>type</td><td>按钮类型</td><td>string</td><td>default</td></tr>
          <tr><td>size</td><td>按钮尺寸</td><td>string</td><td>medium</td></tr>
          <tr><td>disabled</td><td>是否禁用</td><td>boolean</td><td>false</td></tr>
          <tr><td>loading</td><td>加载中状态</td><td>boolean</td><td>false</td></tr>
          <tr><td>round</td><td>圆角按钮</td><td>boolean</td><td>false</td></tr>
          <tr><td>plain</td><td>朴素按钮</td><td>boolean</td><td>false</td></tr>
        </tbody>
      </table>

      <h2 style="margin-top: 24px">Slots</h2>
      <table class="api-table">
        <thead>
          <tr><th>插槽名</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td>default</td><td>按钮文字内容</td></tr>
          <tr><td>icon</td><td>按钮图标</td></tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const logs = ref<string[]>([])

function log(msg: string): void {
  const time = new Date().toLocaleTimeString()
  logs.value.unshift(`[${time}] ${msg}`)
  console.log(`Button: ${msg}`)
}
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

.event-log {
  margin-top: 12px;
  padding: 10px 14px;
  background: #1d1e2c;
  border-radius: 6px;
  max-height: 120px;
  overflow-y: auto;

  &__item {
    font-size: 12px;
    color: #a6accd;
    font-family: Consolas, monospace;
    line-height: 1.8;
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
