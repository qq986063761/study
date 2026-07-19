<template>
  <div class="data-page">
    <!-- ref API 示例 -->
    <el-card class="demo-card">
      <template #header>
        <h2>1. ref API 示例</h2>
      </template>
      <p><strong>ref 用于创建响应式的基本类型数据</strong></p>

      <h3>基本类型 ref</h3>
      <p>计数器: {{ count }}</p>
      <el-button type="primary" @click="increment">增加计数</el-button>

      <el-divider />

      <h3>对象类型 ref</h3>
      <p>用户信息: {{ userInfo.name }} - {{ userInfo.age }}岁</p>
      <el-button type="primary" @click="updateUserInfo">更新用户信息</el-button>
    </el-card>

    <!-- reactive API 示例 -->
    <el-card class="demo-card">
      <template #header>
        <h2>2. reactive API 示例</h2>
      </template>
      <p><strong>reactive 用于创建响应式的对象</strong></p>

      <h3>reactive 对象</h3>
      <p>库存: {{ product.stock }}件</p>
      <el-button type="primary" @click="addStock">增加库存</el-button>
    </el-card>

    <!-- computed API 示例 -->
    <el-card class="demo-card">
      <template #header>
        <h2>3. computed API 示例</h2>
      </template>
      <p><strong>computed 用于创建计算属性，基于响应式数据自动计算</strong></p>

      <h3>基本计算属性</h3>
      <p>价格: {{ price }}元</p>
      <p>数量: {{ quantity }}件</p>
      <p><strong>总价: {{ totalPrice }}元</strong></p>
      <el-button type="primary" @click="changePrice">修改价格</el-button>
      <el-button type="primary" @click="changeQuantity">修改数量</el-button>
    </el-card>

    <!-- watch API 示例 -->
    <el-card class="demo-card">
      <template #header>
        <h2>4. watch API 示例</h2>
      </template>
      <p><strong>watch 用于侦听响应式数据的变化并执行副作用</strong></p>

      <h3>基础侦听（搜索防抖）</h3>
      <p>搜索关键词: <el-input v-model="searchKeyword" placeholder="输入关键词" style="width: 200px" /></p>
      <p>搜索结果: {{ searchResult }}</p>

      <el-divider />

      <h3>侦听多个数据源 + deep 选项</h3>
      <p>姓名: <el-input v-model="person.name" placeholder="姓名" style="width: 150px" /></p>
      <p>年龄: <el-input v-model="person.age" placeholder="年龄" style="width: 150px" /></p>
      <p>修改日志: {{ personLog }}</p>

      <el-divider />

      <h3>watch vs watchEffect</h3>
      <p>watch 需显式指定数据源；watchEffect 自动收集内部访问的所有响应式依赖</p>
      <p>计数器值: {{ watchCounter }}</p>
      <p>watch 触发次数: {{ watchTriggerCount }}</p>
      <p>watchEffect 触发次数: {{ watchEffectTriggerCount }}</p>
      <el-button type="primary" @click="watchCounter++">增加计数（触发两种侦听器）</el-button>
    </el-card>

    <!-- toRef / toRefs 示例 -->
    <el-card class="demo-card">
      <template #header>
        <h2>5. toRef / toRefs API 示例</h2>
      </template>
      <p><strong>从 reactive 对象解构时保持响应式连接</strong></p>

      <h3>直接解构 — 丢失响应式（❌）</h3>
      <p>解构后 count: {{ destructuredCount }}（原对象 count = {{ originObj.count }}）</p>

      <h3>toRef — 保持单个属性的响应式连接（✅）</h3>
      <p>toRef 后的 count: {{ countRef }}</p>

      <h3>toRefs — 批量转为 ref（✅）</h3>
      <p>toRefs 后: name = {{ nameRef }}, age = {{ ageRef }}</p>

      <el-button type="primary" @click="updateOriginObject">修改原始 reactive 对象</el-button>
    </el-card>

    <!-- 响应式工具函数 -->
    <el-card class="demo-card">
      <template #header>
        <h2>6. 响应式工具函数</h2>
      </template>

      <h3>isRef / unref / toValue</h3>
      <p><code>isRef(plainValue)</code> = {{ isRef(plainValue) }}</p>
      <p><code>isRef(refValue)</code> = {{ isRef(refValue) }}</p>
      <p><code>unref(refValue)</code> = {{ unref(refValue) }}（自动解包 ref，非 ref 则原样返回）</p>
      <p><code>toValue(refValue)</code> = {{ toValue(refValue) }}（Vue 3.3+，同时解包 ref/getter）</p>
      <p><code>toValue(plainValue)</code> = {{ toValue(plainValue) }}（普通值原样返回）</p>
      <p><code>isReactive(state)</code> = {{ isReactive(state) }}</p>
      <p><code>isProxy(state)</code> = {{ isProxy(state) }}</p>
    </el-card>

    <!-- readonly API 示例 -->
    <el-card class="demo-card">
      <template #header>
        <h2>7. readonly — 只读代理</h2>
      </template>
      <p><strong>创建只读版本，防止数据被意外修改</strong></p>
      <p>原始数据: {{ writableData.count }}</p>
      <p>只读数据: {{ readonlyData.count }}</p>
      <el-button type="primary" @click="writableData.count++">修改原始数据（✅ 允许）</el-button>
      <el-button type="danger" @click="tryModifyReadonly">尝试修改只读数据（开发环境会警告）</el-button>
    </el-card>

    <!-- shallowRef / triggerRef 示例 -->
    <el-card class="demo-card">
      <template #header>
        <h2>8. shallowRef / triggerRef — 浅层响应式</h2>
      </template>
      <p><strong>shallowRef 只有 .value 本身是响应式的，内部属性变更不会自动触发更新，需手动 triggerRef</strong></p>

      <h3>shallowRef（浅层）</h3>
      <p>列表: {{ shallowList.names?.join(', ') }}</p>
      <el-button type="primary" @click="shallowPush">直接 push（不会触发更新）</el-button>
      <el-button type="warning" @click="triggerShallowUpdate">triggerRef 手动触发更新</el-button>

      <el-divider />

      <h3>普通 ref（深层，对比）</h3>
      <p>列表: {{ deepList.names?.join(', ') }}</p>
      <el-button type="primary" @click="deepPush">直接 push（自动触发更新）</el-button>
      <p class="tip-text">普通 ref 会对对象做深层响应式代理，push 自动触发更新；shallowRef 只监听 .value 整体替换。</p>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect, toRef, toRefs, isRef, unref, toValue, isReactive, isProxy, readonly, shallowRef, triggerRef } from 'vue'

