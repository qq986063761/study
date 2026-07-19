
// v-kb-select="{
//   index,
//   itemClass: 'el-select-dropdown__item',
//   onChange: onKeyBoardChange, // onKeyBoardChange({index}) {}
//   onEnter: onKeyBoardEnter
// }"
export default {
  name: 'kb-select',
  bind(el, {value}) {
    let {index = -1, itemClass, onChange, onEnter} = value

    el._kbSelect = {
      isShow: false,
      index,
      onKeyDown(event) {
        let isShow = !!(el.offsetWidth && el.offsetHeight)
        if (isShow && !el._kbSelect.isShow) {
          el._kbSelect.index = index
        }
        el._kbSelect.isShow = isShow

        if (el._kbSelect.isShow) {
          let code = event.keyCode || event.which
          switch (code) {
            case 38:
            case 40:
              let currentIndex = el._kbSelect.index
              
              if (code === 38) {
                currentIndex--
                if (currentIndex < -1) return
              } else {
                currentIndex++
              }

              // 对看不到的元素重新滚动定位到指定位置
              if (itemClass) {
                let children = el.querySelectorAll('.' + itemClass)
                if (children) {
                  let rsEl = children[currentIndex]
                  if (rsEl) {
                    let rect = el.getBoundingClientRect()
                    let rsElRect = rsEl.getBoundingClientRect()
                    if (rsElRect.top >= rect.bottom) {
                      el.scrollTop += rsElRect.height * 2
                    } else if (rsElRect.bottom <= rect.top) {
                      el.scrollTop -= rsElRect.height * 2
                    }
                  } else if (currentIndex > children.length) {
                    return
                  }
                }
              }
              onChange && onChange({
                index: currentIndex
              })
              break
            case 13:
              onEnter && onEnter()
              break
          }
        }
      }
    }
    document.addEventListener('keydown', el._kbSelect.onKeyDown)
  },
  componentUpdated(el, {value}) {
    let {index} = value
    el._kbSelect.index = index
  },
  unbind(el) {
    document.removeEventListener('keydown', el._kbSelect.onKeyDown)
  }
}