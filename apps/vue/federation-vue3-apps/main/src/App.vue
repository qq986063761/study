<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { House, Loading, Menu } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { getSubAppNameFromPath, loadSubApp } from './sub-app-loader'

const route = useRoute()
const router = useRouter()
const loadingMenu = ref('')

const activeMenu = computed(() => {
  if (route.path === '/') return '/'
  if (route.path.startsWith('/app1')) return '/app1'
  if (route.path.startsWith('/app2')) return '/app2'
  return '/'
})

const currentLocation = computed(() => {
  if (activeMenu.value === '/app1') return 'app1'
  if (activeMenu.value === '/app2') return 'app2'
  return '首页'
})

async function handleMenuSelect(index: string): Promise<void> {
  const subAppName = getSubAppNameFromPath(index)

  if (subAppName) {
    loadingMenu.value = index
    try {
      await loadSubApp(subAppName)
    } catch (err) {
      console.warn(`[main] menu load failed: ${subAppName}`, err)
      ElMessage.error(`子应用 ${subAppName} 加载失败，请确认 remoteEntry.js 可访问`)
      return
    } finally {
      loadingMenu.value = ''
    }
  }

  if (route.path !== index) {
    await router.push(index)
  }
}
</script>

<template>
  <div class="layout-shell">
    <el-menu
      :default-active="activeMenu"
      class="side-menu"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
      @select="handleMenuSelect"
    >
      <div class="brand">主应用</div>
      <el-menu-item index="/">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/app1" :disabled="loadingMenu !== ''">
        <el-icon v-if="loadingMenu === '/app1'"><Loading /></el-icon>
        <el-icon v-else><Menu /></el-icon>
        <span>app1</span>
      </el-menu-item>
      <el-menu-item index="/app2" :disabled="loadingMenu !== ''">
        <el-icon v-if="loadingMenu === '/app2'"><Loading /></el-icon>
        <el-icon v-else><Menu /></el-icon>
        <span>app2</span>
      </el-menu-item>
    </el-menu>

    <main v-loading="loadingMenu !== ''" class="app-main">
      <header class="topbar">
        <span>当前位置：</span>
        <strong>{{ currentLocation }}</strong>
      </header>
      <section class="view-panel">
        <router-view />
      </section>
    </main>
  </div>
</template>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
}

body {
  color: #1f2937;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

* {
  box-sizing: border-box;
}
</style>

<style scoped>
.layout-shell {
  display: flex;
  min-width: 0;
  height: 100vh;
  background: #f5f7fb;
}

.side-menu {
  width: 224px;
  flex-shrink: 0;
  border-right: 0;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  border-bottom: 1px solid rgb(255 255 255 / 10%);
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}

.app-main {
  position: relative;
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.topbar {
  display: flex;
  height: 48px;
  flex-shrink: 0;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  color: #667085;
  font-size: 14px;
  padding-inline: 18px;
}

.topbar strong {
  color: #2563eb;
}

.view-panel {
  min-height: 0;
  flex: 1;
  overflow: auto;
  padding: 24px;
}

@media (max-width: 720px) {
  .layout-shell {
    flex-direction: column;
  }

  .side-menu {
    width: 100%;
    display: flex;
  }

  .brand {
    width: 120px;
    border-bottom: 0;
  }
}
</style>
