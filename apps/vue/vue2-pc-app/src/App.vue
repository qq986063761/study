<template>
  <div id="app">
    <el-menu
      :default-active="$route.path"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router>
      <template
        v-for="item in menus">
        <el-submenu 
          :index="item.path"
          :key="item.path + 'submenu'"
          v-if="item.children">
          <template slot="title">
            {{ item.label }}
          </template>
          <el-menu-item 
            :index="childItem.path"
            :key="childItem.path"
            v-for="childItem in item.children">
            {{ childItem.label }}
          </el-menu-item>
        </el-submenu>
        <el-menu-item
          :key="item.path"
          :index="item.path"
          v-else>
          {{ item.label }}
        </el-menu-item>
      </template>
    </el-menu>
    <keep-alive>
      <router-view class="app-view"/>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        menus: [
          {
            path: '/api',
            label: 'api',
            children: [
              {
                path: '/apiTemplate',
                label: '模版渲染'
              },
              {
                path: '/apiComponent',
                label: '组件'
              },
              {
                path: '/apiMixin',
                label: '混合、指令、过滤器'
              },
              {
                path: '/apiAnimate',
                label: '过渡、动画',
              },
              {
                path: '/apiRender',
                label: 'render函数组件',
              },
              {
                path: '/apiRouterStore/child',
                label: '路由和状态管理'
              }
            ]
          },
          {
            path: '/comp',
            label: '组件demo',
            children: [
              {
                path: '/comment',
                label: '评论框',
              },
              {
                path: '/ssBar',
                label: '悬浮滚动条',
              },
              {
                path: '/scaleTool',
                label: '页面拖拽缩放',
              },
              {
                path: '/pretext',
                label: 'Pretext 文本布局',
              },
              {
                path: '/boneyard',
                label: 'boneyard-js 骨架屏',
              },
              {
                path: '/agGrid',
                label: 'ag-grid 表格',
              }
            ]
          },
          {
            path: '/directive',
            label: '指令demo',
            children: [
              {
                path: '/drClick',
                label: '防重复点击'
              },
              {
                path: '/drag',
                label: '拖拽'
              },
              {
                path: '/scrollActiveItem',
                label: '滚动激活item'
              },
              {
                path: '/inputDirective',
                label: '数字输入限制'
              },
              {
                path: '/kbSelect',
                label: '键盘上下选择item'
              }
            ]
          },
          {
            path: '/other',
            label: '其他demo',
            children: [
              {
                path: '/carousel',
                label: '轮播'
              }
            ]
          }
        ]
      }
    }
  }
</script>

<style lang="scss">
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  * {
    box-sizing: border-box;
  }

  #app {
    display: flex;
    height: 100%;

    > .el-menu {
      width: 200px;
      flex-shrink: 0;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  .app-view {
    flex: 1;
    overflow: auto;
    padding: 20px;
    
    > p:first-child {
      margin-top: 0;
    }
    > p:last-child {
      margin-bottom: 0;
    }
  }

  .block {
    padding: 20px;
    border: 1px solid #999;
    + .block {
      margin-top: 20px;
    }

    > p:first-child {
      margin-top: 0;
    }
    > p:last-child {
      margin-bottom: 0;
    }
  }
</style>
