<template>
  <div class="side-menu">
    <div class="menu-header">
      <h2>微前端应用</h2>
      <el-tooltip 
        :content="currentTheme === 'light' ? '当前为浅色主题' : '当前为深色主题'"
        placement="bottom"
      >
        <button 
          class="theme-toggle-btn" 
          :style="{ backgroundColor: themeColor }"
          @click="toggleTheme"
        ></button>
      </el-tooltip>
    </div>
    <ul class="menu-list">
      <li 
        v-for="item in menuItems" 
        :key="item.childApp || item.routeName"
        :class="{ active: isMenuActive(item) }"
        @click="navigateTo(item)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { colors } from '@/assets/theme'

export default {
  name: 'SideMenu',
  data() {
    return {
      menuItems: [
        {
          routeName: 'home',
          name: '首页',
          icon: 'el-icon-house'
        },
        {
          routeName: 'child1',
          name: 'Child1',
          icon: 'el-icon-document',
          childApp: 'child1',
          childRoute: {
            name: 'home',
            params: { init: true },
            query: {}
          }
        },
        {
          routeName: 'child2',
          name: 'Child2',
          icon: 'el-icon-folder',
          childApp: 'child2',
          childRoute: {
            name: 'home',
            params: { init: true },
            query: {}
          }
        }
      ]
    }
  },
  computed: {
    ...mapState(['theme']),
    currentRouteName() {
      return this.$route.name
    },
    /** 当前激活的子应用（由 path /child1* 或 /child2* 推断） */
    currentChildApp() {
      const path = this.$route.path || ''
      if (path.startsWith('/child1')) return 'child1'
      if (path.startsWith('/child2')) return 'child2'
      return null
    },
    currentTheme() {
      return this.theme
    },
    themeColor() {
      return colors[this.theme]?.primary || colors.light.primary
    }
  },
  methods: {
    /** 菜单项是否激活：首页看 routeName，子应用看 currentChildApp（因子应用有 /child1、/child1/home 等多条路由） */
    isMenuActive(item) {
      if (item.childApp) return this.currentChildApp === item.childApp
      return this.currentRouteName === item.routeName
    },
    ...mapActions(['toggleTheme']),
    navigateTo(item) {
      const { routeName, childApp, childRoute } = item

      // 子应用跳转
      if (childApp) {
        window.$app.to({
          app: childApp,
          ...childRoute
        })
      } else {
        this.$router.push({ name: routeName })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.side-menu {
  width: 200px;
  height: 100vh;
  background: #304156;
  color: #bfcbd9;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;

  .menu-header {
    padding: 20px;
    border-bottom: 1px solid #434a50;
    display: flex;
    align-items: center;
    
    h2 {
      color: #fff;
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }

    .theme-toggle-btn {
      margin-left: 8px;
      width: 24px;
      height: 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      flex-shrink: 0;

      &:hover {
        opacity: 0.8;
        transform: scale(1.1);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  .menu-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 15px 20px;
      cursor: pointer;
      transition: all 0.3s;
      border-bottom: 1px solid #434a50;
      display: flex;
      align-items: center;

      &:hover {
        background: #263445;
        color: #fff;
      }

      &.active {
        background: #409eff;
        color: #fff;
      }

      i {
        margin-right: 10px;
        font-size: 16px;
      }

      span {
        font-size: 14px;
      }
    }
  }
}
</style>
