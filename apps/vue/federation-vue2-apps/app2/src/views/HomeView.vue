<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-green-600 mb-4">app2 首页</h1>
    <p class="text-gray-600 mb-4">这是 app2 子应用的首页视图。</p>
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
    <el-card shadow="hover" class="mb-4">
      <div slot="header" class="font-semibold">app2 Store 状态</div>
      <p class="text-sm text-gray-600">
        appName: <span class="font-mono text-green-600">{{ appName || '未加载' }}</span>
      </p>
      <p class="text-sm text-gray-600 mt-1">
        count: <span class="font-mono text-green-600">{{ count }}</span>
      </p>
      <p class="text-sm text-gray-600 mt-1">
        doubleCount: <span class="font-mono text-green-600">{{ doubleCount }}</span>
      </p>
      <div class="mt-3">
        <el-button type="success" size="mini" @click="increment">
          count +1
        </el-button>
        <el-button type="success" plain size="mini" @click="setCount(10)">
          setCount(10)
        </el-button>
        <el-button type="success" plain size="mini" @click="incrementAsync">
          async +1
        </el-button>
      </div>
    </el-card>
    <el-card shadow="hover" class="mb-4">
      <div slot="header" class="font-semibold">app2 Ajax 演示</div>
      <el-button type="success" size="mini" :loading="ajaxLoading" @click="requestUsers">
        请求 app2 getUsers
      </el-button>
      <pre v-if="ajaxResult" class="mt-3 p-3 text-xs text-gray-700 bg-gray-50 border border-gray-200 whitespace-pre-wrap break-all">{{ ajaxResult }}</pre>
    </el-card>
    <el-card shadow="hover" class="mb-4">
      <div slot="header" class="font-semibold">跨应用全局弹窗演示</div>
      <el-button type="success" plain size="mini" :loading="globalModalLoading" @click="showApp1GlobalModal">
        调用 app1 modal.show
      </el-button>
    </el-card>
    <!-- 跨应用联邦组件：由 app1 提供，主应用全局懒加载注册。
         点击其内部按钮会先加载 app1 模块再跳转 app1 路由。 -->
    <app1-card class="mb-4" />
    <router-link to="/app2/about" class="text-green-500 hover:underline">→ 进入 app2 关于页</router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { ajax, ui } from '@main/runtime'

@Component({
  computed: {
    ...mapState('app2', ['appName', 'count']),
    ...mapGetters('app2', ['doubleCount'])
  },
  methods: {
    ...mapMutations('app2', ['increment', 'setCount']),
    ...mapActions('app2', ['incrementAsync'])
  }
})
export default class HomeView extends Vue {
  appName!: string
  count!: number
  doubleCount!: number
  ajaxLoading = false
  globalModalLoading = false
  ajaxResult = ''
  increment!: () => void
  setCount!: (payload: number) => void
  incrementAsync!: () => void

  async requestUsers(): Promise<void> {
    this.ajaxLoading = true
    try {
      const response = await ajax.app2('getUsers', { source: 'app2-home' })
      this.ajaxResult = this.formatAjaxResult(response)
      this.$message.success('app2 接口请求完成')
    } catch (error) {
      console.error('[app2] getUsers 请求失败:', error)
      this.$message.error('app2 接口请求失败，请查看控制台')
    } finally {
      setTimeout(() => {
        this.ajaxLoading = false
      }, 100)
    }
  }

  async showApp1GlobalModal(): Promise<void> {
    this.globalModalLoading = true
    try {
      // 由 main runtime 提供：首次调用会懒加载 app1 的 './global-components' 并创建 modal 单例。
      await ui.app1('modal', 'show', {
        title: 'app1 全局弹窗',
        content: '这是从 app2 页面调用 app1 暴露的 modal.show。',
        payload: {
          source: 'app2-home'
        }
      })
      this.$message.success('app1 全局弹窗已调用')
    } catch (error) {
      console.error('[app2] 调用 app1 modal.show 失败:', error)
      this.$message.error('调用 app1 全局弹窗失败，请查看控制台')
    } finally {
      this.globalModalLoading = false
    }
  }

  private formatAjaxResult(response: unknown): string {
    // 接口响应通常是 AxiosResponse，演示区只展示 data，避免输出过多运行时对象。
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
