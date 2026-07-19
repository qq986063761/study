<template>
  <div class="router-demo-layout">
    <!-- 顶部：实时路由信息 -->
    <el-alert type="info" :closable="false" class="route-info-bar">
      <template #title>
        <span>
          当前路由：
          <el-tag size="small" type="primary">{{ route.path }}</el-tag>
          <el-tag size="small" type="success" style="margin-left: 6px">name: {{ route.name }}</el-tag>
          <el-tag size="small" type="warning" style="margin-left: 6px" v-if="Object.keys(route.params).length">params: {{ route.params }}</el-tag>
          <el-tag size="small" type="danger" style="margin-left: 6px" v-if="Object.keys(route.query).length">query: {{ route.query }}</el-tag>
        </span>
      </template>
    </el-alert>

    <!-- 导航标签页 -->
    <el-tabs v-model="activeTab" class="demo-tabs">
      <el-tab-pane label="概览 / 编程式导航" :name="tabIndex" />
      <el-tab-pane label="动态路由参数 params" :name="tabParams" />
      <el-tab-pane label="Query 参数" :name="tabSearch" />
    </el-tabs>

    <!-- 子路由渲染区 -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 三个 tab 的标识名
const basePath = '/router-demo'
const tabIndex = basePath
const tabParams = basePath + '/user/42'
const tabSearch = basePath + '/search'

// 用本地 ref 管理 tab 激活态，避免 route.path ↔ el-tabs 循环绑定导致 slot 警告
const activeTab = ref(getActiveTab(route.path))

// 路由变化 → 同步 tab
watch(() => route.path, (path) => {
  activeTab.value = getActiveTab(path)
})

// tab 切换 → 路由跳转
watch(activeTab, (name) => {
  if (name !== route.path) {
    router.push(name)
  }
})

/* 将当前路径映射到对应的 tab name */
function getActiveTab(path: string): string {
  if (path.startsWith(basePath + '/search')) return tabSearch
  if (path.startsWith(basePath + '/user/')) return tabParams
  return tabIndex
}
</script>

<style lang="scss" scoped>
.router-demo-layout {
  padding: 16px 20px;
}

.route-info-bar {
  margin-bottom: 16px;
}

.demo-tabs {
  margin-bottom: 16px;
}
</style>
