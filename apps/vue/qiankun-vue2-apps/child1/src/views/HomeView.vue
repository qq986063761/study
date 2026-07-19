<template>
  <div class="home">
    <el-card class="card theme-demo-card" shadow="hover">
      <template #header>
        <span>子应用主题色</span>
      </template>
      <div class="theme-colors">
        <div class="color-block color-primary">Primary</div>
        <div class="color-block color-success">Success</div>
        <div class="color-block color-warning">Warning</div>
        <div class="color-block color-danger">Danger</div>
        <div class="color-block color-info">Info</div>
      </div>
    </el-card>

    <el-card class="card" shadow="hover">
      <template #header>
        <span>切换子应用后返回，数据能被缓存</span>
      </template>
      <el-input v-model="input" placeholder="请输入内容，切换子应用返回能保存状态"/>
    </el-card>

    <el-card class="card" shadow="hover">
      <template #header>
        <span>跨应用跳转路由</span>
      </template>
      <el-button type="danger" @click="handleClick">跳转到 child2 的 about 页面</el-button>
    </el-card>

    <el-card class="card" shadow="hover">
      <template #header>
        <span>子应用用户数据展示（从主应用同步）</span>
      </template>
      <div class="usrs-display">
        <el-alert
          v-if="usrs.length === 0"
          title="暂无用户数据"
          type="info"
          :closable="false"
          style="margin-bottom: 16px;">
        </el-alert>
        <el-table v-else :data="usrs" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="role" label="角色" width="100"></el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HomeView',
  data() {
    return {
      input: ''
    }
  },
  computed: {
    ...mapState(['usrs'])
  },
  mounted() {
    // 初始化时从主应用同步数据
    this.syncUsrsFromMain()
  },
  methods: {
    handleClick() {
      // 优先用无界to（跨域安全），同域或独立运行时回退到 window.parent
      const { to } = window.$app
      
      to({
        app: 'child2',
        name: 'about',
        query: {},
        params: {}
      })
    },
    syncUsrsFromMain() {
      // 从主应用获取初始数据
      const parentApp = window.$parentApp
      if (parentApp && parentApp.store && parentApp.store.state.usrs) {
        this.$store.commit('SET_USRS', parentApp.store.state.usrs)
      }
    }
  }
}
</script>

<style lang="scss">
.home {
  padding: 20px;
  min-height: 100%;

  .card {
    margin-bottom: 20px;
    border-radius: 8px;
  }

  .theme-demo-card {
    .theme-colors {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .color-block {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 500;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .color-primary {
      background-color: var(--primary);
    }

    .color-success {
      background-color: var(--success);
    }

    .color-warning {
      background-color: var(--warning);
    }

    .color-danger {
      background-color: var(--danger);
    }

    .color-info {
      background-color: var(--info);
    }
  }
}
</style>
