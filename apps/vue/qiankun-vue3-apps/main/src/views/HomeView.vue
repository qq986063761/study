<template>
  <div class="home-view">
    <section class="hero">
      <p class="label">Main Home</p>
      <h2>主应用首页</h2>
      <p>这里是 main 自己的内部页面，左侧 App1 和 App2 菜单会通过 qiankun 挂载子应用首页。</p>
    </section>

    <div class="stats">
      <article>
        <span>main</span>
        <strong>5173</strong>
      </article>
      <article>
        <span>app1</span>
        <strong>5174</strong>
      </article>
      <article>
        <span>app2</span>
        <strong>5175</strong>
      </article>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  display: grid;
  gap: 20px;
}

.hero,
.stats article {
  border: 1px solid #d8e0ea;
  border-radius: 8px;
  background: #ffffff;
}

.hero {
  padding: 28px;
}

.label {
  margin: 0 0 10px;
  color: #047857;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero h2 {
  margin: 0 0 10px;
  font-size: 28px;
}

.hero p:last-child {
  max-width: 680px;
  margin: 0;
  color: #4b5563;
  line-height: 1.7;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.stats article {
  padding: 18px;
}

.stats span,
.stats strong {
  display: block;
}

.stats span {
  color: #6b7280;
  font-weight: 700;
}

.stats strong {
  margin-top: 8px;
  color: #102033;
  font-size: 26px;
}

@media (max-width: 720px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
