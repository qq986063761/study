
import { defineStore } from 'pinia'
export const useErrStore = defineStore('errStore', {
  state: () => ({
    errList: []
  }),
  actions: {
    async add(opts) {
      if (!opts) return
      
      let date = new Date()
      opts.dateTxt = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()

      this.errList.push(opts)
    }
  }
})