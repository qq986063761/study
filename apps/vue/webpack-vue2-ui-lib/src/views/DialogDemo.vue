<template>
  <div class="demo-page">
    <h1 class="demo-page__title">Dialog 对话框</h1>
    <p class="demo-page__desc">
      在浮层中显示内容，常用于需要用户确认或输入信息的场景。
    </p>

    <!-- 基础用法 -->
    <section class="demo-block">
      <h2>基础用法</h2>
      <p class="demo-block__tip">
        使用 <code>:visible.sync</code> 控制对话框的显示与隐藏。
      </p>
      <div class="demo-block__body">
        <ui-button type="primary" @click="visible1 = true"
          >打开对话框</ui-button
        >
        <span class="status-text">
          visible: <code>{{ visible1 }}</code>
        </span>
      </div>
      <ui-dialog
        :visible.sync="visible1"
        title="操作确认"
        @close="log('对话框关闭')"
      >
        <p>确定要执行此操作吗？</p>
        <p style="color: #909399; margin-top: 8px; font-size: 13px">
          此操作不可撤销，请谨慎操作。
        </p>
        <template #footer>
          <ui-button @click="visible1 = false">取消</ui-button>
          <ui-button type="primary" @click="onConfirm1">确定</ui-button>
        </template>
      </ui-dialog>
    </section>

    <!-- 自定义内容 -->
    <section class="demo-block">
      <h2>自定义内容</h2>
      <p class="demo-block__tip">对话框内容区域支持任意 HTML 和组件。</p>
      <div class="demo-block__body">
        <ui-button type="success" @click="visible2 = true"
          >表单对话框</ui-button
        >
      </div>
      <ui-dialog :visible.sync="visible2" title="用户信息" width="420px">
        <div class="form-row">
          <label class="form-label">用户名</label>
          <ui-input v-model="form.name" placeholder="请输入用户名" />
        </div>
        <div class="form-row" style="margin-top: 14px">
          <label class="form-label">邮箱</label>
          <ui-input
            v-model="form.email"
            placeholder="请输入邮箱"
            :error-msg="emailError"
          />
        </div>
        <template #footer>
          <ui-button @click="visible2 = false">取消</ui-button>
          <ui-button type="primary" @click="submitForm">提交</ui-button>
        </template>
      </ui-dialog>
    </section>

    <!-- 无底部 & 大尺寸 -->
    <section class="demo-block">
      <h2>无底部 & 大尺寸</h2>
      <div class="demo-block__body">
        <ui-button type="warning" @click="visible3 = true">宽对话框</ui-button>
        <ui-button
          type="primary"
          style="margin-left: 10px"
          @click="visible4 = true"
        >
          无底部按钮
        </ui-button>
      </div>

      <ui-dialog :visible.sync="visible3" title="宽对话框" width="680px">
        <p>
          这是一个更宽的对话框，适合展示表格或复杂内容。你可以通过
          <code>width</code> 属性设置任意宽度。
        </p>
        <template #footer>
          <ui-button type="primary" @click="visible3 = false">知道了</ui-button>
        </template>
      </ui-dialog>

      <ui-dialog :visible.sync="visible4" title="通知" :show-close="true">
        <p>这是一个只有标题栏和内容的简单对话框。</p>
        <p style="margin-top: 8px">点击遮罩层或右上角关闭按钮即可关闭。</p>
      </ui-dialog>
    </section>

    <!-- 禁用点击遮罩关闭 -->
    <section class="demo-block">
      <h2>禁用遮罩关闭</h2>
      <p class="demo-block__tip">
        设置 <code>:close-on-click-overlay="false"</code>，只能通过按钮关闭。
      </p>
      <div class="demo-block__body">
        <ui-button type="danger" @click="visible5 = true"
          >不可遮罩关闭</ui-button
        >
      </div>
      <ui-dialog
        :visible.sync="visible5"
        title="重要操作"
        :close-on-click-overlay="false"
      >
        <p style="color: #e6a23c">
          ⚠ 此对话框无法通过点击遮罩层关闭，请点击下方按钮。
        </p>
        <template #footer>
          <ui-button type="primary" @click="visible5 = false"
            >我已知晓</ui-button
          >
        </template>
      </ui-dialog>
    </section>

    <!-- 事件日志 -->
    <section class="demo-block">
      <h2>事件日志</h2>
      <div v-if="logs.length" class="event-log">
        <p v-for="(msg, i) in logs" :key="i" class="event-log__item">
          {{ msg }}
        </p>
      </div>
      <p v-else style="color: #909399; font-size: 13px">
        暂无日志，操作对话框试试
      </p>
    </section>

    <!-- API -->
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
            <td>visible</td>
            <td>是否显示（支持 .sync）</td>
            <td>boolean</td>
            <td>false</td>
          </tr>
          <tr>
            <td>title</td>
            <td>标题</td>
            <td>string</td>
            <td>提示</td>
          </tr>
          <tr>
            <td>width</td>
            <td>宽度</td>
            <td>string</td>
            <td>480px</td>
          </tr>
          <tr>
            <td>showClose</td>
            <td>是否显示关闭按钮</td>
            <td>boolean</td>
            <td>true</td>
          </tr>
          <tr>
            <td>closeOnClickOverlay</td>
            <td>点击遮罩是否关闭</td>
            <td>boolean</td>
            <td>true</td>
          </tr>
          <tr>
            <td>fullscreen</td>
            <td>是否全屏</td>
            <td>boolean</td>
            <td>false</td>
          </tr>
        </tbody>
      </table>

      <h2 style="margin-top: 24px">Events</h2>
      <table class="api-table">
        <thead>
          <tr>
            <th>事件名</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>close</td>
            <td>对话框关闭时触发</td>
          </tr>
          <tr>
            <td>update:visible</td>
            <td>visible 更新时触发</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class DialogDemo extends Vue {
  visible1 = false;
  visible2 = false;
  visible3 = false;
  visible4 = false;
  visible5 = false;

  form = { name: "", email: "" };
  emailError = "";

  logs: string[] = [];

  log(msg: string): void {
    const time = new Date().toLocaleTimeString();
    this.logs.unshift(`[${time}] ${msg}`);
  }

  onConfirm1(): void {
    this.log("用户点击了确定");
    this.visible1 = false;
  }

  submitForm(): void {
    if (!this.form.email) {
      this.emailError = "请输入邮箱地址";
      return;
    }
    this.emailError = "";
    this.log(`提交表单: name=${this.form.name}, email=${this.form.email}`);
    this.visible2 = false;
    this.form = { name: "", email: "" };
  }
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

.status-text {
  margin-left: 14px;
  font-size: 13px;
  color: $text-secondary;
  code {
    color: $primary-color;
    font-family: Consolas, monospace;
  }
}

.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-label {
  width: 60px;
  text-align: right;
  font-size: 13px;
  color: $text-regular;
  flex-shrink: 0;
}

.event-log {
  margin-top: 12px;
  padding: 10px 14px;
  background: #1d1e2c;
  border-radius: 6px;
  max-height: 140px;
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
