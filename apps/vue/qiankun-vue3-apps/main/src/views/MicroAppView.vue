<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const appName = computed(() => (route.path.startsWith('/app2') ? 'app2' : 'app1'))
</script>

<template>
  <div class="micro-app-view">
    <div id="subapp-container" class="subapp-container" :data-app="appName"></div>
  </div>
</template>

<style scoped>
.micro-app-view,
.subapp-container {
  width: 100%;
  min-height: calc(100vh - 140px);
}

.subapp-container {
  overflow: hidden;
  border: 1px solid #d8e0ea;
  border-radius: 8px;
  background: #ffffff;
}

.subapp-container :deep(> div) {
  min-height: calc(100vh - 142px);
}
</style>
