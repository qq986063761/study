<script setup lang="ts">
import WujieVue from 'wujie-vue3'

import type { MicroAppConfig } from '@/micro-apps'

defineProps<{
  app: MicroAppConfig
}>()

const handleLoadError = (url: string, error: unknown) => {
  console.error(`[wujie] ${url} load failed`, error)
}
</script>

<template>
  <section class="micro-page">
    <header class="micro-header">
      <div>
        <p>Micro Application</p>
        <h1>{{ app.label }}</h1>
      </div>
      <a :href="app.url" target="_blank" rel="noreferrer">独立访问</a>
    </header>

    <div class="micro-host">
      <WujieVue
        :name="app.name"
        :url="app.url"
        :alive="true"
        width="100%"
        height="100%"
        :load-error="handleLoadError"
      />
    </div>
  </section>
</template>

<style scoped>
.micro-page {
  display: flex;
  min-height: calc(100vh - 48px);
  flex-direction: column;
  gap: 14px;
}

.micro-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid #d8e0ea;
  border-radius: 8px;
  padding: 18px 20px;
  background: #ffffff;
}

.micro-header p,
.micro-header h1 {
  margin: 0;
}

.micro-header p {
  color: #2d6a4f;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.micro-header h1 {
  margin-top: 4px;
  color: #14213d;
  font-size: 28px;
  line-height: 1.2;
}

.micro-header a {
  flex: 0 0 auto;
  border-radius: 8px;
  padding: 10px 14px;
  color: #ffffff;
  background: #2d6a4f;
  font-size: 14px;
  font-weight: 700;
}

.micro-host {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border: 1px solid #d8e0ea;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 30px rgb(20 33 61 / 0.06);
}

@media (max-width: 560px) {
  .micro-page {
    min-height: calc(100vh - 174px);
  }

  .micro-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
