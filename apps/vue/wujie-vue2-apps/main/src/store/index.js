import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: 'light', // light, dark
    usrs: [
      { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员' },
      { id: 2, name: '李四', email: 'lisi@example.com', role: '用户' },
      { id: 3, name: '王五', email: 'wangwu@example.com', role: '用户' }
    ]
  },
  getters: {
  },
  mutations: {
    SET_THEME(state, theme) {
      state.theme = theme
    },
    TOGGLE_THEME(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    SET_USRS(state, usrs) {
      state.usrs = usrs
      // 通知子应用更新
      if (window.$app && window.$app.emit) {
        window.$app.emit('store-state', { prop: 'usrs', value: usrs })
      }
    },
    ADD_USR(state, usr) {
      state.usrs = [...state.usrs, usr]
      // 通知子应用更新
      if (window.$app && window.$app.emit) {
        window.$app.emit('store-state', { prop: 'usrs', value: state.usrs })
      }
    },
    UPDATE_USR(state, { id, ...updates }) {
      const index = state.usrs.findIndex(u => u.id === id)
      if (index !== -1) {
        state.usrs[index] = { ...state.usrs[index], ...updates }
        // 通知子应用更新
        if (window.$app && window.$app.emit) {
          window.$app.emit('store-state', { prop: 'usrs', value: state.usrs })
        }
      }
    },
    DELETE_USR(state, id) {
      state.usrs = state.usrs.filter(u => u.id !== id)
      // 通知子应用更新
      if (window.$app && window.$app.emit) {
        window.$app.emit('store-state', { prop: 'usrs', value: state.usrs })
      }
    }
  },
  actions: {
    toggleTheme({ commit }) {
      commit('TOGGLE_THEME')
    },
    setTheme({ commit }, theme) {
      commit('SET_THEME', theme)
    },
    setUsrs({ commit }, usrs) {
      commit('SET_USRS', usrs)
    },
    addUsr({ commit }, usr) {
      commit('ADD_USR', usr)
    },
    updateUsr({ commit }, { id, ...updates }) {
      commit('UPDATE_USR', { id, ...updates })
    },
    deleteUsr({ commit }, id) {
      commit('DELETE_USR', id)
    }
  },
  modules: {
  }
})
