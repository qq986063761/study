<script setup lang="ts">
import { computed } from 'vue'
import { WORKSPACE_APP_MAP, type AppName } from '@monorepo-vue3-app/constants'
import { capitalize } from '@monorepo-vue3-app/utils'

const props = defineProps<{
  app: AppName
}>()

const appMeta = computed(() => WORKSPACE_APP_MAP[props.app])
const platformLabel = computed(() => capitalize(appMeta.value.platform))
</script>

<template>
  <span class="workspace-badge">
    <strong>{{ appMeta.label }}</strong>
    <small>{{ platformLabel }}</small>
  </span>
</template>

<style scoped>
.workspace-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  min-height: 32px;
  padding: 5px 10px;
  border: 1px solid var(--workspace-border);
  border-radius: 8px;
  color: var(--workspace-text);
  background: var(--workspace-surface);
}

.workspace-badge strong {
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
}

.workspace-badge small {
  color: var(--workspace-muted);
  font-size: 12px;
  line-height: 1;
}
</style>
