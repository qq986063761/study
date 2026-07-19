<script setup lang="ts">
import { RouterView } from 'vue-router'
import { WORKSPACE_APP_MAP } from '@monorepo-vue3-app/constants'

const appMeta = WORKSPACE_APP_MAP.web
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div>
        <span>WEB</span>
        <h1>{{ appMeta.label }}</h1>
      </div>
      <p>共享包验证页</p>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f4f7fb;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px clamp(20px, 5vw, 48px);
  border-bottom: 1px solid #d8dee9;
  background: #ffffff;
}

.app-header span {
  color: #61708a;
  font-size: 12px;
  font-weight: 700;
}

.app-header h1 {
  margin: 4px 0 0;
  color: #172033;
  font-size: 24px;
  font-weight: 800;
}

.app-header p {
  margin: 0;
  color: #61708a;
  font-weight: 700;
}

@media (max-width: 560px) {
  .app-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
