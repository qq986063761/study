<template>
  <!-- 左侧菜单 -->
  <ui-menu
    title="UI Kit"
    :menu-items="menuItems"
    :collapsed="menuCollapsed"
    @update:collapsed="menuCollapsed = $event"
  />

  <!-- 右侧内容区 -->
  <div class="main-area" :class="{ 'is-menu-collapsed': menuCollapsed }">
    <!-- 顶栏 -->
    <header class="main-header">
      <h2 class="main-header__title">{{ currentPageTitle }}</h2>
      <a
        class="main-header__link"
        href="https://github.com"
        target="_blank"
        rel="noopener"
      >
        GitHub
      </a>
    </header>

    <!-- 页面内容 -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

interface MenuItem {
  label: string
  path: string
  icon: string
}

const router = useRouter()
const route = useRoute()
const menuCollapsed = ref(false)

const menuItems = computed<MenuItem[]>(() => {
  const routes = router.options.routes
  return routes
    .filter((r) => r.meta?.icon)
    .map((r) => ({
      label: (r.meta?.title as string) || r.name?.toString() || '',
      path: r.path,
      icon: (r.meta?.icon as string) || '📄',
    }))
})

const currentPageTitle = computed(() => {
  const meta = route.meta
  return meta ? (meta.title as string) || 'UI 组件库' : 'UI 组件库'
})
</script>

<style lang="scss">
// 全局 reset
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  color: #303133;
  background: #f0f2f5;
}

#app {
  display: flex;
  min-height: 100vh;
}

// 主内容区
.main-area {
  flex: 1;
  margin-left: 220px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s;

  &.is-menu-collapsed {
    margin-left: 64px;
  }
}

// 顶栏
.main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 28px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  position: sticky;
  top: 0;
  z-index: 50;

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  &__link {
    font-size: 13px;
    color: #606266;
    text-decoration: none;
    padding: 4px 12px;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      background: #f0f2f5;
      color: #409eff;
    }
  }
}

// 页面内容
.main-content {
  flex: 1;
  padding: 28px;
  overflow-y: auto;
}
</style>
