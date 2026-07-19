<script setup lang="ts">
import { ref } from 'vue'

interface ModalShowOptions {
  title?: string
  content?: string
  message?: string
  payload?: unknown
}

const visible = ref(false)
const title = ref('app2 弹窗')
const content = ref('这是 app2 暴露给 main 的全局弹窗')
const payloadText = ref('')

function formatPayload(payload: unknown): string {
  if (payload === undefined) return ''

  try {
    return JSON.stringify(payload, null, 2)
  } catch {
    return String(payload)
  }
}

function show(options: ModalShowOptions = {}): void {
  title.value = options.title || 'app2 弹窗'
  content.value = options.content || options.message || '这是 app2 暴露给 main 的全局弹窗'
  payloadText.value = formatPayload(options.payload)
  visible.value = true
}

function hide(): void {
  visible.value = false
}

defineExpose({
  show,
  hide,
})
</script>

<template>
  <el-dialog v-model="visible" :title="title" width="420px" append-to-body>
    <p class="modal-content">{{ content }}</p>
    <pre v-if="payloadText" class="modal-payload">{{ payloadText }}</pre>
    <template #footer>
      <el-button type="success" size="small" @click="hide">关闭 app2 弹窗</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.modal-content {
  margin: 0;
  color: #4b5563;
  font-size: 14px;
  white-space: pre-wrap;
}

.modal-payload {
  margin: 12px 0 0;
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #374151;
  font-size: 12px;
  line-height: 1.5;
  padding: 12px;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
