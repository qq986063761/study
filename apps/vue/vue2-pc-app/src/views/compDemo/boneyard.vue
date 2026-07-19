<template>
  <div class="boneyard-demo">
    <p>
      <a
        href="https://github.com/0xGF/boneyard"
        target="_blank"
        rel="noopener noreferrer">
        boneyard-js
      </a>
      （
      <a
        href="https://boneyard.vercel.app/"
        target="_blank"
        rel="noopener noreferrer">
        文档
      </a>
      ）根据真实 DOM 生成骨架屏「骨骼」数据；官方
      <code>boneyard-js/vue</code> 的 <code>Skeleton</code> 基于 Vue 3
      <code>&lt;script setup&gt;</code>，本仓库在 Vue 2.6 下用
      <code>BoneyardSkeleton</code> 包装组件 + 预置的
      <code>.bones.json</code> 做演示。
    </p>

    <div class="block">
      <p>
        <strong>加载状态</strong>
        <el-switch v-model="loading" active-text="骨架" inactive-text="内容" />
      </p>
      <p class="hint">
        骨骼数据来自 <code>src/bones/demo-card.bones.json</code>，并在
        <code>src/bones/registry.js</code> 中通过
        <code>registerBones({ 'demo-card': ... })</code> 注册；生产环境可用
        <code>npx boneyard-js build</code> 从页面抓取（需 Vue 3 子项目或自建抓取页）。
      </p>
    </div>

    <div class="block">
      <p><strong>卡片</strong>（<code>name=&quot;demo-card&quot;</code>）</p>
      <BoneyardSkeleton name="demo-card" :loading="loading" class="boneyard-demo__skel">
        <div class="demo-card">
          <h3 class="demo-card__title">示例标题</h3>
          <p class="demo-card__meta">副标题 · 元信息</p>
          <p class="demo-card__body">
            正文占位：骨架矩形与这份文案的布局不必完全一致，演示的是「loading 时铺骨、完成后显示内容」的流程。
          </p>
          <div class="demo-card__footer">
            <span class="demo-card__tag">标签</span>
          </div>
        </div>
      </BoneyardSkeleton>
    </div>
  </div>
</template>

<script>
import BoneyardSkeleton from '@/components/BoneyardSkeleton.vue'

export default {
  name: 'BoneyardDemo',
  components: { BoneyardSkeleton },
  data() {
    return {
      loading: true
    }
  }
}
</script>

<style lang="scss" scoped>
.boneyard-demo {
  .hint {
    color: #606266;
    font-size: 13px;
    line-height: 1.5;
  }

  &__skel {
    max-width: 480px;
  }
}

.demo-card {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  &__title {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.3;
  }

  &__meta {
    margin: 0 0 12px;
    font-size: 13px;
    color: #909399;
  }

  &__body {
    margin: 0 0 16px;
    font-size: 14px;
    line-height: 1.6;
    color: #303133;
  }

  &__footer {
    display: flex;
    align-items: center;
  }

  &__tag {
    display: inline-block;
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 4px;
    background: #f4f4f5;
    color: #606266;
  }
}
</style>
