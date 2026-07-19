<template>
  <div id="app">
    <SideMenu />
    <div class="main-content">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import SideMenu from './components/SideMenu.vue'
import { mapState } from 'vuex'
import { injectThemeToDocument } from './assets/theme'

export default {
  name: 'App',
  components: {
    SideMenu
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme: {
      handler() {
        // 主题切换时，更新主应用主题
        injectThemeToDocument(document)
      },
      immediate: true
    }
  },
  mounted() {
    // 初始化时注入主题
    injectThemeToDocument(document)
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  display: flex;
}

.main-content {
  flex: 1;
  margin-left: 200px;
  height: 100%;
  overflow: auto;
  background: #f0f2f5; // 柔和灰蓝背景，让卡片更聚焦
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.hello {
  color: red;
}

</style>
