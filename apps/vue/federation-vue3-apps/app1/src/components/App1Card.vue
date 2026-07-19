<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import runtime from '@main/runtime'
const { ajax } = runtime

interface AjaxResult {
  data?: unknown
}

const route = useRoute()
const router = useRouter()
const requestLoading = ref(false)
const jumping = ref(false)
const ajaxResult = ref('')

function formatAjaxResult(response: unknown): string {
  const data =
    response && typeof response === 'object' && 'data' in response
      ? (response as AjaxResult).data
      : response

  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

async function requestUsers(): Promise<void> {
  requestLoading.value = true
  try {
    const response = await ajax.app1('getUsers', { source: 'app1-card' })
    ajaxResult.value = formatAjaxResult(response)
    ElMessage.success('app1 组件接口请求完成')
  } catch (error) {
    console.error('[app1-card] getUsers 请求失败:', error)
    ElMessage.error('app1 组件接口请求失败，请查看控制台')
  } finally {
    requestLoading.value = false
  }
}

async function goApp1Route(): Promise<void> {
  const target = '/app1/about'
  if (route.path === target) return

  jumping.value = true
  try {
    await router.push(target)
  } finally {
    jumping.value = false
  }
}
</script>

<template>
  <el-card shadow="hover" class="app1-card">
    <template #header>
      <strong>app1 联邦组件（App1Card）</strong>
    </template>
    <p>
      我由 app1 构建并通过 Module Federation 暴露，现被主应用懒加载渲染在此页面。
    </p>
    <div class="actions">
      <el-button type="primary" size="small" :loading="requestLoading" @click="requestUsers">
        请求 app1 getUsers
      </el-button>
      <el-button type="primary" plain size="small" :loading="jumping" @click="goApp1Route">
        跳转 app1 关于页
      </el-button>
    </div>
    <pre v-if="ajaxResult">{{ ajaxResult }}</pre>
  </el-card>
</template>

<style scoped>
.app1-card {
  border-left: 4px solid #2563eb;
}

.app1-card p {
  margin: 0 0 14px;
  color: #5f6b7a;
  font-size: 14px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

pre {
  margin: 12px 0 0;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  color: #344054;
  font-size: 12px;
  line-height: 1.5;
  padding: 12px;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
