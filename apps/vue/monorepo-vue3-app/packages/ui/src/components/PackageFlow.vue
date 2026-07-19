<script setup lang="ts">
withDefaults(
  defineProps<{
    items?: string[]
  }>(),
  {
    items: () => ['constants', 'utils', 'api', 'ui', 'apps'],
  },
)
</script>

<template>
  <ol class="package-flow">
    <li v-for="item in items" :key="item">
      <span>{{ item }}</span>
    </li>
  </ol>
</template>

<style scoped>
.package-flow {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.package-flow li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--workspace-muted);
  font-size: 13px;
  font-weight: 700;
}

.package-flow li:not(:last-child)::after {
  content: '>';
  color: #94a3b8;
}

.package-flow span {
  min-height: 28px;
  padding: 4px 9px;
  border: 1px solid var(--workspace-border);
  border-radius: 8px;
  color: var(--workspace-text);
  background: var(--workspace-surface);
}
</style>
