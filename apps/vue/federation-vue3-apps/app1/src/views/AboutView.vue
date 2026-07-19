<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const homePath = computed(() => (route.path.startsWith('/app1') ? '/app1' : '/'))
</script>

<template>
  <div class="about-page">
    <h1>app1 关于</h1>
    <p>这是 app1 子应用的关于页视图。</p>
    <el-card shadow="hover">
      <p>
        此页面由 app1 独立构建，通过 Module Federation 暴露给主应用，路由前缀由主应用自动添加
        /app1。
      </p>
    </el-card>
    <router-link :to="homePath" class="page-link">返回 app1 首页</router-link>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 760px;
}

h1 {
  margin: 0 0 12px;
  color: #2563eb;
  font-size: 28px;
}

p {
  color: #667085;
  line-height: 1.7;
}

.page-link {
  display: inline-flex;
  margin-top: 16px;
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}
</style>
