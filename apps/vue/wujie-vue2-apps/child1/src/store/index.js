import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    text: 'child1 的 store 数据',
    usrs: []
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
