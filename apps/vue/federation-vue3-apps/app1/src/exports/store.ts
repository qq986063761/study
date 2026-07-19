import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useApp1Store = defineStore('app1', () => {
  const appName = ref('app1')
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

export const useStore = useApp1Store
