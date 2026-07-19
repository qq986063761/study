<template>
  <div id="app">
    <div class="app-header">wape-ui</div>
    <div class="app-body">
      <div class="app-side">
        <template v-for="item in menus">
          <div class="menu-item menu-title" :key="item.key">
            {{ item.name }}
          </div>
          <div 
            class="menu-item menu-child"
            v-for="childItem in item.children" 
            :key="childItem.key + 'item'"
            :class="{active: childItem.key === $route.name}"
            @click="clickItem(childItem)">
            {{ childItem.name }}
          </div>
        </template>
      </div>
      <router-view class="app-view" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menus: [
        {
          key: 'components',
          name: '组件',
          children: [
            {
              key: 'textEllipsis',
              name: '文本溢出省略'
            },
            {
              key: 'sticky',
              name: '粘性布局'
            },
            {
              key: 'drag',
              name: '拖拽元素'
            }
          ]
        }
      ]
    }
  },
  methods: {
    clickItem(item) {
      if (this.$route.name === item.key) return
      this.$router.push({
        name: item.key
      })
    }
  }
}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.app-header {
  height: 55px;
  padding: 0 20px;
  background-color: #4085ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  font-size: 30px;
  color: #fff;
  z-index: 1;
  line-height: 55px;
  flex-shrink: 0;
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.app-side {
  border-right: 1px solid #e1e1e1;
  flex-shrink: 0;
  overflow: auto;

  .menu-item {
    height: 40px;
    padding: 0 20px;
    line-height: 40px;
  }

  .menu-title {
    font-weight: bold;
  }

  .menu-child {
    padding: 0 30px;
    border-right: 2px solid transparent;
    cursor: pointer;
    &.active,
    &:hover {
      border-right: 2px solid #4085ed;
      color: #4085ed;
      background-color: #e7f1ff;
    }
  }
}

.app-view {
  flex: 1;
  padding: 20px;
  overflow: auto;
  .code {
    padding: 10px;
    background: #000;
    border-radius: 4px;
    color: #fff;
    font-size: 16px;
  }
}
</style>