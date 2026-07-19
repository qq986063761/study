<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
// 主应用内部走相对路径，避免 @main/runtime 被 dep prebundle 成第二份模块实例
// （否则 setupGlobalComponents 写的 vueApp 与 ui.main 读到的不是同一份）
import { ui } from '../runtime'

const router = useRouter()
const { t, locale } = useI18n()

function openSubApp(path: string): void {
  router.push(path)
}

function showMainModal(): void {
  void ui.main('modal', 'show', {
    title: 'main 全局弹窗',
    content: '这是通过 @main/runtime 的 ui.main 调用的全局弹窗。',
    payload: {
      source: 'main-home',
    },
  })
}

function setLocale(next: string): void {
  locale.value = next
}
</script>

<template>
  <div class="home-view">
    <h1>欢迎使用主应用</h1>
    <p class="lead">这是 Vue3 主应用首页，通过左侧菜单可以按需加载 app1 和 app2。</p>

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

    <el-button type="primary" plain class="modal-button" @click="showMainModal">
      调用 main modal.show
    </el-button>

    <div class="app-grid">
      <el-card shadow="hover">
        <div class="app-card">
          <h2 class="app1-title">app1</h2>
          <p>子应用一，独立提供 routes、Pinia store、ajax 和 i18n 配置。</p>
          <el-button type="primary" @click="openSubApp('/app1')">进入 app1</el-button>
        </div>
      </el-card>

      <el-card shadow="hover">
        <div class="app-card">
          <h2 class="app2-title">app2</h2>
          <p>子应用二，独立提供 routes、Pinia store、ajax 和 i18n 配置。</p>
          <el-button type="success" @click="openSubApp('/app2')">进入 app2</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 920px;
}

h1 {
  margin: 0 0 12px;
  color: #1f2937;
  font-size: 28px;
  font-weight: 700;
}

.lead {
  margin: 0 0 16px;
  color: #5f6b7a;
}

.demo-card {
  margin-bottom: 16px;
}

.demo-card p {
  margin: 6px 0;
  color: #5f6b7a;
  font-size: 14px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.modal-button {
  margin-bottom: 24px;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.app-card {
  text-align: center;
}

.app-card h2 {
  margin: 0 0 8px;
  font-size: 22px;
}

.app-card p {
  min-height: 44px;
  margin: 0 0 16px;
  color: #667085;
  font-size: 14px;
}

.app1-title {
  color: #2563eb;
}

.app2-title {
  color: #16a34a;
}

@media (max-width: 720px) {
  .app-grid {
    grid-template-columns: 1fr;
  }
}
</style>
