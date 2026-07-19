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
        <span>不加载应用直接使用其他应用组件</span>
      </template>
      <Child1Button />
    </el-card>

    <el-card class="card" shadow="hover">
      <template #header>
        <span>跨应用调用组件</span>
      </template>
      <el-button type="danger" @click="openChild1Modal">
        打开 child1 弹窗
      </el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    openChild1Modal() {
      const { use } = window.$app

      use({
        name: 'modal',
        method: 'show',
        args: [{
          title: 'child2 调用 child1 弹窗',
          content: 'child2 调用 child1 弹窗内容',
          onConfirm: data => {
            console.log('child1 弹窗回调 onConfirm', data)
          },
          onCancel: data => {
            console.log('child1 弹窗回调 onCancel', data)
          }
        }]
      })
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
