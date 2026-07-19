import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useChild2Store = defineStore('child2', () => {
  const child2Data = ref<string>('Child2 Store Data')
  const child2Count = ref<number>(0)

  // 计算属性
  const child2Info = computed(() => ({
    data: child2Data.value,
    count: child2Count.value,
    timestamp: new Date().toLocaleTimeString()
  }))

  // 方法
  function updateChild2Data(newData: string) {
    child2Data.value = newData
  }

  function incrementChild2() {
    child2Count.value++
  }

  function resetChild2() {
    child2Count.value = 0
    child2Data.value = 'Child2 Store Data'
  }

  return {
    child2Data,
    child2Count,
    child2Info,
    updateChild2Data,
    incrementChild2,
    resetChild2
  }
})
