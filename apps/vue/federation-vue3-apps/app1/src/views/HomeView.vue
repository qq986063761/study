<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
// 子应用 consumer 侧 MF 只 re-export default，必须用默认导入
import runtime from '@main/runtime'
const { ajax, store: runtimeStore, ui } = runtime
import { useApp1Store } from '@/exports/store'

interface AjaxResult {
  data?: unknown
}

interface RemoteCounterStore {
  appName: string
  count: number
  doubleCount: number
  increment(): void
  setCount(payload: number): void
  incrementAsync(): void
}

const { t, locale } = useI18n()
const store = useApp1Store()
const app2Store = shallowRef<RemoteCounterStore>()
const route = useRoute()
const ajaxLoading = ref(false)
const ajaxResult = ref('')
const remoteStoreLoading = ref(false)
const globalModalLoading = ref(false)

const aboutPath = computed(() => (route.path.startsWith('/app1') ? '/app1/about' : '/about'))

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

async function loadApp2Store(): Promise<void> {
  if (app2Store.value) {
    return
  }

  remoteStoreLoading.value = true
  try {
    app2Store.value = (await runtimeStore.app2('useStore')) as unknown as RemoteCounterStore
  } catch (error) {
    console.error('[app1] load app2 store failed:', error)
    ElMessage.error('app2 store 加载失败，请查看控制台')
  } finally {
    remoteStoreLoading.value = false
  }
}

async function requestUsers(): Promise<void> {
  ajaxLoading.value = true
  try {
    const response = await ajax.app1('getUsers', { source: 'app1-home' })
    ajaxResult.value = formatAjaxResult(response)
    ElMessage.success('app1 接口请求完成')
  } catch (error) {
    console.error('[app1] getUsers request failed:', error)
    ElMessage.error('app1 接口请求失败，请查看控制台')
  } finally {
    window.setTimeout(() => {
      ajaxLoading.value = false
    }, 100)
  }
}

async function showApp2GlobalModal(): Promise<void> {
  globalModalLoading.value = true
  try {
    await ui.app2('modal', 'show', {
      title: 'app2 全局弹窗',
      content: '这是从 app1 页面调用 app2 暴露的 modal.show。',
      payload: {
        source: 'app1-home',
      },
    })
    ElMessage.success('app2 全局弹窗已调用')
  } catch (error) {
    console.error('[app1] 调用 app2 modal.show 失败:', error)
    ElMessage.error('调用 app2 全局弹窗失败，请查看控制台')
  } finally {
    globalModalLoading.value = false
  }
}

function setLocale(next: string): void {
  locale.value = next
}

onMounted(() => {
  loadApp2Store()
})
</script>

<template>
  <div class="sub-page app1-page">
    <h1>app1 首页</h1>
    <p class="intro">这是 app1 子应用的首页视图。</p>

    <el-card shadow="hover" class="demo-card">
      <template #header>
        <strong>i18n 语言资源演示</strong>
      </template>
      <div class="actions">
        <el-button
          size="small"
          :type="locale === 'zh-CN' ? 'primary' : 'default'"
          @click="setLocale('zh-CN')"
        >
          中文
        </el-button>
        <el-button
          size="small"
          :type="locale === 'en-US' ? 'primary' : 'default'"
          @click="setLocale('en-US')"
        >
          English
        </el-button>
      </div>
      <p>main: {{ t('main.message') }}</p>
      <p>app1: {{ t('app1.message') }}</p>
      <p>app2: {{ t('app2.message') }}</p>
    </el-card>

    <el-card shadow="hover" class="demo-card">
      <template #header>
        <strong>app1 Store 状态</strong>
      </template>
      <p>
        appName:
        <span class="metric">{{ store.appName || '未加载' }}</span>
      </p>
      <p>
        count:
        <span class="metric">{{ store.count }}</span>
      </p>
      <p>
        doubleCount:
        <span class="metric">{{ store.doubleCount }}</span>
      </p>
      <div class="actions">
        <el-button type="primary" size="small" @click="store.increment()">count +1</el-button>
        <el-button type="primary" plain size="small" @click="store.setCount(10)">
          setCount(10)
        </el-button>
        <el-button type="primary" plain size="small" @click="store.incrementAsync()">
          async +1
        </el-button>
      </div>
    </el-card>

    <el-card shadow="hover" class="demo-card">
      <template #header>
        <strong>app2 远程 Store 状态</strong>
      </template>
      <p>
        appName:
        <span class="metric">{{ app2Store?.appName || (remoteStoreLoading ? '加载中' : '未加载') }}</span>
      </p>
      <p>
        count:
        <span class="metric">{{ app2Store?.count ?? '-' }}</span>
      </p>
      <p>
        doubleCount:
        <span class="metric">{{ app2Store?.doubleCount ?? '-' }}</span>
      </p>
      <div class="actions">
        <el-button
          type="success"
          size="small"
          :loading="remoteStoreLoading"
          :disabled="!app2Store"
          @click="app2Store?.increment()"
        >
          app2 count +1
        </el-button>
        <el-button
          type="success"
          plain
          size="small"
          :disabled="!app2Store"
          @click="app2Store?.setCount(20)"
        >
          app2 setCount(20)
        </el-button>
        <el-button
          type="success"
          plain
          size="small"
          :disabled="!app2Store"
          @click="app2Store?.incrementAsync()"
        >
          app2 async +1
        </el-button>
      </div>
    </el-card>

    <el-card shadow="hover" class="demo-card">
      <template #header>
        <strong>app1 Ajax 演示</strong>
      </template>
      <el-button type="primary" size="small" :loading="ajaxLoading" @click="requestUsers">
        请求 app1 getUsers
      </el-button>
      <pre v-if="ajaxResult">{{ ajaxResult }}</pre>
    </el-card>

    <el-card shadow="hover" class="demo-card">
      <template #header>
        <strong>跨应用全局弹窗演示</strong>
      </template>
      <el-button
        type="primary"
        plain
        size="small"
        :loading="globalModalLoading"
        @click="showApp2GlobalModal"
      >
        调用 app2 modal.show
      </el-button>
    </el-card>

    <app2-card class="demo-card" />

    <router-link :to="aboutPath" class="page-link">进入 app1 关于页</router-link>
  </div>
</template>

<style scoped>
.sub-page {
  max-width: 920px;
}

h1 {
  margin: 0 0 12px;
  color: #2563eb;
  font-size: 28px;
}

.intro {
  margin: 0 0 18px;
  color: #667085;
}

.demo-card {
  margin-bottom: 16px;
}

.demo-card p {
  margin: 6px 0;
  color: #5f6b7a;
  font-size: 14px;
}

.metric {
  color: #2563eb;
  font-family: Consolas, "Liberation Mono", monospace;
  font-weight: 700;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
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

.page-link {
  display: inline-flex;
  margin-top: 4px;
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}
</style>
