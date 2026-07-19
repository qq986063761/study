<script setup lang="ts">
const metrics = [
  { label: '今日订单', value: '128' },
  { label: '活跃客户', value: '36' },
  { label: '转化率', value: '18%' },
]
</script>

<template>
  <main class="child-app app-one">
    <section class="hero">
      <p>Wujie Child App</p>
      <h1>App1 业务看板</h1>
      <span>localhost:8081</span>
    </section>

    <section class="metric-grid">
      <article v-for="item in metrics" :key="item.label">
        <small>{{ item.label }}</small>
        <strong>{{ item.value }}</strong>
      </article>
    </section>

    <section class="panel">
      <h2>App1 页面内容</h2>
      <p>这个页面来自 app1 子项目，既可以独立打开，也可以被 main 通过无界微前端加载。</p>
    </section>
  </main>
</template>

<style scoped>
.child-app {
  min-height: 100vh;
  padding: 28px;
  color: #163024;
  background: #f5fbf7;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.hero,
.panel,
.metric-grid article {
  border: 1px solid #b7dcc6;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 14px 32px rgb(27 67 50 / 0.08);
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
  color: #2d6a4f;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero h1 {
  color: #1b4332;
  font-size: clamp(30px, 5vw, 48px);
  line-height: 1.05;
}

.hero span {
  width: max-content;
  border-radius: 999px;
  padding: 7px 11px;
  color: #ffffff;
  background: #2d6a4f;
  font-size: 12px;
  font-weight: 800;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.metric-grid article {
  display: grid;
  gap: 8px;
  min-height: 112px;
  align-content: center;
  padding: 20px;
}

.metric-grid small {
  color: #5f766a;
  font-size: 13px;
}

.metric-grid strong {
  color: #1b4332;
  font-size: 30px;
}

.panel {
  margin-top: 16px;
  padding: 22px;
}

.panel h2 {
  color: #1b4332;
  font-size: 22px;
}

.panel p {
  margin-top: 10px;
  color: #506558;
  line-height: 1.75;
}

@media (max-width: 720px) {
  .child-app {
    padding: 18px;
  }

  .metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>
