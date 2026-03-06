<template>
  <!-- 应用主容器 -->
  <div class="app-container">
    <!-- 左侧菜单导航栏 -->
    <nav class="side-menu">
      <!-- 菜单头部 -->
      <div class="menu-header">
        <h2>菜单</h2>
      </div>
      <!-- 菜单列表 -->
      <ul class="menu-list">
        <!-- 
          循环渲染菜单项 
          v-for: 遍历menuItems数组
          :key: 为每个列表项提供唯一标识符
          :class: 动态添加active类，当前路由匹配时高亮显示
          @click: 点击事件处理器，切换菜单
        -->
        <li 
          v-for="(item, index) in menuItems" 
          :key="index"
          :class="{ active: $route.name === item.value }"
          @click="switchMenu(item)"
        >
          <!-- 菜单图标 -->
          <span class="menu-icon">{{ item.icon }}</span>
          <!-- 菜单文本 -->
          <span class="menu-text">{{ item.title }}</span>
        </li>
      </ul>
    </nav>

    <!-- 右侧内容区域 -->
    <main class="content-area">
      <!-- 
        路由视图过渡动画
        transition: 添加页面切换动画效果
        name: 定义动画名称
        mode: out-in表示先离开再进入
      -->
      <transition name="fade-transform" mode="out-in">
        <!-- 路由组件渲染区域 -->
        <router-view class="content-wrapper"></router-view>
      </transition>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      // 菜单项配置数组
      menuItems: [
        {
          title: '甘特图',      // 菜单显示名称
          icon: '🏠',          // 菜单图标（表情符号）
          value: 'gantt'       // 路由名称，用于匹配当前路由
        },
        {
          title: '安全验证',
          icon: '📦',
          value: 'password'
        },
        {
          title: '统计图表',
          icon: '⚙️',
          value: 'sta'
        },
        {
          title: '@web',
          icon: 'ℹ️',
          value: 'atWeb'
        },
        {
          title: '@link',
          icon: '🔗',
          value: 'atLink'
        }
      ]
    }
  },
  methods: {
    /**
     * 菜单切换方法
     * @param {Object} item - 菜单项对象
     */
    switchMenu(item) {
      // 如果当前路由已经是目标路由，则不进行跳转
      if (this.$route.name === item.value) return
      
      // 使用编程式导航跳转到目标路由
      this.$router.push({ name: item.value })
    }
  }
}
</script>

<style lang="scss">
/* 应用主容器样式 */
.app-container {
  display: flex;              // 使用flex布局
  height: 100%;               // 占满整个视口高度
  background-color: $gray-50; // 使用主题变量的背景色
}

/* 左侧菜单样式 */
.side-menu {
  width: 240px;               // 固定宽度
  background: linear-gradient(135deg, $primary-600, $primary-800); // 渐变背景
  padding: $spacing-lg;       // 内边距
  box-shadow: $shadow-lg;     // 阴影效果
  position: relative;         // 相对定位
  overflow: hidden;           // 隐藏溢出内容

  /* 菜单背景装饰层 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba($primary-400, 0.1), transparent);
    z-index: 1;               // 层级设置
  }

  /* 菜单头部样式 */
  .menu-header {
    color: $gray-50;          // 文字颜色
    margin-bottom: $spacing-xl; // 底部间距
    position: relative;       // 相对定位
    z-index: 2;               // 确保在装饰层之上

    h2 {
      font-family: $font-family-base; // 字体家族
      font-size: 1.5rem;            // 字体大小
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); // 文字阴影
    }
  }

  .menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
    z-index: 2;

    li {
      padding: $spacing-md $spacing-lg;
      margin-bottom: $spacing-sm;
      color: $gray-50;
      border-radius: $radius-md;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      width: 98%;
      margin-left: -17px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 0;
        background: rgba($primary-300, 0.2);
        transition: width 0.3s ease;
      }

      &:hover {
        transform: translateX($spacing-sm);
        background: rgba($primary-400, 0.2);

        &::before {
          width: 100%;
        }
      }

      &.active {
        background: rgba($primary-300, 0.3);
        transform: translateX($spacing-md);
        box-shadow: $shadow-md;

        &::before {
          width: 100%;
        }
      }

      .menu-icon {
        margin-right: $spacing-md;
        font-size: 1.2rem;
      }

      .menu-text {
        font-size: 1rem;
        font-weight: 500;
      }
    }
  }
}

.content-area {
  flex: 1;
  padding: $spacing-xl;
  background-color: $gray-50;
  position: relative;
  overflow: auto;

  .content-wrapper {
    position: relative;
    background-color: $gray-50;
    padding: $spacing-xl;
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    min-height: 100%;
    border: 1px solid $gray-200;
  }
}

// 内容切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
