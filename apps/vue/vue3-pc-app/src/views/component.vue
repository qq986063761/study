<template>
  <div class="component-demo-page">
    <el-card class="demo-card">
      <template #header>
        <h2>Vue 组件 API 演示</h2>
      </template>
      <p><strong>这个页面演示了 Vue 3 组件的各种 API 和特性</strong></p>

      <!-- Props 示例 -->
      <h3>1. Props 传递数据</h3>
      <p>父组件向子组件传递数据：</p>
      <ChildComponent
        :message="parentMessage"
        :count="parentCount"
        :user="userData"
        @update-count="handleCountUpdate"
      />
      <el-button type="primary" @click="updateParentData">更新父组件数据</el-button>

      <el-divider />

      <!-- Emits 示例 -->
      <h3>2. Emits 事件通信</h3>
      <p>子组件向父组件发送事件：</p>
      <EventComponent @custom-event="handleCustomEvent" />
      <p v-if="eventMessage">收到事件: {{ eventMessage }}</p>

      <el-divider />

      <!-- Slots 示例 -->
      <h3>3. Slots 插槽</h3>
      <p>使用插槽传递内容：</p>
      <SlotComponent>
        <template #header>
          <h4>这是头部插槽</h4>
        </template>
        <template #default>
          <p>这是默认插槽的内容</p>
        </template>
        <template #footer>
          <p>这是底部插槽</p>
        </template>
      </SlotComponent>

      <el-divider />

      <!-- Provide/Inject 示例 -->
      <h3>4. Provide/Inject 跨组件通信</h3>
      <p>祖先组件提供数据，后代组件注入数据：</p>
      <ParentComponent />

      <el-divider />

      <!-- 生命周期示例 -->
      <h3>5. 生命周期钩子</h3>
      <p>查看控制台输出，观察生命周期执行顺序：</p>
      <LifecycleComponent v-if="showLifecycle" />
      <el-button type="primary" @click="toggleLifecycle">切换生命周期组件</el-button>

      <el-divider />

      <!-- 组合式函数示例 -->
      <h3>6. 组合式函数 (Composables)</h3>
      <p>使用组合式函数复用逻辑：</p>
      <p>鼠标位置: X: {{ mouse.x }}, Y: {{ mouse.y }}</p>
      <p>窗口大小: {{ windowSize.width }} x {{ windowSize.height }}</p>
    </el-card>

    <!-- defineExpose + 模板引用 -->
    <el-card class="demo-card">
      <template #header>
        <h2>7. defineExpose + 模板引用</h2>
      </template>
      <p><strong>父组件通过模板 ref 获取子组件实例，调用子组件暴露的属性和方法</strong></p>

      <h3>DOM 元素引用</h3>
      <el-input ref="inputRef" v-model="templateRefText" placeholder="聚焦到此输入框" style="width: 250px" />
      <el-button type="primary" @click="focusInput">调用 input.focus()</el-button>

      <el-divider />

      <h3>组件实例引用（defineExpose）</h3>
      <ExposeComponent ref="exposeCompRef" />
      <div class="action-row">
        <el-button type="primary" @click="callExposeIncrement">调用子组件 increment()</el-button>
        <el-button type="success" @click="callExposeReset">调用子组件 reset(100)</el-button>
        <el-button type="info" @click="callExposeGetData">调用子组件 getData()</el-button>
      </div>
      <p v-if="exposeResult">子组件返回: {{ exposeResult }}</p>
    </el-card>

    <!-- v-model 增强 -->
    <el-card class="demo-card">
      <template #header>
        <h2>8. v-model 增强 — 多个 v-model</h2>
      </template>
      <p><strong>Vue 3 支持组件上绑定多个 v-model，替代 Vue 2 的 .sync 修饰符</strong></p>

      <ModelComponent
        v-model="mainValue"
        v-model:title="titleValue"
        v-model:desc="descValue"
      />
      <p>主 v-model: {{ mainValue }}</p>
      <p>v-model:title: {{ titleValue }}</p>
      <p>v-model:desc: {{ descValue }}</p>
    </el-card>

    <!-- nextTick -->
    <el-card class="demo-card">
      <template #header>
        <h2>9. nextTick — DOM 更新后回调</h2>
      </template>
      <p><strong>Vue 异步更新 DOM，nextTick 确保拿到更新后的 DOM 状态</strong></p>

      <div ref="tickBoxRef" class="tick-box" :style="{ height: tickBoxHeight + 'px' }">
        {{ tickContent }}
      </div>
      <p>当前高度: {{ tickBoxHeight }}px</p>
      <el-button type="primary" @click="addContentWithoutTick">直接获取高度（拿不到最新值 ❌）</el-button>
      <el-button type="success" @click="addContentWithTick">nextTick 后获取高度（正确 ✅）</el-button>
      <p v-if="tickResult">{{ tickResult }}</p>
    </el-card>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted, nextTick } from 'vue'
