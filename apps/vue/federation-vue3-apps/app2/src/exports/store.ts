import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useApp2Store = defineStore('app2', () => {
  const appName = ref('app2')
  const count = ref(0)

  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value += 1
  }

  function setCount(payload: number) {
    count.value = payload
  }

  function incrementAsync() {
    window.setTimeout(() => {
      increment()
    }, 1000)
  }

  return {
    appName,
    count,
    doubleCount,
    increment,
    setCount,
    incrementAsync,
  }
})

export const useStore = useApp2Store
