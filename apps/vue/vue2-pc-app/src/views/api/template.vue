<template>
  <!-- v-cloak 可避免内容在编译结束前，就显示了未编译的内容 -->
  <div class="api-tpl-demo" v-cloak>
    <el-card>
      <div slot="header">
        渲染
      </div>
      <p>{{ text }}</p>
      <p v-once>v-once 指令只初始化一次：{{ text }}</p>
      <div v-html="html"></div>
      <p :title="attr">{{ attr }}</p>
      <p>
        <template>template 自身不会占用 dom 元素位置</template>
      </p>
      <p v-pre v-html="666">
        {{ 'v-pre指令不编译，直接展示内容' }}
      </p>
      <div>
        <!-- 
          .number：自动转换成 number 类型
          .lazy：change 后再更新值
          .trim：去掉首尾空格
        -->
        <div>v-model 指令可双向绑定表单元素的值，v-model 还能搭配修饰符 .number .lazy .trim 实现辅助功能</div>
        <input placeholder="请输入" v-model.lazy="text">
      </div>
      <p v-for="n in 3" :key="n">
        v-for 可以实现列表渲染，key 属性很重要，是循环渲染过程中的元素唯一标识 {{ n }}
      </p>
      <p v-for="(value, key) of {a: 1, b: 2, c: 3}" :key="key">
        v-for 也可以用在对象属性值迭代，key 属性很重要，是循环渲染过程中的元素唯一标识 {{ key }}-{{ value }}
      </p>
      <div>
        <el-button 
          type="primary" 
          @click="ifVal = 1">
          显示 v-if 值
        </el-button>
        <el-button 
          type="danger" 
          @click="ifVal = 2">
          显示 v-else-if 值
        </el-button>
        <el-button 
          type="danger" 
          @click="ifVal = 3">
          显示 v-else 和 v-show 的值
        </el-button>
        <p v-if="1 === ifVal">v-if 的结果</p>
        <p v-else-if="2 === ifVal">v-else-if 的结果</p>
        <p v-else>v-else 的结果</p>
        <p v-show="3 === ifVal">v-show 只用于元素显示隐藏，元素一直存在</p>
      </div>
    </el-card>

    <el-card>
      <div slot="header">
        事件
      </div>

      <p>
        <el-button 
          type="primary" 
          @click="onClick">
          v-on:eventName="function" 或 @eventName="function" 可实现事件绑定
        </el-button>
      </p>

      <p>
        <el-button 
          type="primary" 
          @click="onClick($event, '参数1', '参数2')">
          @click="onClick($event, params)" 直接传递参数，$event 为默认参数
        </el-button>
      </p>

      <p>
        <!-- 鼠标事件修饰符
          .stop：相当于 event.stopPropagation()
          .prevent：执行 event.preventDefault() 阻止默认行为
          .capture：点击子元素时，先触发需要捕获内部事件的元素，然后再触发子元素
          .self：只有确实点击到当前这个元素本身时才会调用
          .once：只执行一次事件
          .passive：不执行 event.preventDefault() 让体验顺畅
          .left：点击鼠标左键时触发
          .right：点击鼠标右键时触发
          .middle：点击鼠标中键时触发
          .native：原生事件（一般用在组件上希望绑定原生事件）
        -->
        <el-button type="primary" @click.native.prevent.right="onClick">
          只有点击鼠标右键才会触发，还有很多实用的鼠标事件修饰符可用
        </el-button>
      </p>

      <div>
        <!-- 键盘事件修饰符
          .enter、page-down：任何有效的键名都会被支持
          .enter、.tab、.delete、.esc、.space、.up、.down、.left、.right：常用兼容旧浏览器的别名
          .ctrl、.alt、.shift、.meta（windows 的窗口键和 mac 的 command 键）：系统操作符，按下的同时才会触发绑定事件
          .exact：精确控制事件，如 @click.ctrl.exact 表示除同时按下 ctrl 之外，其他的组合点击都不会触发
        -->
        <div>下面输入框内只有按下 enter 才会触发事件，键盘事件也有很多实用的修饰符</div>
        <input 
          type="text" 
          placeholder="按下 enter 触发" 
          @keydown.enter="onKeyDown">
      </div>
    </el-card>

    <el-card>
      <div slot="header">
        计算属性，监听器（可在调试日志中看到监听结果）
      </div>
      <p>输入 firstName: <input v-model="fstName"></p>
      <p>输入 lastName: <input v-model="lastName"></p>
      <p>计算属性自动依赖其他属性得出最后的值: {{ name }}</p>
      <p>计算属性还能直接拦截 set get，则可直接修改计算属性本身: <input v-model="fullName"></p>
    </el-card>

    <p>
      <el-button type="primary" @click="$destroy()">
        销毁当前组件 vue 实例后，所有操作都不会被响应，一个实例的生命周期结束
      </el-button>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: '内容',
      html: '<div>v-html 指令直接作为 html 渲染元素</div>',
      attr: '属性可以通过 v-bind:propName="value" 或者 :propName="value" 的形式绑定',
      ifVal: '',
      fstName: '',
      lastName: ''
    }
  },
  computed: {
    name() {
      return this.fstName + ' ' + this.lastName
    },
    fullName: {
      get() {
        return this.fstName + ' ' + this.lastName
      },
      set(val) {
        const names = val.split(' ')
        this.fstName = names[0] || ''
        this.lastName = names[1] || ''
      }
    }
  },
  watch: {
    fstName(val, oldVal) {
      console.log('监听: ', val, oldVal)
    },
    // 监听属性变化，用于处理值变化后的其他业务，比如搜索
    lastName: {
      handler(val, oldVal) {
        console.log('复杂配置的监听: ', val, oldVal)
      },
      // 递归监听
      deep: true,
      // 初始化立即触发一次
      immediate: true
    }
  },
  methods: {
    onKeyDown(event) {
      console.log('键盘被按下了', event)
    },
    onClick(event, ...args) {
      console.log('我被点击了', event, ...args)
    }
  },
  beforeCreate: function () {
    console.log('beforeCreate')
  },
  created: function () {
    console.log('created')
  },
  beforeMount: function () {
    console.log('beforeMount')
  },
  mounted: function () {
    console.log('mounted')
  },
  beforeDestroy: function () {
    console.log('beforeDestroy')
  },
  destroyed: function () {
    console.log('destroyed')
  }
}
</script>

<style lang="scss">
.api-tpl-demo {
  .el-card {
    + .el-card {
      margin-top: 20px;
    }
  }
  
  .el-card__body {
    > p:first-child {
      margin-top: 0;
    }
  }
}
</style>