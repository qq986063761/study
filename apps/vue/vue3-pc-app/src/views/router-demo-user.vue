<template>
  <div class="demo-user">
    <el-card>
      <template #header>
        <span>动态路由参数 — /router-demo/user/<b>:id</b></span>
      </template>

      <!-- 从 route.params 读取当前用户 ID -->
      <el-result :icon="userId ? 'success' : 'error'" :title="userId ? `当前用户 ID: ${userId}` : '缺少路由参数'">
        <template #sub v-if="userId">
          <p>这个 ID 来自 <el-tag>route.params.id</el-tag>，路由定义为 <code>/router-demo/user/:id</code></p>
          <p style="margin-top: 6px; color: #909399; font-size: 13px">
            注意看顶部路由信息栏中 params 的变化
          </p>
        </template>

        <template #extra>
          <div class="user-nav">
            <el-button @click="goPrev" :disabled="userId <= 1">上一个用户 (id={{ userId - 1 }})</el-button>
            <el-button type="primary" @click="goNext">下一个用户 (id={{ userId + 1 }})</el-button>
            <el-button @click="goRandom">随机跳转</el-button>
          </div>
        </template>
      </el-result>
    </el-card>

    <!-- onBeforeRouteUpdate 说明 -->
    <el-card header="onBeforeRouteUpdate 守卫" style="margin-top: 16px">
      <p>在同一组件内切换 /user/1 → /user/2 时，组件<strong>不会销毁重建</strong>，而是复用。</p>
      <p>路由参数变化次数：<el-tag type="warning" size="large">{{ changeCount }}</el-tag></p>
      <p class="tip">onBeforeRouteUpdate 守卫捕获了这个变化并累计次数</p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 从路由参数中读取 id（类型为 string）
const userId = computed(() => Number(route.params.id) || 0)

// ---- onBeforeRouteUpdate：同一组件、参数变化时触发 ----
const changeCount = ref(0)

onBeforeRouteUpdate((to, from) => {
  changeCount.value++
  ElMessage.success(`路由参数变化：${from.params.id} → ${to.params.id}`)
})

// ---- 导航按钮 ----
const goNext = () => {
  router.push({ name: 'RouterDemoUser', params: { id: String(userId.value + 1) } })
}

const goPrev = () => {
  if (userId.value > 1) {
    router.push({ name: 'RouterDemoUser', params: { id: String(userId.value - 1) } })
  }
}

const goRandom = () => {
  const randomId = Math.floor(Math.random() * 100) + 1
  router.push({ name: 'RouterDemoUser', params: { id: String(randomId) } })
}
</script>

<style lang="scss" scoped>
.demo-user {
  max-width: 700px;
}

.user-nav {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.tip {
  margin-top: 4px;
  font-size: 13px;
  color: #909399;
}
</style>
