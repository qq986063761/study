<template>
  <div class="demo-search">
    <el-card header="Query 参数演示 — /router-demo/search">
      <!-- 搜索表单：表单状态与 route.query 双向绑定 -->
      <el-form :model="form" label-width="80px" @submit.prevent="doSearch">
        <el-form-item label="关键词">
          <el-input v-model="form.keyword" placeholder="输入搜索关键词" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category" placeholder="选择分类" clearable style="width: 200px">
            <el-option label="前端" value="frontend" />
            <el-option label="后端" value="backend" />
            <el-option label="运维" value="devops" />
          </el-select>
        </el-form-item>
        <el-form-item label="页码">
          <el-input-number v-model="form.page" :min="1" :max="100" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">router.push 搜索（产生历史）</el-button>
          <el-button type="warning" @click="doReplace">router.replace 搜索（不产生历史）</el-button>
          <el-button @click="doReset">重置所有参数</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 当前 query 展示 -->
    <el-card header="当前 route.query 实时值" style="margin-top: 16px">
      <el-empty v-if="!hasQuery" description="暂无 query 参数，试试上方的搜索按钮" />
      <el-descriptions v-else :column="2" border>
        <el-descriptions-item v-for="(val, key) in route.query" :key="key" :label="String(key)">
          {{ val }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- replace vs push 说明 -->
    <el-card header="push vs replace 对比" style="margin-top: 16px">
      <ul class="compare-list">
        <li><el-tag type="primary">push</el-tag> — 向历史栈添加新记录，点浏览器「后退」可回到上一步</li>
        <li><el-tag type="warning">replace</el-tag> — 替换当前历史记录，点「后退」<strong>不会</strong>回到替换前的状态</li>
      </ul>
      <p class="tip">试试分别用 push 和 replace 搜索，然后点浏览器后退，感受区别</p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 表单模型 — 从 route.query 初始化，保持 URL 与表单同步
const form = reactive({
  keyword: (route.query.keyword as string) || '',
  category: (route.query.category as string) || '',
  page: Number(route.query.page) || 1
})

const hasQuery = computed(() => Object.keys(route.query).length > 0)

// 用 push 写入 query（产生历史记录）
const doSearch = () => {
  router.push({ name: 'RouterDemoSearch', query: buildQuery() })
}

// 用 replace 写入 query（替换当前记录）
const doReplace = () => {
  router.replace({ name: 'RouterDemoSearch', query: buildQuery() })
}

// 清除所有 query 参数
const doReset = () => {
  form.keyword = ''
  form.category = ''
  form.page = 1
  router.push({ name: 'RouterDemoSearch' })
}

// 构建 query 对象，过滤空值
const buildQuery = (): Record<string, string> => {
  const q: Record<string, string> = {}
  if (form.keyword) q.keyword = form.keyword
  if (form.category) q.category = form.category
  if (form.page > 1) q.page = String(form.page)
  return q
}
</script>

<style lang="scss" scoped>
.demo-search {
  max-width: 800px;
}

.compare-list {
  margin: 0;
  padding-left: 18px;

  li {
    margin-bottom: 6px;
    font-size: 14px;
    line-height: 1.6;
  }
}

.tip {
  margin-top: 8px;
  font-size: 13px;
  color: #909399;
}
</style>
