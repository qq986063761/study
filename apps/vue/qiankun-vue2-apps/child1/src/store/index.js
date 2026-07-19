import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    text: 'child1 的 store 数据',
    usrs: [],
    demo: {
      name: '联邦模块测试',
      version: '1.0.0',
      description: '这是一个通过 Module Federation 暴露的 Item 组件，用于验证联邦引入局部组件的可行性',
      tags: ['vue2', 'module-federation', 'qiankun', '测试'],
      config: {
        theme: 'light',
        locale: 'zh-CN',
        debug: true
      }
    }
  },
  getters: {
  },
  mutations: {
    setData(state) {
      state.text = 'child1 的 store 数据加载完成，点击发起应用内 ajax 请求'
    },
    SET_USRS(state, usrs) {
      state.usrs = usrs
    }
  },
  actions: {
    async getData({ commit }) {
      await new Promise(resolve => setTimeout(() => {
        commit('setData')
        resolve()
      }, 1000))
    }
  },
  modules: {
  }
})
