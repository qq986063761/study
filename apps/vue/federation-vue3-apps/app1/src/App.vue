<template>
  <div id="app">
    <div class="standalone-banner">app1 独立运行模式 · 端口 9981</div>
    <main class="standalone-main">
      <router-view />
    </main>
  </div>
</template>

<style>
html,
body,
#app {
  min-height: 100%;
  margin: 0;
}

body {
  color: #1f2937;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

* {
  box-sizing: border-box;
}
</style>

<style scoped>
.standalone-banner {
  background: #2563eb;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
}

.standalone-main {
  padding: 24px;
}
</style>
