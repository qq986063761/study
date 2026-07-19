import {closest} from '@/assets/dom'

// 元素可拖拽
export default {
  name: 'drag',
  bind(el, { value }) {
    if (value === false) return
    el.style.cursor = 'all-scroll'
    // 如果移动元素不是拖拽元素本身，而是父容器
    let { container } = value || {}
    let containerEl = null

    el._init = function () {
      el._helper = {
        el: containerEl || el, // 实际上要改变样式的元素，可能拖拽的手柄元素和实际上的元素会有不同
        x: 0,
        y: 0
      }
      el._helper.el.style.transition = 'unset'
      let rect = el._helper.el.getBoundingClientRect()
      el._helper.initX = rect.left
      el._helper.initY = rect.top
      if (el._helper.el.style.transform) el._helper.el.style.transform = ''
    }
    el._onMouseDown = function (event) {
      if (el._isDisableDrag) return

      el._helper.draging = true

      el._helper.preX = el._helper.x
      el._helper.preY = el._helper.y
      el._helper.startX = -el._helper.x + event.clientX
      el._helper.startY = -el._helper.y + event.clientY
      
      el._helper.bodyUserSelect = document.body.style.userSelect
      document.body.style.userSelect = 'none'

      document.addEventListener('mousemove', el._onMouseMove)
      document.addEventListener('mouseup', el._onMouseUp)
    }
    el._onMouseUp = function (event) {
      el._helper.draging = false
      document.body.style.userSelect = el._helper.bodyUserSelect
      document.removeEventListener('mousemove', el._onMouseMove)
      document.removeEventListener('mouseup', el._onMouseUp)
    }
    el._onMouseMove = function (event) {
      if (!el._helper.draging) return

      let nextX = el._helper.dir === 'v' ? 0 : event.clientX - el._helper.startX
      let nextY = el._helper.dir === 'h' ? 0 : event.clientY - el._helper.startY
      // if (el._helper.preX > nextX && el._helper.initX + nextX < 0 ||
      //   el._helper.preX < nextX && el._helper.initX + nextX + el._helper.el.offsetWidth > window.innerWidth) return
      // if (el._helper.preY > nextY && el._helper.initY + nextY < 0 ||
      //   el._helper.preY < nextY && el._helper.initY + nextY + el._helper.el.offsetHeight > window.innerHeight) return

      el._helper.x = nextX
      el._helper.y = nextY

      el._helper.el.style.transform = `translate3d(${el._helper.x}px, ${el._helper.y}px, 0)`
    }
    el.addEventListener('mousedown', el._onMouseDown)
    
    if (container) {
      let getContainer = () => {
        containerEl = closest(el, container)

        if (containerEl) {
          el._init()
        } else {
          console.warn('没有立即获取到父元素，即将重新获取')
          setTimeout(getContainer, 300)
        }
      }
      getContainer()
    } else {
      el._init()
    }
  },
  update(el, {value}) {
    el._isDisableDrag = value === false
  },
  unbind(el) {
    el.removeEventListener('mousedown', el._onMouseDown)
    document.removeEventListener('mousemove', el._onMouseMove)
    document.removeEventListener('mouseup', el._onMouseUp)
  }
}
