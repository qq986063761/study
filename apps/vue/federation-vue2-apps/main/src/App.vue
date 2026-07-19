<template>
  <div class="flex h-screen">
    <!-- ===== 左侧菜单 ===== -->
    <el-menu
      :default-active="activeMenu"
      @select="handleMenuSelect"
      class="w-56 flex-shrink-0"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <div class="h-14 flex items-center justify-center text-white text-lg font-bold border-b border-gray-700">
        主应用
      </div>
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/app1" :disabled="loadingMenu !== ''">
        <i :class="loadingMenu === '/app1' ? 'el-icon-loading' : 'el-icon-menu'"></i>
        <span>app1</span>
      </el-menu-item>
      <el-menu-item index="/app2" :disabled="loadingMenu !== ''">
        <i :class="loadingMenu === '/app2' ? 'el-icon-loading' : 'el-icon-menu'"></i>
        <span>app2</span>
      </el-menu-item>
    </el-menu>

    <!-- ===== 右侧内容区 ===== -->
    <div
      class="app-main flex-1 flex flex-col overflow-hidden"
      v-loading="loadingMenu !== ''"
    >
      <!-- 顶部面包屑条 -->
      <div class="h-12 flex items-center px-4 bg-white border-b border-gray-200 text-sm text-gray-600">
        <span>当前位置：</span>
        <span class="text-blue-600">{{ activeMenu === '/' ? '首页' : activeMenu === '/app1' ? 'app1' : 'app2' }}</span>
      </div>
      <!-- 视图区 -->
      <div class="flex-1 p-6 overflow-auto bg-gray-50">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getSubAppNameFromPath, loadSubApp } from './remote'

@Component
export default class App extends Vue {
  loadingMenu = ''

  get activeMenu(): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const path = (this as any).$route.path
    if (path === '/') return '/'
    if (path.startsWith('/app1')) return '/app1'
    if (path.startsWith('/app2')) return '/app2'
    return '/'
  }

  async handleMenuSelect(index: string): Promise<void> {
    const subAppName = getSubAppNameFromPath(index)

    if (subAppName) {
      this.loadingMenu = index
      try {
        await loadSubApp(subAppName)
      } catch (err) {
        console.warn(`[main] 菜单加载子应用失败: ${subAppName}`, err)
        ;(this as any).$message.error(`子应用 ${subAppName} 加载失败，请确认 remoteEntry.js 可访问`)
        return
      } finally {
        this.loadingMenu = ''
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((this as any).$route.path === index) return

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (this as any).$router.push(index)
    } catch (err) {
      if (!err || (err as Error).name !== 'NavigationDuplicated') {
        throw err
      }
    }
  }
}
</script>

<style>
/* 全局重置 —— 去掉默认 margin */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.el-loading-spinner .circular {
  margin: 0 auto;
}

.app-main {
  position: relative;
}
</style>
