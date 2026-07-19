<template>
<!-- 
  :sync="true" 子应用内路由变化后，刷新不会回到子应用初始页面
 -->
  <div class="micro-app-container" v-loading="loading">
    <!-- alive: 保活模式，配合主应用 keep-alive 使用，切走时不调用子应用 __WUJIE_UNMOUNT，避免二次进入白屏 -->
    <WujieVue
      :width="'100%'"
      :height="'100%'"
      :name="name"
      :url="url"
      :alive="true"
      :sync="true"
      :fetch="fetch"
      :props="props"
      :beforeLoad="onChildBeforeLoad"
      :beforeMount="onChildBeforeMount"
      :afterMount="onChildAfterMount"
      :beforeUnmount="onChildBeforeUnmount"
      :afterUnmount="onChildAfterUnmount"
      :activated="onChildActivated"
      :deactivated="onChildDeactivated"
    />
  </div>
</template>

<script>
import { injectThemeToDocument } from '@/assets/theme'
import { mapState } from 'vuex'

// 按 name 映射子应用的 url 和 props，子应用用 window.$wujie.props.$app 获取，避免跨域时 window.parent 不可用
const APP_CONFIG = {
  child1: {
    url: 'http://localhost:8081',
    props: {
      data: { message: 'child1 初始化数据' }
    }
  },
  child2: {
    url: 'http://localhost:8082',
    props: {
      data: { message: 'child2 初始化数据' }
    }
  }
}

export default {
  name: 'MicroApp',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true
    }
  },
  computed: {
    ...mapState(['theme']),
    url() {
      const config = APP_CONFIG[this.name]
      return config ? config.url : ''
    },
    props() {
      const config = APP_CONFIG[this.name]
      const base = config?.props ? { ...config.props } : {}
      return { ...base, $app: window.$app }
    }
  },
  watch: {
    theme: {
      handler() {
        // 主题切换时，更新当前子应用的主题
        this.updateChildAppTheme()
      },
      immediate: false
    }
  },
  methods: {
    fetch(url, options) {
      // 需要改参数就可以拦截请求
      return window.fetch(url, options)
    },
    /** 子应用加载前 */
    onChildBeforeLoad(appWindow) {
      console.log('MicroApp onChildBeforeLoad', this.name)
    },
    /** 子应用挂载前 */
    onChildBeforeMount(appWindow) {
      console.log('MicroApp onChildBeforeMount', this.name)
      // 注入主题 CSS 变量到子应用
      if (appWindow && appWindow.document) {
        try {
          injectThemeToDocument(appWindow.document)
          console.log('主题 CSS 变量已注入到子应用', this.name)
        } catch (e) {
          console.warn('注入主题 CSS 变量失败', e)
        }
      }
    },
    updateChildAppTheme() {
      // 更新当前子应用的主题
      const appWindow = window.$app?.apps?.[this.name]?.window
      if (appWindow && appWindow.document) {
        try {
          injectThemeToDocument(appWindow.document)
          console.log('主题已更新到子应用', this.name)
        } catch (e) {
          console.warn('更新子应用主题失败', e)
        }
      }
    },
    /**
     * 无界子应用挂载完成后调用（子应用需做生命周期改造时才会触发，见无界文档）。
     * 在此统一设置 slot.window / slot.ready，符合无界生命周期，无需在 mounted 中轮询 iframe。
     */
    onChildAfterMount(appWindow) {
      this.loading = false
      console.log('MicroApp onChildAfterMount', this.name, appWindow)
      const slot = window.$app?.apps?.[this.name]
      if (slot) {
        slot.window = appWindow
      }
      // 子应用挂载完成后，同步主应用的 store 数据
      if (window.$app && window.$app.store && window.$app.store.state) {
        setTimeout(() => {
          if (window.$app.emit) {
            // 同步所有需要同步的 store 属性
            const state = window.$app.store.state
            if (state.usrs) {
              window.$app.emit('store-state', { prop: 'usrs', value: state.usrs })
            }
            // 可以在这里添加其他需要同步的属性
            // if (state.otherProp) {
            //   window.$app.emit('store-state', { prop: 'otherProp', value: state.otherProp })
            // }
          }
        }, 100)
      }
    },
    /** 子应用卸载前，可通知子应用做清理（如调用子应用 window.$app.onBeforeUnmount） */
    onChildBeforeUnmount(appWindow) {
      console.log('MicroApp onChildBeforeUnmount', this.name)
      try {
        appWindow?.$app?.onBeforeUnmount?.()
      } catch (e) {
        console.warn('MicroApp onChildBeforeUnmount child callback error', e)
      }
    },
    /** 子应用卸载后 */
    onChildAfterUnmount(appWindow) {
      console.log('MicroApp onChildAfterUnmount', this.name)
      const slot = window.$app?.apps?.[this.name]
      if (slot) {
        slot.window = null
      }
    },
    /** 保活模式下子应用被再次激活，可通知子应用刷新（如调用子应用 window.$app.onActivated） */
    onChildActivated(appWindow) {
      console.log('MicroApp onChildActivated', this.name)
      try {
        appWindow?.$app?.onActivated?.()
      } catch (e) {
        console.warn('MicroApp onChildActivated child callback error', e)
      }
    },
    /** 保活模式下子应用被停用，可通知子应用暂停（如调用子应用 window.$app.onDeactivated） */
    onChildDeactivated(appWindow) {
      console.log('MicroApp onChildDeactivated', this.name)
      try {
        appWindow?.$app?.onDeactivated?.()
      } catch (e) {
        console.warn('MicroApp onChildDeactivated child callback error', e)
      }
    }
  },
  activated() {
    console.log('MicroApp activated', this.name)
  },
  deactivated() {
    console.log('MicroApp deactivated', this.name)
  }
}
</script>

<style lang="scss" scoped>
.micro-app-container {
  width: 100%;
  height: 100%;
  overflow: hidden;

  ::v-deep .wujie_iframe {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
