<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    width="420px"
    append-to-body
  >
    <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ content }}</p>
    <pre v-if="payloadText" class="mt-3 p-3 text-xs text-gray-700 bg-gray-50 border border-gray-200 whitespace-pre-wrap break-all">{{ payloadText }}</pre>
    <span slot="footer">
      <el-button type="primary" size="small" @click="hide">知道了</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

interface ModalShowOptions {
  title?: string
  content?: string
  message?: string
  payload?: unknown
}

@Component
export default class MainModal extends Vue {
  visible = false
  title = 'main 弹窗'
  content = '这是 main 本地全局弹窗'
  payloadText = ''

  show(options: ModalShowOptions = {}): void {
    this.title = options.title || 'main 弹窗'
    this.content = options.content || options.message || '这是 main 本地全局弹窗'
    this.payloadText = this.formatPayload(options.payload)
    this.visible = true
  }

  hide(): void {
    this.visible = false
  }

  private formatPayload(payload: unknown): string {
    if (payload === undefined) return ''
    try {
      return JSON.stringify(payload, null, 2)
    } catch {
      return String(payload)
    }
  }
}
</script>
