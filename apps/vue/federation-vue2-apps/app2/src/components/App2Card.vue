<template>
  <el-card shadow="hover" class="app2-card">
    <div slot="header" class="font-semibold text-green-600">
      app2 联邦组件（App2Card）
    </div>
    <p class="text-sm text-gray-600 mb-3">
      我由 app2 构建并通过 Module Federation 暴露，现被主应用懒加载渲染在此页面。
    </p>
    <div class="flex flex-wrap gap-2">
      <el-button type="success" size="small" :loading="requestLoading" @click="requestUsers">
        请求 app2 getUsers
      </el-button>
      <el-button type="success" plain size="small" :loading="jumping" @click="goApp2Route">
        跳转 app2 关于页 →
      </el-button>
    </div>
    <pre v-if="ajaxResult" class="mt-3 p-3 text-xs text-gray-700 bg-gray-50 border border-gray-200 whitespace-pre-wrap break-all">{{ ajaxResult }}</pre>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { isNavigationFailure } from 'vue-router'
import { ajax } from '@main/runtime'

@Component
export default class App2Card extends Vue {
  // 跳转中（含 app2 模块懒加载耗时）
  jumping = false
  requestLoading = false
  ajaxResult = ''

  async requestUsers(): Promise<void> {
    this.requestLoading = true
    try {
      const response = await ajax.app2('getUsers', { source: 'app2-card' })
      this.ajaxResult = this.formatAjaxResult(response)
      this.$message.success('app2 组件接口请求完成')
    } catch (error) {
      console.error('[app2-card] getUsers 请求失败:', error)
      this.$message.error('app2 组件接口请求失败，请查看控制台')
    } finally {
      this.requestLoading = false
    }
  }

  async goApp2Route(): Promise<void> {
    const target = '/app2/about'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const self = this as any
    if (self.$route && self.$route.path === target) return

    this.jumping = true
    try {
      // 主应用 router 守卫会在 app2 模块未加载时先 loadSubApp('app2')，
      // 加载并注册路由后再放行，因此这里的 await 会一直等到模块就绪并完成跳转。
      await self.$router.push(target)
    } catch (err) {
      // 守卫内 next(redirect) 会让本次 push 以「重定向/重复导航」失败收场，属预期，忽略之
      if (!isNavigationFailure(err)) {
        throw err
      }
    } finally {
      this.jumping = false
    }
  }

  private formatAjaxResult(response: unknown): string {
    const data = response && typeof response === 'object' && 'data' in response
      ? (response as { data: unknown }).data
      : response

    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  }
}
</script>

<style scoped>
.app2-card {
  border-left: 4px solid #67c23a;
}
</style>
