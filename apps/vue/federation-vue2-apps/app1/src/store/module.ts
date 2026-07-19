const appStoreModule = {
  state: {
    appName: 'app1',
    count: 0
  },
  getters: {
    doubleCount(state: { count: number }): number {
      return state.count * 2
    }
  },
  mutations: {
    increment(state: { count: number }): void {
      state.count++
    },
    setCount(state: { count: number }, payload: number): void {
      state.count = payload
    }
  },
  actions: {
    incrementAsync({ commit }: { commit: Function }): void {
      setTimeout(() => commit('increment'), 1000)
    }
  }
}

export default appStoreModule
