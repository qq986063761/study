<template>
  <main class="sub-home app2-home">
    <p class="label">App2</p>
    <h2>子应用 App2 首页</h2>
    <p>当前页面可以独立运行，也可以由 main 通过 qiankun 挂载到右侧主体区域。</p>
  </main>
</template>

<style scoped>
.sub-home {
  min-height: calc(100vh - 142px);
  padding: 32px;
  background:
    linear-gradient(135deg, rgba(59, 130, 246, 0.12), transparent 38%),
    #ffffff;
}

.label {
  margin: 0 0 12px;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

h2 {
  margin: 0 0 12px;
  color: #102033;
  font-size: 28px;
}

p:last-child {
  max-width: 620px;
  margin: 0;
  color: #4b5563;
  line-height: 1.7;
}
</style>
