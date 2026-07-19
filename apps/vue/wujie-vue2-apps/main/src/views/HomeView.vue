<template>
  <div class="home">
    <el-card class="card theme-demo-card" shadow="hover">
      <template #header>
        <span>主应用主题色</span>
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
        <span>不加载子应用直接使用组件</span>
      </template>
      <Child1Button />
    </el-card>

    <el-card class="card" shadow="hover">
      <template #header>
        <span>主应用用户数据管理（更新后通知子应用同步）</span>
      </template>
      <div class="usrs-management">
        <el-button type="primary" @click="addRandomUser" style="margin-bottom: 16px;">
          添加随机用户
        </el-button>
        <el-table :data="usrs" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="role" label="角色" width="100"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="deleteUser(scope.row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

// @ is an alias to /src
export default {
  name: 'HomeView',
  computed: {
    ...mapState(['usrs'])
  },
  methods: {
    ...mapActions(['addUsr', 'deleteUsr']),
    addRandomUser() {
      const names = ['赵六', '钱七', '孙八', '周九', '吴十']
      const roles = ['管理员', '用户', '访客']
      const randomName = names[Math.floor(Math.random() * names.length)]
      const randomRole = roles[Math.floor(Math.random() * roles.length)]
      const newId = Math.max(...this.usrs.map(u => u.id), 0) + 1
      
      this.addUsr({
        id: newId,
        name: randomName,
        email: `${randomName.toLowerCase()}@example.com`,
        role: randomRole
      })
    },
    deleteUser(id) {
      this.deleteUsr(id)
      this.$message.success('删除成功')
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