import ChildComponent from '../components/ChildComponent.vue'
import EventComponent from '../components/EventComponent.vue'
import SlotComponent from '../components/SlotComponent.vue'
import ParentComponent from '../components/ParentComponent.vue'
import LifecycleComponent from '../components/LifecycleComponent.vue'
import ExposeComponent from '../components/ExposeComponent.vue'
import ModelComponent from '../components/ModelComponent.vue'
import { useMouse, useWindowSize } from '../composables/useMouse'

// ========== Props 示例 ==========
const parentMessage = ref('来自父组件的消息')
const parentCount = ref(0)
const userData = ref({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com'
})

const updateParentData = () => {
  parentMessage.value = `更新后的消息 - ${Date.now()}`
  parentCount.value++
  userData.value.age++
}

const handleCountUpdate = (newCount) => {
  parentCount.value = newCount
}

// ========== Emits 示例 ==========
const eventMessage = ref('')

const handleCustomEvent = (data) => {
  eventMessage.value = `收到事件: ${data.message} (时间: ${data.timestamp})`
}

// ========== Provide/Inject 示例 ==========
const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// 提供数据给后代组件
provide('theme', theme)
provide('toggleTheme', toggleTheme)

// ========== 生命周期示例 ==========
const showLifecycle = ref(true)

const toggleLifecycle = () => {
  showLifecycle.value = !showLifecycle.value
}

// ========== 组合式函数示例 ==========
const mouse = useMouse()
const windowSize = useWindowSize()

// 组件挂载时的生命周期
onMounted(() => {
  console.log('ComponentDemo 组件已挂载')
})

onUnmounted(() => {
  console.log('ComponentDemo 组件已卸载')
})

// ========== defineExpose + 模板引用 示例 ==========

// DOM 元素引用（原生 HTML 元素）
const templateRefText = ref('')
const inputRef = ref(null)  // 模板 ref 名称需与模板中 ref="inputRef" 一致

const focusInput = () => {
  // inputRef.value 是原生 DOM 元素，可直接调用 .focus()
  inputRef.value?.focus()
}

// 组件实例引用（通过 defineExpose 暴露的属性和方法）
const exposeCompRef = ref(null)
const exposeResult = ref('')

const callExposeIncrement = () => {
  exposeCompRef.value?.increment()
}
const callExposeReset = () => {
  exposeCompRef.value?.reset(100)
}
const callExposeGetData = () => {
  const data = exposeCompRef.value?.getData()
  exposeResult.value = JSON.stringify(data)
}

// ========== v-model 增强 示例 ==========

// Vue 3 支持多个 v-model: 默认 + v-model:xxxName
const mainValue = ref('默认值')
const titleValue = ref('标题初始值')
const descValue = ref('描述初始值')

// ========== nextTick 示例 ==========

// nextTick：在 DOM 更新完成后再获取元素尺寸
const tickBoxRef = ref(null)
const tickContent = ref('点击按钮添加文本，观察高度变化')
const tickBoxHeight = ref(50)
const tickResult = ref('')

const addContentWithoutTick = () => {
  tickContent.value += ' 新增文本'
  // 直接获取 DOM 高度 — Vue 还未更新 DOM，拿到的是旧值
  tickResult.value = `直接获取: ${tickBoxRef.value?.scrollHeight}px（DOM 尚未更新，旧值 ❌）`
}

const addContentWithTick = () => {
  tickContent.value += ' 新增文本'
  // nextTick 等待 Vue 完成 DOM 更新后再读取
  nextTick(() => {
    tickBoxHeight.value = tickBoxRef.value?.scrollHeight || 50
    tickResult.value = `nextTick 后获取: ${tickBoxRef.value?.scrollHeight}px（DOM 已更新，正确 ✅）`
  })
}
</script>

<style lang="scss" scoped>
.component-demo-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-card {
  h2 {
    margin: 0;
    color: #409eff;
    font-size: 18px;
  }

  h3 {
    color: #2c3e50;
    margin-top: 0;
  }

  p {
    margin: 10px 0;
    font-size: 16px;
  }
}

.action-row {
  display: flex;
  gap: 10px;
  margin: 10px 0;
  flex-wrap: wrap;
}

.tick-box {
  background-color: #ecf5ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  padding: 10px;
  transition: height 0.3s;
  overflow: hidden;
}
</style>
