<template>
  <div class="ui-menu" :class="{ 'is-collapsed': collapsed }">
    <!-- Logo 区 -->
    <div class="ui-menu__logo">
      <span v-if="!collapsed" class="ui-menu__logo-text">{{ title }}</span>
      <span v-else class="ui-menu__logo-icon">UI</span>
    </div>

    <!-- 菜单列表 -->
    <ul class="ui-menu__list">
      <li
        v-for="item in menuItems"
        :key="item.path"
        class="ui-menu__item"
        :class="{ 'is-active': isActive(item.path) }"
        @click="navigate(item.path)"
      >
        <span class="ui-menu__item-icon">{{ item.icon }}</span>
        <span v-if="!collapsed" class="ui-menu__item-label">
          {{ item.label }}
        </span>
        <span v-if="!collapsed && item.badge" class="ui-menu__item-badge">
          {{ item.badge }}
        </span>
      </li>
    </ul>

    <!-- 折叠按钮 -->
    <div class="ui-menu__toggle" @click="toggle">
      <span class="ui-menu__toggle-icon">{{ collapsed ? "▶" : "◀" }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

defineOptions({ name: 'UiMenu' })

export interface MenuItem {
  label: string
  path: string
  icon: string
  badge?: string | number
}

withDefaults(defineProps<{
  title?: string
  collapsed?: boolean
  menuItems?: MenuItem[]
}>(), {
  title: 'UI Kit',
  collapsed: false,
  menuItems: () => [],
})

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
  toggle: [value: boolean]
}>()

const router = useRouter()
const route = useRoute()

function isActive(path: string): boolean {
  return route.path === path
}

function navigate(path: string): void {
  if (route.path !== path) {
    router.push(path)
  }
}

function toggle(): void {
  emit('update:collapsed', false)
  emit('toggle', false)
}
</script>

<style scoped lang="scss">
@use "../styles/variables" as *;

$menu-width: 220px;
$menu-collapsed-width: 64px;

.ui-menu {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: $menu-width;
  background: #1d1e2c;
  color: #c8c9d4;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width $transition-duration;
  overflow: hidden;
  user-select: none;

  &.is-collapsed {
    width: $menu-collapsed-width;
  }
}

// Logo
.ui-menu__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;

  &-text {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    white-space: nowrap;
    letter-spacing: 1px;
  }

  &-icon {
    font-size: 20px;
    font-weight: 800;
    color: $primary-color;
    background: rgba(64, 158, 255, 0.15);
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
  }
}

// 菜单列表
.ui-menu__list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 8px;
  list-style: none;
}

.ui-menu__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  color: #a0a1b2;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #e0e1e8;
  }

  &.is-active {
    background: rgba(64, 158, 255, 0.15);
    color: $primary-color;
    font-weight: 500;

    .ui-menu__item-icon {
      color: $primary-color;
    }
  }

  &-icon {
    font-size: 18px;
    width: 24px;
    text-align: center;
    flex-shrink: 0;
    transition: color 0.2s;
  }

  &-label {
    flex: 1;
    font-size: $font-size-base;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity 0.2s;
  }

  &-badge {
    font-size: 11px;
    padding: 1px 6px;
    border-radius: 10px;
    background: $danger-color;
    color: #fff;
    flex-shrink: 0;
  }
}

// 折叠按钮
.ui-menu__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  &-icon {
    font-size: 12px;
    color: #6b6c7e;
    transition: color 0.2s;
  }
}
</style>
