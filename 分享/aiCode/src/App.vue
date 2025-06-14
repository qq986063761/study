<template>
  <div id="app">
    <el-menu
      class="app-menu"
      router
      default-active="ganttDemo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="ganttDemo">
        <i class="el-icon-setting"></i>
        <span slot="title">甘特图</span>
      </el-menu-item>
      <el-menu-item index="ganttDemo1">
        <i class="el-icon-setting"></i>
        <span slot="title">甘特图（演示）</span>
      </el-menu-item>
      <el-menu-item index="password">
        <i class="el-icon-setting"></i>
        <span slot="title">安全输入密码</span>
      </el-menu-item>
      <el-menu-item index="password1">
        <i class="el-icon-setting"></i>
        <span slot="title">安全输入密码（演示）</span>
      </el-menu-item>
    </el-menu>
    <router-view class="app-view"/>
  </div>
</template>

<style lang="scss">
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow: hidden;
}

* {
  box-sizing: border-box;
}

#app {
  display: flex;
  height: 100%;
  width: 100%;
}

.app-menu {
  width: 200px;
  height: 100%;
  flex-shrink: 0;
}

.app-view {
  flex: 1;
  height: 100%;
  overflow: auto;
  min-width: 0;
}
</style>
