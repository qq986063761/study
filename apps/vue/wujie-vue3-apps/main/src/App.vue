<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import { microAppList } from '@/micro-apps'

const menus = [
  { label: '首页', path: '/', mark: 'MAIN' },
  ...microAppList.map((app) => ({
    label: app.label,
    path: `/${app.name}`,
    mark: app.name.toUpperCase(),
  })),
]
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">WJ</span>
        <div>
          <strong>无界微前端</strong>
          <small>Vue3 + Vite Demo</small>
        </div>
      </div>

      <nav class="menu" aria-label="主导航">
        <RouterLink
          v-for="item in menus"
          :key="item.path"
          v-slot="{ href, navigate, isExactActive }"
          :to="item.path"
          custom
        >
          <a
            :href="href"
            class="menu-item"
            :class="{ active: isExactActive }"
            @click="navigate"
          >
            <span>{{ item.label }}</span>
            <small>{{ item.mark }}</small>
          </a>
        </RouterLink>
      </nav>
    </aside>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  min-width: 320px;
  color: #172033;
  background: #eef2f7;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

:global(a) {
  color: inherit;
  text-decoration: none;
}

.layout {
  display: grid;
  grid-template-columns: 236px minmax(0, 1fr);
  min-height: 100vh;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 24px 16px;
  color: #f7fafc;
  background: linear-gradient(180deg, #14213d 0%, #23395d 100%);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px;
}

.brand-mark {
  display: inline-grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 8px;
  color: #14213d;
  background: #f4d35e;
  font-weight: 800;
}

.brand strong,
.brand small {
  display: block;
}

.brand strong {
  font-size: 16px;
  line-height: 1.35;
}

.brand small {
  margin-top: 3px;
  color: #c7d2e5;
  font-size: 12px;
}

.menu {
  display: grid;
  gap: 8px;
}

.menu-item {
  display: flex;
  min-height: 46px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 8px;
  padding: 0 12px;
  color: #dbe6f5;
  background: transparent;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.menu-item:hover {
  color: #ffffff;
  background: rgb(255 255 255 / 0.09);
}

.menu-item.active {
  color: #14213d;
  background: #f4d35e;
  transform: translateX(2px);
}

.menu-item span {
  font-weight: 700;
}

.menu-item small {
  color: currentColor;
  font-size: 11px;
  opacity: 0.72;
}

.content {
  min-width: 0;
  min-height: 100vh;
  padding: 24px;
  overflow: hidden;
}

@media (max-width: 760px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
    gap: 16px;
    padding: 14px;
  }

  .menu {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .menu-item {
    justify-content: center;
    min-height: 42px;
  }

  .menu-item small {
    display: none;
  }

  .content {
    min-height: calc(100vh - 142px);
    padding: 16px;
  }
}
</style>
