import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    date: '',
    time: ''
  },
  getters: {
    dateTime(state, getters, rootState, rootGetters) {
      return state.date + ' ' + state.time
    }
  },
  // mutations 中处理同步逻辑
  mutations: {
    setTime(state, val) {
      state.time = val
    }
  },
  // actions 中处理异步逻辑
  actions: {
    getDate({state, getters, rootState, rootGetters, commit, dispatch}, val) {
      setTimeout(() => {
        state.date = new Date().toLocaleDateString()
      }, 500)
    }
  },
  // 可以独立子 store，分割模块
  modules: {
    child: {
      // 命名空间 会影响 getters、mutations、actions 的取值方式
      // 如果 namespaced 是 false，则上面三种配置都会挂在根 store 上，只有 state.child.a 这种会有独立对象挂载
      // 如果 namespaced 是 true，则上面三种配置都会以 'child/value' 的形式挂载到 store 上，state 还是和上面一样取值
      namespaced: true,
      state: {
        
      },
      getters: {
        
      },
      mutations: {
        
      },
      actions: {
        
      }
    }
  }
})
