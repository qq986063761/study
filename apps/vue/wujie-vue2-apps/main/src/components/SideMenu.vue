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
        :key="item.routeName"
        :class="{ active: currentRouteName === item.routeName }"
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
    currentTheme() {
      return this.theme
    },
    themeColor() {
      return colors[this.theme]?.primary || colors.light.primary
    }
  },
  watch: {
    theme: {
      handler() {
        // 主题切换后，更新当前激活的子应用主题
        this.updateActiveChildAppTheme()
        // 更新主应用主题
        this.updateMainAppTheme()
      },
      immediate: false
    }
  },
  methods: {
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
    },
    updateActiveChildAppTheme() {
      // 获取当前路由对应的子应用
      const currentRouteName = this.$route.name
      const activeApp = this.menuItems.find(item => item.routeName === currentRouteName)?.childApp
      
      if (activeApp) {
        const appWindow = window.$app?.apps?.[activeApp]?.window
        if (appWindow && appWindow.document) {
          const { injectThemeToDocument } = require('@/assets/theme')
          injectThemeToDocument(appWindow.document)
        }
      }
    },
    updateMainAppTheme() {
      // 更新主应用主题
      const { injectThemeToDocument } = require('@/assets/theme')
      injectThemeToDocument(document)
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
