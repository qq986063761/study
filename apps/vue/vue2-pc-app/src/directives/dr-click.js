// 防重复点击
export default {
  name: 'dr-click',
  bind(el) {
    el.addEventListener('click', () => {
      const oldVal = el.style['pointer-events']
      el.style['pointer-events'] = 'none'
      setTimeout(() => {
        el.style['pointer-events'] = oldVal
      }, 300)
    })
  }
}