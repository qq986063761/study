<template>
  <div class="demo-index">
    <!-- 编程式导航 -->
    <el-card header="编程式导航 (useRouter)">
      <div class="demo-row">
        <span class="label">router.push()：</span>
        <el-button type="primary" @click="router.push('/data')">push '/data'</el-button>
        <el-button type="primary" @click="router.push({ name: 'Component' })">push { name: 'Component' }</el-button>
        <el-button type="primary" @click="router.push({ path: '/router-demo/search', query: { keyword: 'hello' } })">push 带 query</el-button>
      </div>
      <div class="demo-row">
        <span class="label">router.replace()：</span>
        <el-button type="warning" @click="router.replace({ path: '/router-demo', query: { t: Date.now() } })">replace 当前页（不产生历史记录）</el-button>
      </div>
      <div class="demo-row">
        <span class="label">历史栈导航：</span>
        <el-button @click="router.back()">back()</el-button>
        <el-button @click="router.forward()">forward()</el-button>
        <el-button @click="router.go(-2)">go(-2)</el-button>
      </div>
    </el-card>

    <!-- router.resolve -->
    <el-card header="router.resolve() — 解析路由（不跳转）">
      <div class="demo-row">
        <el-input v-model="resolvePath" placeholder="输入路径，如 /router-demo/user/99?foo=bar" style="width: 360px" />
        <el-button @click="doResolve" style="margin-left: 8px">解析</el-button>
      </div>
      <el-input
        v-if="resolveResult"
        type="textarea"
        :rows="6"
        :model-value="resolveResult"
        readonly
        style="margin-top: 10px; font-family: monospace; font-size: 13px"
      />
    </el-card>

    <!-- 子路由入口 -->
    <el-card header="跳转到子 Demo 页面">
      <div class="demo-row">
        <el-button type="success" @click="router.push('/router-demo/user/42')">
          动态路由 params → /router-demo/user/42
        </el-button>
        <el-button type="success" @click="router.push('/router-demo/search')">
          Query 参数 → /router-demo/search
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ---- router.resolve() 演示 ----
const resolvePath = ref('/router-demo/user/99?foo=bar')
const resolveResult = ref('')

const doResolve = () => {
  const resolved = router.resolve(resolvePath.value)
  resolveResult.value = JSON.stringify(resolved, null, 2)
}
</script>

<style lang="scss" scoped>
.demo-index {
  max-width: 800px;
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;

  .label {
    min-width: 130px;
    font-size: 13px;
    color: #606266;
  }
}
</style>
