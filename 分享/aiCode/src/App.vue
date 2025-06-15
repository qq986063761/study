<template>
  <div class="app-container">
    <!-- 左侧菜单 -->
    <nav class="side-menu">
      <div class="menu-header">
        <h2>菜单</h2>
      </div>
      <ul class="menu-list">
        <li 
          v-for="(item, index) in menuItems" 
          :key="index"
          :class="{ active: $route.name === item.value }"
          @click="switchMenu(item)"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-text">{{ item.title }}</span>
        </li>
      </ul>
    </nav>

    <!-- 右侧内容区 -->
    <main class="content-area">
      <transition name="fade-transform" mode="out-in">
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
      menuItems: [
        {
          title: '甘特图',
          icon: '🏠',
          value: 'gantt'
        },
        {
          title: '安全验证',
          icon: '📦',
          value: 'password'
        },
        // {
        //   title: '服务',
        //   icon: '⚙️',
        // },
        // {
        //   title: '关于',
        //   icon: 'ℹ️',
        // }
      ]
    }
  },
  methods: {
    switchMenu(item) {
      if (this.$route.name === item.value) return
      this.$router.push({ name: item.value })
    }
  }
}
</script>

<style lang="scss">
.app-container {
  display: flex;
  height: 100%;
  background-color: $gray-50;
}

.side-menu {
  width: 240px;
  background: linear-gradient(135deg, $primary-600, $primary-800);
  padding: $spacing-lg;
  box-shadow: $shadow-lg;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba($primary-400, 0.1), transparent);
    z-index: 1;
  }

  .menu-header {
    color: $gray-50;
    margin-bottom: $spacing-xl;
    position: relative;
    z-index: 2;

    h2 {
      font-family: $font-family-base;
      font-size: 1.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
    background-color: $gray-50;
    padding: $spacing-xl;
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    height: 100%;
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
