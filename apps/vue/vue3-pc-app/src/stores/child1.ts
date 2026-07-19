import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useChild1Store = defineStore('child1', () => {
  const child1Data = ref<string>('Child1 Store Data')
  const child1Count = ref<number>(0)

  // 计算属性
  const child1Info = computed(() => ({
    data: child1Data.value,
    count: child1Count.value,
    timestamp: new Date().toLocaleTimeString()
  }))

  // 方法
  function updateChild1Data(newData: string) {
    child1Data.value = newData
  }

  function incrementChild1() {
    child1Count.value++
  }

  function resetChild1() {
    child1Count.value = 0
    child1Data.value = 'Child1 Store Data'
  }

  return {
    child1Data,
    child1Count,
    child1Info,
    updateChild1Data,
    incrementChild1,
    resetChild1
  }
})
