<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  DataAnalysis,
  Setting,
  User,
  Document,
  MagicStick,
  Shop,
  Connection
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 菜单折叠状态
const isCollapse = ref(false)

// el-scrollbar 组件引用，用于菜单切换时重置滚动位置
const scrollbarRef = ref(null)

// 菜单数据
const menuItems = [
  {
    index: '/data',
    title: '数据渲染',
    icon: DataAnalysis
  },
  {
    index: '/component',
    title: '组件 API 演示',
    icon: User
  },
  {
    index: '/builtin-components',
    title: '内置组件演示',
    icon: MagicStick
  },
  {
    index: '/store-demo',
    title: 'Store 演示',
    icon: Shop
  },
  {
    index: '/router-demo',
    title: 'vue-router 4 API 演示',
    icon: Connection
  }
]

// 处理菜单点击
const handleMenuClick = (index: string) => {
  router.push(index)
  // 菜单切换后重置主内容区滚动位置到顶部
  if (scrollbarRef.value) {
    scrollbarRef.value.setScrollTop(0)
  }
}

// 切换菜单折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 根据当前路径计算需要高亮的菜单项 index（支持嵌套路由）
const activeMenu = computed(() => {
  const matched = menuItems.find(item => route.path.startsWith(item.index))
  return matched?.index ?? route.path
})
</script>

<template>
  <!-- 左侧菜单 -->
  <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
    <div class="logo">
      <h3 v-if="!isCollapse">Vue3 PC App</h3>
      <h3 v-else>V3</h3>
    </div>

    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="true"
      class="sidebar-menu"
      @select="handleMenuClick"
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.index"
        :index="item.index"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </el-menu>
  </el-aside>

  <!-- 右侧内容区域 -->
  <el-container class="app-main">
    <el-scrollbar ref="scrollbarRef" class="app-main-view">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </el-scrollbar>
  </el-container>
</template>

<style lang="scss" scoped>
.sidebar {
  background-color: #304156;
  transition: width 0.3s;
}

.app-main {

  &-view {
    width: 100%;
    height: 100%;
  }
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b3a4b;
  color: white;
  margin-bottom: 0;
}

.logo h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.sidebar-menu {
  border: none;
  background-color: #304156;
}

.sidebar-menu .el-menu-item {
  color: #bfcbd9;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #263445;
  color: #fff;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #409eff;
  color: #fff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 64px !important;
  }

  .logo h3 {
    display: none;
  }
}
</style>
