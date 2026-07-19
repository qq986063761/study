import Vue from 'vue'
import Vuex from 'vuex'
import appStoreModule from './module'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    app2: {
      ...appStoreModule,
      namespaced: true
    }
  }
})
