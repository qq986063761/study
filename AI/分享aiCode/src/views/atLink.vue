<template>
  <div class="apple-home">
    <!-- Navigation -->
    <nav class="nav-container">
      <div class="nav-content">
        <ul class="nav-list">
          <li><a href="#" class="nav-link">商店</a></li>
          <li><a href="#" class="nav-link">Mac</a></li>
          <li><a href="#" class="nav-link">iPad</a></li>
          <li><a href="#" class="nav-link">iPhone</a></li>
          <li><a href="#" class="nav-link">Watch</a></li>
          <li><a href="#" class="nav-link">Vision</a></li>
          <li><a href="#" class="nav-link">AirPods</a></li>
          <li><a href="#" class="nav-link">家居</a></li>
          <li><a href="#" class="nav-link">娱乐</a></li>
          <li><a href="#" class="nav-link">配件</a></li>
          <li><a href="#" class="nav-link">技术支持</a></li>
        </ul>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>学什么专业，<br>Mac 都专业。</h1>
        <div class="cta-links">
          <a href="#" class="learn-more">进一步了解</a>
        </div>
      </div>
    </section>

    <!-- Trade In Section -->
    <section class="trade-in-section">
      <div class="trade-in-content">
        <h2>Apple Trade In 换购计划</h2>
        <p>换购新 iPhone 享额外折抵优惠*</p>
        <p class="promo-text">活动自即日起至 6 月 18 日</p>
        <a href="#" class="cta-button">获取折抵估价</a>
      </div>
    </section>

    <!-- Product Grid -->
    <div class="product-grid">
      <div class="product-item iphone">
        <h3>iPhone</h3>
        <p>来认识一下 iPhone 16 全系列</p>
        <div class="product-links">
          <a href="#" class="learn-more">进一步了解</a>
          <a href="#" class="buy">选购 iPhone</a>
        </div>
      </div>
      <div class="product-item macbook">
        <h3>MacBook Air</h3>
        <p>天蓝色上新，M4 性能冲天。</p>
        <div class="product-links">
          <a href="#" class="learn-more">进一步了解</a>
          <a href="#" class="buy">购买</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppleHome',
  data() {
    return {
      // Add any reactive data here
    }
  },
  methods: {
    // Add methods here
  }
}
</script>

<style scoped>
.apple-home {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #1d1d1f;
}

.nav-container {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}

.nav-content {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-list {
  display: flex;
  justify-content: space-between;
  list-style: none;
  margin: 0;
  padding: 0;
  height: 44px;
  align-items: center;
}

.nav-link {
  color: #f5f5f7;
  text-decoration: none;
  font-size: 12px;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 1;
}

.hero-section {
  background: #fbfbfd;
  text-align: center;
  padding: 120px 20px;
  margin-top: 44px;
}

.hero-content h1 {
  font-size: 56px;
  font-weight: 600;
  line-height: 1.1;
  margin-bottom: 20px;
}

.cta-links {
  margin-top: 20px;
}

.learn-more, .buy {
  color: #2997ff;
  text-decoration: none;
  font-size: 21px;
  margin: 0 20px;
}

.learn-more:hover, .buy:hover {
  text-decoration: underline;
}

.trade-in-section {
  background: #f5f5f7;
  text-align: center;
  padding: 60px 20px;
}

.trade-in-content h2 {
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 10px;
}

.promo-text {
  color: #86868b;
  margin: 10px 0;
}

.cta-button {
  display: inline-block;
  background: #0071e3;
  color: white;
  padding: 12px 24px;
  border-radius: 980px;
  text-decoration: none;
  font-size: 17px;
  margin-top: 20px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
}

.product-item {
  background: #fbfbfd;
  text-align: center;
  padding: 40px 20px;
  border-radius: 18px;
}

.product-item h3 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 10px;
}

.product-links {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-content h1 {
    font-size: 40px;
  }
  
  .nav-list {
    overflow-x: auto;
    white-space: nowrap;
    padding: 0 20px;
  }
}
</style>
