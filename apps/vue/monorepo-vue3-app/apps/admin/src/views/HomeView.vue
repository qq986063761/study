<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchDashboardSummary } from '@monorepo-vue3-app/api'
import {
  APP_MENUS,
  WORKSPACE_APP_MAP,
  type DashboardMetric,
  type DashboardSummary,
} from '@monorepo-vue3-app/constants'
import { MetricCard, PackageFlow, WorkspaceBadge } from '@monorepo-vue3-app/ui'
import { formatDateTime, formatNumber } from '@monorepo-vue3-app/utils'

const appName = 'admin' as const
const appMeta = WORKSPACE_APP_MAP[appName]
const summary = ref<DashboardSummary | null>(null)

const firstMetric = computed<DashboardMetric | null>(() => summary.value?.metrics[0] ?? null)
const menuText = computed(() => APP_MENUS[appName].map((item) => item.label).join(' / '))
const updatedAtText = computed(() =>
  summary.value ? formatDateTime(summary.value.updatedAt) : '加载中',
)
const metricValueText = computed(() => formatNumber(firstMetric.value?.value ?? 0))

const packageChecks = computed(() => [
  {
    name: 'constants',
    value: menuText.value,
    detail: 'WORKSPACE_APP_MAP / APP_MENUS',
  },
  {
    name: 'utils',
    value: metricValueText.value,
    detail: 'formatNumber / formatDateTime',
  },
  {
    name: 'api',
    value: summary.value?.title ?? '加载中',
    detail: 'fetchDashboardSummary',
  },
  {
    name: 'ui',
    value: '组件已渲染',
    detail: 'WorkspaceBadge / PackageFlow / MetricCard',
  },
])

onMounted(async () => {
  summary.value = await fetchDashboardSummary(appName)
})
</script>

<template>
  <main class="package-check-page">
    <section class="page-title" id="workspace">
      <WorkspaceBadge :app="appName" />
      <h2>{{ appMeta.label }}</h2>
      <p>验证 apps 可以正常引入 packages 中的共享包。</p>
    </section>

    <section class="panel">
      <div class="panel-title">
        <span>Package check</span>
        <h3>共享包引入状态</h3>
      </div>

      <div class="check-list">
        <article v-for="item in packageChecks" :key="item.name" class="check-item">
          <span>{{ item.name }}</span>
          <strong>{{ item.value }}</strong>
          <small>{{ item.detail }}</small>
        </article>
      </div>
    </section>

    <section class="panel">
      <div class="panel-title">
        <span>Common content</span>
        <h3>公用内容展示</h3>
      </div>

      <PackageFlow :items="['constants', 'utils', 'api', 'ui', appName]" />
      <MetricCard v-if="firstMetric" :metric="firstMetric" />
      <p class="updated-at">更新时间：{{ updatedAtText }}</p>
    </section>
  </main>
</template>

<style scoped>
.package-check-page {
  display: grid;
  gap: 18px;
  width: min(980px, calc(100% - 40px));
  margin: 0 auto;
  padding: 28px 0 48px;
}

.page-title,
.panel {
  display: grid;
  gap: 16px;
  border: 1px solid #d8dee9;
  border-radius: 8px;
  background: #ffffff;
}

.page-title {
  padding: 26px;
}

.page-title h2 {
  margin: 0;
  color: #172033;
  font-size: 32px;
  font-weight: 800;
}

.page-title p,
.updated-at {
  margin: 0;
  color: #61708a;
}

.panel {
  padding: 22px;
}

.panel-title span,
.check-item span {
  color: #61708a;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.panel-title h3 {
  margin: 4px 0 0;
  color: #172033;
  font-size: 20px;
  font-weight: 800;
}

.check-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.check-item {
  display: grid;
  gap: 6px;
  min-height: 118px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}

.check-item strong {
  color: #172033;
  font-size: 16px;
  font-weight: 800;
  word-break: break-word;
}

.check-item small {
  color: #61708a;
  font-size: 12px;
}

@media (max-width: 820px) {
  .check-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .package-check-page {
    width: min(100% - 28px, 980px);
  }

  .check-list {
    grid-template-columns: 1fr;
  }
}
</style>
