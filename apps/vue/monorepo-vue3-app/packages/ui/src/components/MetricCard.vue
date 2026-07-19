<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardMetric } from '@monorepo-vue3-app/constants'
import { formatNumber } from '@monorepo-vue3-app/utils'

const props = defineProps<{
  metric: DashboardMetric
}>()

const displayValue = computed(() => `${formatNumber(props.metric.value)}${props.metric.unit ?? ''}`)
</script>

<template>
  <article class="metric-card">
    <p>{{ metric.label }}</p>
    <strong>{{ displayValue }}</strong>
    <span :data-trend="metric.trend">{{ metric.trend }}</span>
  </article>
</template>

<style scoped>
.metric-card {
  display: grid;
  gap: 8px;
  min-height: 132px;
  padding: 18px;
  border: 1px solid var(--workspace-border);
  border-radius: 8px;
  background: var(--workspace-surface);
}

.metric-card p {
  margin: 0;
  color: var(--workspace-muted);
  font-size: 13px;
}

.metric-card strong {
  color: var(--workspace-text);
  font-size: 28px;
  font-weight: 800;
  line-height: 1.1;
}

.metric-card span {
  width: fit-content;
  padding: 3px 8px;
  border-radius: 999px;
  color: #475569;
  background: #f1f5f9;
  font-size: 12px;
  font-weight: 700;
}

.metric-card span[data-trend='up'] {
  color: #047857;
  background: #dcfce7;
}

.metric-card span[data-trend='down'] {
  color: #b42318;
  background: #fee4e2;
}
</style>