// ========== ref API 示例 ==========

// 1. 基本类型的 ref
const count = ref(0)  // 数字类型

// 2. 对象类型的 ref
const userInfo = ref({
  name: '张三',
  age: 25
})

// ref 相关方法
const increment = () => {
  count.value++  // 注意：需要通过 .value 访问和修改
}

// 随机名字池
const namePool = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '小明', '小红']

const updateUserInfo = () => {
  // 随机选取名字和年龄，每次点击都会变化
  userInfo.value.name = namePool[Math.floor(Math.random() * namePool.length)]
  userInfo.value.age = Math.floor(Math.random() * 50) + 18
}

// ========== reactive API 示例 ==========

// reactive 只能用于对象类型
const product = reactive({
  stock: 100
})

// reactive 相关方法
const addStock = () => {
  // 直接修改属性，无需 .value
  product.stock += 10
}

// ========== computed API 示例 ==========

// 1. 基本计算属性 - 基于 ref 数据
const price = ref(100)  // 价格
const quantity = ref(2)  // 数量

// 计算属性：总价 = 价格 × 数量
const totalPrice = computed(() => {
  return price.value * quantity.value
})

// computed 相关方法
const changePrice = () => {
  price.value = Math.floor(Math.random() * 200) + 50  // 随机价格 50-250
}

const changeQuantity = () => {
  quantity.value = Math.floor(Math.random() * 5) + 1  // 随机数量 1-5
}

// ========== watch API 示例 ==========

// 基础侦听 - 搜索防抖
const searchKeyword = ref('')
const searchResult = ref('')

watch(searchKeyword, (newVal) => {
  // 模拟搜索延迟
  setTimeout(() => {
    searchResult.value = newVal ? `搜索 "${newVal}" 的结果...` : ''
  }, 500)
})

// 侦听多个数据源 + deep 选项
const person = reactive({ name: '张三', age: 25 })
const personLog = ref('')

watch(
  [() => person.name, () => person.age],
  ([newName, newAge], [oldName, oldAge]) => {
    personLog.value = `变更: ${oldName}→${newName}, ${oldAge}→${newAge} (${new Date().toLocaleTimeString()})`
  }
)

// watch vs watchEffect 对比
const watchCounter = ref(0)
const watchTriggerCount = ref(0)
const watchEffectTriggerCount = ref(0)

// watch 方式：需显式声明要侦听的数据源
watch(watchCounter, () => {
  watchTriggerCount.value++
})

// watchEffect 方式：自动追踪回调内访问的响应式依赖
watchEffect(() => {
  void watchCounter.value  // 访问 watchCounter.value 触发依赖收集
  watchEffectTriggerCount.value++
})

// ========== toRef / toRefs 示例 ==========

const originObj = reactive({ count: 0, name: '李四', age: 30 })

// 直接解构 — 丢失响应式（只是拷贝了当前值）
const { count: destructuredCount } = originObj

// toRef — 保持单个属性的响应式连接
const countRef = toRef(originObj, 'count')

// toRefs — 批量转为 ref
const { name: nameRef, age: ageRef } = toRefs(originObj)
console.log('toRefs', { nameRef, ageRef })

const updateOriginObject = () => {
  originObj.count += 10
  originObj.name = '王五-' + originObj.count
  originObj.age += 5
}

// ========== 响应式工具函数 ==========

// 定义一些值用于演示 isRef / unref / toValue
const refValue = ref(100)
const plainValue = 200
const state = reactive({ foo: 1 })

// ========== readonly 示例 ==========

const writableData = reactive({ count: 0 })
const readonlyData = readonly(writableData)  // 只读代理，随原对象同步变化

const tryModifyReadonly = () => {
  // 只读对象修改会在开发环境发出 warning
  readonlyData.count++
}

// ========== shallowRef / triggerRef 示例 ==========

// shallowRef：只监听 .value 整体替换
const shallowList = shallowRef({ names: ['苹果', '香蕉', '橘子'] })

const shallowPush = () => {
  // 直接修改内部属性 — 不会触发视图更新
  shallowList.value.names = [...shallowList.value.names, '草莓' + Date.now()]
}

const triggerShallowUpdate = () => {
  triggerRef(shallowList)  // 手动触发 shallowRef 的更新
}

// 普通 ref（深层响应式）：自动追踪内部属性变更
const deepList = ref({ names: ['苹果', '香蕉', '橘子'] })

const deepPush = () => {
  // 修改内部属性 — 自动触发视图更新
  deepList.value.names = [...deepList.value.names, '草莓' + Date.now()]
}
</script>

<style lang="scss" scoped>
.data-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.demo-card {
  margin-bottom: 24px;

  h2 {
    margin: 0;
    color: #42b883;
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

.tip-text {
  color: #999;
  font-size: 13px;
  margin-top: 5px;
}
</style>
