<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

const menus = [
  { label: '首页', to: '/' },
  { label: 'App1', to: '/app1' },
  { label: 'App2', to: '/app2' },
]

const currentTitle = computed(() => {
  return menus.find((menu) => {
    return menu.to === '/' ? route.path === '/' : route.path.startsWith(menu.to)
  })?.label
})
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">Q</span>
        <div>
          <strong>Qiankun Vue3</strong>
          <small>main</small>
        </div>
      </div>

      <nav class="menu">
        <RouterLink
          v-for="menu in menus"
          :key="menu.to"
          :to="menu.to"
          class="menu-item"
          :class="{ active: menu.to === '/' ? route.path === '/' : route.path.startsWith(menu.to) }"
        >
          {{ menu.label }}
        </RouterLink>
      </nav>
    </aside>

    <main class="main-content">
      <header class="content-header">
        <div>
          <p class="eyebrow">Micro Frontend Demo</p>
          <h1>{{ currentTitle }}</h1>
        </div>
      </header>

      <section class="content-body">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  background: #f4f7fb;
  color: #1f2937;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

:global(a) {
  color: inherit;
}

.app-shell {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 224px;
  flex: 0 0 224px;
  border-right: 1px solid #d8e0ea;
  background: #102033;
  color: #e8eef7;
  padding: 20px 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.brand-mark {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 8px;
  background: #3dd6a3;
  color: #102033;
  font-weight: 800;
}

.brand strong,
.brand small {
  display: block;
}

.brand small {
  margin-top: 2px;
  color: #9fb1c7;
}

.menu {
  display: grid;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  min-height: 42px;
  border-radius: 8px;
  padding: 0 12px;
  color: #cbd7e6;
  text-decoration: none;
  font-weight: 600;
}

.menu-item:hover,
.menu-item.active {
  background: #f4f7fb;
  color: #102033;
}

.main-content {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.content-header {
  display: flex;
  align-items: center;
  min-height: 92px;
  border-bottom: 1px solid #d8e0ea;
  background: #ffffff;
  padding: 0 28px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.content-header h1 {
  margin: 0;
  font-size: 24px;
}

.content-body {
  flex: 1;
  min-height: 0;
  padding: 24px;
}

@media (max-width: 720px) {
  .app-shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-basis: auto;
  }

  .menu {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .menu-item {
    justify-content: center;
  }
}
</style>
