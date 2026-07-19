<template>
  <div class="app">
    <div class="layout">
      <!-- 左侧菜单 -->
      <div class="sidebar">
        <h2>组件列表</h2>
        <ul class="menu">
          <li 
            v-for="(item, index) in menuItems" 
            :key="index"
            :class="{ active: currentComponent === item.component }"
            @click="switchComponent(item.component)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      
      <!-- 右侧内容区域 -->
      <component class="content" :is="currentComponent"></component>
    </div>
  </div>
</template>

<script>
import ButtonView from './views/button.vue'
import TableView from './views/table.vue'

export default {
  components: {
    ButtonView,
    TableView
  },
  data() {
    return {
      currentComponent: 'ButtonView',
      menuItems: [
        { name: '按钮组件', component: 'ButtonView' },
        { name: '表格组件', component: 'TableView' }
      ]
    }
  },
  methods: {
    switchComponent(component) {
      this.currentComponent = component
    }
  },
  mounted() {
    // 测试 eslint 规则
    // const a = '1'
    // const b = "2"
    // console.log(a + b)
    // console.log("button mounted")
  }
}
</script>

<style>
.app {
  width: 100%;
  height: 100vh;
}

.layout {
  display: flex;
  height: 100%;
}

.sidebar {
  width: 200px;
  background-color: #f5f5f5;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 5px;
}

.menu li:hover {
  background-color: #e0e0e0;
}

.menu li.active {
  background-color: #1890ff;
  color: white;
}

.content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}
</style>