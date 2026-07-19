function getEl(item) {
  return item.$el || item
}

// 滚动获取到合适的激活 item
/*
  v-scroll-active-item="{
    scroller: scroller, // items 所在滚动容器
    items: items, // 列表组件或元素数组
    onScroll: onScroll, // 监听滚动
    currentIndex: currentIndex // 当前激活的 index
  }"
 */
export default {
  name: 'scroll-active-item',
  bind(el, { value }, vnode) {
    el._bindingValue = value
    el._init = () => {
      const {scroller, onScroll} = el._bindingValue || {}
      if (!scroller || !onScroll) return

      el._isBindEvent = true
      scroller.addEventListener('scroll', el._onScroll)
    }
    el._onScroll = event => {
      const {scroller, items, onScroll, currentIndex} = el._bindingValue || {}
      if (!onScroll) return
      
      // 判断当前激活的目标组件超出了视线就换下一个目标
      let index = currentIndex
      if (index === -1) return 

      const prevItem = items[index - 1]
      const nextItem = items[index + 1]
      const rect = scroller.getBoundingClientRect()
      const itemRect = getEl(items[index]).getBoundingClientRect()
      
      if (!el._scrollTop) el._scrollTop = 0
      // 滚动条向下滚动,内容向上滚动
      const isDown = (event.target.scrollTop - el._scrollTop) > 0
      el._scrollTop = event.target.scrollTop

      // 是否已经找到一个目标可以变更了
      let isChange = false
      // 滚动到顶部恢复到第一个选中
      if (!scroller.scrollTop && index !== 0) {
        index = 0
        isChange = true
      }

      // 滚动到底部恢复到最后一个选中
      const resetHeight = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight
      if (!isChange && resetHeight <= 30 && index !== items.length - 1) {
        index = items.length - 1
        isChange = true
      }
      // 判断前一个 item 是否在可视区域内了
      let diff = 120
      if (!isChange && prevItem) {
        // 当前激活的 target 元素超出了顶部
        const isMoreThanBottom = itemRect.bottom > rect.bottom
        const prevItemRect = getEl(prevItem).getBoundingClientRect()
        // 上一个 item 显示在可视区域内部了
        if (isMoreThanBottom &&
          prevItemRect.top > (rect.top + diff) &&
          prevItemRect.bottom < rect.bottom || 
          !isDown && prevItemRect.bottom > (rect.top + rect.height / 2)) {
          index--
          isChange = true
        }
      }
      // 判断后一个 item 是否在可视区域内了
      if (!isChange && nextItem) {
        // 当前激活的 target 元素超出了顶部
        const isMoreThanTop = itemRect.top < rect.top
        const nextItemRect = getEl(nextItem).getBoundingClientRect()
        // 下一个 item 显示在可视区域内部了
        if (isMoreThanTop &&
          nextItemRect.top > rect.top &&
          nextItemRect.bottom < (rect.bottom - diff) || 
          isDown && nextItemRect.top < (rect.top + rect.height / 2) ) {
          index++
          isChange = true
        }
      }
      onScroll.call(vnode.context, event, {index})
    }
    // 销毁事件
    el._removeEvents = () => {
      const {scroller} = el._bindingValue || {}
      if (!scroller) return
      scroller.removeEventListener('scroll', el._onScroll)
    }
    el._init(value)
  },
  update(el, {value}, vnode, oldVnode) {
    el._bindingValue = value
    if (!el._isBindEvent) el._init(value)
  },
  unbind(el) {
    el._removeEvents()
  }
}
