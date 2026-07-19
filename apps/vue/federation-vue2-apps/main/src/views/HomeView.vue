<template>
  <div class="home-view">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">欢迎使用主应用</h1>
    <p class="text-gray-600 mb-6">这是主应用的首页，通过左侧菜单可切换各子应用。</p>

    <el-card shadow="hover" class="mb-4">
      <div slot="header" class="font-semibold">i18n 语言资源演示</div>
      <div class="mb-3">
        <el-button size="mini" :type="$i18n.locale === 'zh-CN' ? 'primary' : 'default'" @click="$i18n.locale = 'zh-CN'">
          中文
        </el-button>
        <el-button size="mini" :type="$i18n.locale === 'en-US' ? 'primary' : 'default'" @click="$i18n.locale = 'en-US'">
          English
        </el-button>
      </div>
      <p class="text-sm text-gray-600">main: {{ $t('main.message') }}</p>
      <p class="text-sm text-gray-600 mt-1">app1: {{ $t('app1.message') }}</p>
      <p class="text-sm text-gray-600 mt-1">app2: {{ $t('app2.message') }}</p>
    </el-card>

    <div class="grid grid-cols-2 gap-4">
      <!-- app1 卡片 -->
      <el-card shadow="hover">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-blue-600 mb-2">app1</h3>
          <p class="text-sm text-gray-500">子应用一，提供独立 routes、store、ajax</p>
          <el-button type="primary" size="small" class="mt-3" @click="$router.push('/app1')">进入 app1</el-button>
        </div>
      </el-card>

      <!-- app2 卡片 -->
      <el-card shadow="hover">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-green-600 mb-2">app2</h3>
          <p class="text-sm text-gray-500">子应用二，提供独立 routes、store、ajax</p>
          <el-button type="success" size="small" class="mt-3" @click="$router.push('/app2')">进入 app2</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class HomeView extends Vue {}
</script>
