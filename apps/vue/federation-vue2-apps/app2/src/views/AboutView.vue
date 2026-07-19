<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-green-600 mb-4">app2 关于</h1>
    <p class="text-gray-600 mb-4">这是 app2 子应用的关于页视图。</p>
    <el-card shadow="hover">
      <p class="text-sm text-gray-500">
        此页面由 app2 独立构建，通过 Module Federation 暴露给主应用，
        路由前缀自动添加 /app2。
      </p>
    </el-card>
    <router-link to="/app2" class="text-green-500 hover:underline mt-4 inline-block">← 返回 app2 首页</router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AboutView extends Vue {}
</script>
