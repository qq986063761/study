<template>
  <div class="store-demo">
    <h1>Store 演示页面</h1>
    <p class="description">演示多个 store 模块的使用和循环引用问题的解决方案</p>
    
    <!-- 循环引用问题说明 -->
    <el-card class="warning-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>⚠️ 循环引用问题</span>
        </div>
      </template>
      <div class="warning-content">
        <p><strong>问题场景：</strong></p>
        <ul>
          <li>base store 需要 child1 中的数据</li>
          <li>child1 store 需要 child2 中的数据</li>
          <li>child2 store 需要 base 中的数据</li>
        </ul>
        <p><strong>解决方案：</strong></p>
        <ul>
          <li>使用延迟获取 store 实例（lazy loading）</li>
          <li>通过组合器模式统一管理 store 间的交互</li>
          <li>避免在 store 定义时直接导入其他 store</li>
        </ul>
      </div>
    </el-card>

    <!-- 各个 Store 的独立操作 -->
    <div class="store-sections">
      <el-card class="store-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>Base Store</span>
          </div>
        </template>
        <div class="store-content">
          <p><strong>数据：</strong>{{ baseStore.baseData }}</p>
          <p><strong>计数：</strong>{{ baseStore.baseCount }}</p>
          <p><strong>时间戳：</strong>{{ baseStore.baseInfo.timestamp }}</p>
          <div class="actions">
            <el-button @click="baseStore.incrementBase()" type="primary">增加计数</el-button>
            <el-button @click="baseStore.updateBaseData('Base 数据已更新')" type="success">更新数据</el-button>
            <el-button @click="baseStore.resetBase()" type="warning">重置</el-button>
          </div>
        </div>
      </el-card>

      <el-card class="store-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>Child1 Store</span>
          </div>
        </template>
        <div class="store-content">
          <p><strong>数据：</strong>{{ child1Store.child1Data }}</p>
          <p><strong>计数：</strong>{{ child1Store.child1Count }}</p>
          <p><strong>时间戳：</strong>{{ child1Store.child1Info.timestamp }}</p>
          <div class="actions">
            <el-button @click="child1Store.incrementChild1()" type="primary">增加计数</el-button>
            <el-button @click="child1Store.updateChild1Data('Child1 数据已更新')" type="success">更新数据</el-button>
            <el-button @click="child1Store.resetChild1()" type="warning">重置</el-button>
          </div>
        </div>
      </el-card>

      <el-card class="store-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>Child2 Store</span>
          </div>
        </template>
        <div class="store-content">
          <p><strong>数据：</strong>{{ child2Store.child2Data }}</p>
          <p><strong>计数：</strong>{{ child2Store.child2Count }}</p>
          <p><strong>时间戳：</strong>{{ child2Store.child2Info.timestamp }}</p>
          <div class="actions">
            <el-button @click="child2Store.incrementChild2()" type="primary">增加计数</el-button>
            <el-button @click="child2Store.updateChild2Data('Child2 数据已更新')" type="success">更新数据</el-button>
            <el-button @click="child2Store.resetChild2()" type="warning">重置</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 组合数据展示 -->
    <el-card class="combined-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>组合数据 (自动更新)</span>
        </div>
      </template>
      <div class="combined-content">
        <div class="data-display">
          <h4>所有 Store 的组合信息：</h4>
          <pre>{{ JSON.stringify(combinedData, null, 2) }}</pre>
        </div>
        <div class="actions">
          <el-button @click="composer.syncAllStores()" type="success">同步所有 Store</el-button>
          <el-button @click="composer.resetAllStores()" type="warning">重置所有 Store</el-button>
        </div>
      </div>
    </el-card>

    <!-- 循环引用演示 -->
    <el-card class="demo-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>循环引用解决方案演示</span>
        </div>
      </template>
      <div class="demo-content">
        <h4>解决方案对比：</h4>
        <div class="solution-comparison">
          <div class="bad-solution">
            <h5>❌ 错误做法（会导致循环引用）：</h5>
            <pre><code>// base.js
import { useChild1Store } from './child1'
// child1.js  
import { useChild2Store } from './child2'
// child2.js
import { useBaseStore } from './base'</code></pre>
          </div>
          <div class="good-solution">
            <h5>✅ 正确做法（延迟获取）：</h5>
            <pre><code>// storeComposer.js
export function useStoreComposer() {
  const getBaseStore = () => useBaseStore()
  const getChild1Store = () => useChild1Store()
  const getChild2Store = () => useChild2Store()
  
  function getCombinedData() {
    const baseStore = getBaseStore()
    const child1Store = getChild1Store()
    const child2Store = getChild2Store()
    // 组合数据...
  }
}</code></pre>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useBaseStore } from '../stores/base'
import { useChild1Store } from '../stores/child1'
import { useChild2Store } from '../stores/child2'
import { useStoreComposer } from '../stores/storeComposer'

// 获取各个 store 实例
const baseStore = useBaseStore()
const child1Store = useChild1Store()
const child2Store = useChild2Store()

// 获取组合器
const composer = useStoreComposer()

// 组合数据
const combinedData = ref({})

// 使用 watchEffect 自动监听 store 变化并更新组合数据
watchEffect(() => {
  // 访问各个 store 的响应式数据，触发依赖收集
  baseStore.baseData
  baseStore.baseCount
  child1Store.child1Data
  child1Store.child1Count
  child2Store.child2Data
  child2Store.child2Count
  
  // 自动更新组合数据
  combinedData.value = composer.getCombinedData()
})
</script>

<style lang="scss" scoped>
.store-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    color: #2c3e50;
    margin-bottom: 10px;
  }

  .description {
    color: #7f8c8d;
    margin-bottom: 30px;
    font-size: 16px;
  }

  .warning-card {
    margin-bottom: 30px;
    border-left: 4px solid #f39c12;

    .card-header {
      font-weight: bold;
      color: #e67e22;
    }

    .warning-content {
      ul {
        margin: 10px 0;
        padding-left: 20px;
      }

      li {
        margin: 5px 0;
        color: #34495e;
      }
    }
  }

  .store-sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .store-card {
    .card-header {
      font-weight: bold;
      color: #2c3e50;
    }

    .store-content {
      p {
        margin: 10px 0;
        color: #34495e;
      }

      .actions {
        margin-top: 15px;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
    }
  }

  .combined-card {
    margin-bottom: 30px;

    .card-header {
      font-weight: bold;
      color: #27ae60;
    }

    .combined-content {
      .data-display {
        margin-bottom: 20px;

        h4 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        pre {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
          border: 1px solid #e9ecef;
          overflow-x: auto;
          font-size: 14px;
        }
      }

      .actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
    }
  }

  .demo-card {
    .card-header {
      font-weight: bold;
      color: #8e44ad;
    }

    .demo-content {
      h4 {
        color: #2c3e50;
        margin-bottom: 15px;
      }

      .solution-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }

        .bad-solution, .good-solution {
          h5 {
            margin-bottom: 10px;
          }

          pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            border: 1px solid #e9ecef;
            overflow-x: auto;
            font-size: 12px;
            line-height: 1.4;
          }
        }

        .bad-solution {
          h5 {
            color: #e74c3c;
          }

          pre {
            border-left: 4px solid #e74c3c;
          }
        }

        .good-solution {
          h5 {
            color: #27ae60;
          }

          pre {
            border-left: 4px solid #27ae60;
          }
        }
      }
    }
  }
}
</style>
