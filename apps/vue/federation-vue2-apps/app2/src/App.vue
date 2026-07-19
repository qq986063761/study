<template>
  <div id="app">
    <!-- 子应用独立运行时使用，被主应用联邦加载时此模板不渲染 -->
    <div class="bg-green-600 text-white px-4 py-2 text-sm">
      app2 独立运行模式 — 端口 8082
    </div>
    <router-view />
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
}
</style>
