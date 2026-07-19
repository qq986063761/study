<script setup lang="ts">
import { microAppList } from '@/micro-apps'

const stats = [
  { label: '主应用端口', value: '8080' },
  { label: '子应用数量', value: String(microAppList.length) },
  { label: '微前端框架', value: 'Wujie' },
]
</script>

<template>
  <section class="home-page">
    <div class="hero">
      <p class="eyebrow">Main Application</p>
      <h1>主应用首页</h1>
      <p class="lead">这里是 main 项目自己的页面，左右结构和微应用入口都由主应用管理。</p>
    </div>

    <div class="stats">
      <article v-for="item in stats" :key="item.label" class="stat-card">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </article>
    </div>

    <section class="micro-list">
      <header>
        <p class="eyebrow">Micro Apps</p>
        <h2>已接入子应用</h2>
      </header>

      <div class="app-grid">
        <article v-for="app in microAppList" :key="app.name" class="app-card">
          <div>
            <h3>{{ app.label }}</h3>
            <p>{{ app.summary }}</p>
          </div>
          <span>localhost:{{ app.port }}</span>
        </article>
      </div>
    </section>
  </section>
</template>

<style scoped>
.home-page {
  display: flex;
  min-height: calc(100vh - 48px);
  flex-direction: column;
  gap: 20px;
}

.hero {
  display: grid;
  align-content: end;
  min-height: 220px;
  border-radius: 8px;
  padding: 32px;
  color: #ffffff;
  background:
    linear-gradient(135deg, rgb(20 33 61 / 0.94), rgb(35 57 93 / 0.78)),
    radial-gradient(circle at 82% 20%, #f4d35e 0 12%, transparent 13% 100%),
    #14213d;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2d6a4f;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero .eyebrow {
  color: #f4d35e;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h1 {
  font-size: clamp(32px, 6vw, 56px);
  line-height: 1;
}

.lead {
  max-width: 620px;
  margin-top: 16px;
  color: #e6edf7;
  font-size: 16px;
  line-height: 1.7;
}

.stats,
.app-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.stat-card,
.app-card,
.micro-list {
  border: 1px solid #d8e0ea;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 30px rgb(20 33 61 / 0.06);
}

.stat-card {
  display: grid;
  gap: 8px;
  min-height: 108px;
  align-content: center;
  padding: 20px;
}

.stat-card span,
.app-card p {
  color: #6b778c;
  font-size: 13px;
}

.stat-card strong {
  color: #14213d;
  font-size: 28px;
}

.micro-list {
  display: grid;
  gap: 18px;
  padding: 22px;
}

.micro-list h2 {
  color: #172033;
  font-size: 22px;
}

.app-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.app-card {
  display: flex;
  min-height: 112px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
}

.app-card h3 {
  color: #14213d;
  font-size: 18px;
}

.app-card p {
  margin-top: 8px;
}

.app-card span {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 7px 10px;
  color: #1b4332;
  background: #d8f3dc;
  font-size: 12px;
  font-weight: 800;
}

@media (max-width: 900px) {
  .stats,
  .app-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .home-page {
    min-height: auto;
  }

  .hero {
    min-height: 190px;
    padding: 24px;
  }

  .app-card {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
