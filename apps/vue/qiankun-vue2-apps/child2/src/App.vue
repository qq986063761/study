<template>
  <div id="app">
    <nav class="child2-nav">
      <span
        class="nav-link"
        :class="{ active: $route.name === 'home' }"
        @click="go('home')"
      >Home</span>
      |
      <span
        class="nav-link"
        :class="{ active: $route.name === 'about' }"
        @click="go('about')"
      >About</span>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    go(name) {
      this.$router.push({ name })
    }
  },
  mounted() {
    console.log('child2 App mounted', window.__POWERED_BY_QIANKUN__ ? 'qiankun' : 'standalone', window.location.href)
  }
}
</script>

<style lang="scss" scoped>
/* 仅作用于子应用根及其子节点，不污染主应用 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  overflow: auto;
}

.child2-nav {
  padding: 30px;
  text-align: center;

  .nav-link {
    font-weight: bold;
    color: #2c3e50;
    cursor: pointer;

    &.active {
      color: #42b983;
    }
  }
}
</style>
