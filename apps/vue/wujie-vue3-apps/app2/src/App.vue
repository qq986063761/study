<script setup lang="ts">
const items = [
  { label: '待办事项', value: '12' },
  { label: '已完成', value: '47' },
  { label: '团队成员', value: '9' },
]
</script>

<template>
  <main class="child-app app-two">
    <section class="hero">
      <p>Wujie Child App</p>
      <h1>App2 项目中心</h1>
      <span>localhost:8082</span>
    </section>

    <section class="summary-grid">
      <article v-for="item in items" :key="item.label">
        <small>{{ item.label }}</small>
        <strong>{{ item.value }}</strong>
      </article>
    </section>

    <section class="panel">
      <h2>App2 页面内容</h2>
      <p>这个页面来自 app2 子项目，用另一套视觉和数据来区分不同微应用的加载结果。</p>
    </section>
  </main>
</template>

<style scoped>
.child-app {
  min-height: 100vh;
  padding: 28px;
  color: #263244;
  background: #f7f7fb;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.hero,
.panel,
.summary-grid article {
  border: 1px solid #d8d5e5;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 14px 32px rgb(63 55 88 / 0.08);
}

.hero {
  display: grid;
  gap: 10px;
  padding: 28px;
}

p,
h1,
h2 {
  margin: 0;
}

.hero p {
  color: #6d597a;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero h1 {
  color: #293241;
  font-size: clamp(30px, 5vw, 48px);
  line-height: 1.05;
}

.hero span {
  width: max-content;
  border-radius: 999px;
  padding: 7px 11px;
  color: #ffffff;
  background: #6d597a;
  font-size: 12px;
  font-weight: 800;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.summary-grid article {
  display: grid;
  gap: 8px;
  min-height: 112px;
  align-content: center;
  padding: 20px;
}

.summary-grid small {
  color: #6f7280;
  font-size: 13px;
}

.summary-grid strong {
  color: #293241;
  font-size: 30px;
}

.panel {
  margin-top: 16px;
  padding: 22px;
}

.panel h2 {
  color: #293241;
  font-size: 22px;
}

.panel p {
  margin-top: 10px;
  color: #596171;
  line-height: 1.75;
}

@media (max-width: 720px) {
  .child-app {
    padding: 18px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
