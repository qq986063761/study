import { ref, onMounted, onUnmounted } from 'vue'

// 鼠标位置组合式函数
export function useMouse() {
  const x = ref<number>(0)
  const y = ref<number>(0)

  const updateMouse = (event: MouseEvent) => {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', updateMouse)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', updateMouse)
  })

  return { x, y }
}

// 窗口大小组合式函数
export function useWindowSize() {
  const width = ref<number>(window.innerWidth)
  const height = ref<number>(window.innerHeight)

  const updateSize = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener('resize', updateSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize)
  })

  return { width, height }
}
