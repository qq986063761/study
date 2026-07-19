/**
 * 防抖
 * @param {function} callback 频繁执行的函数
 * @param {number} wait 毫秒
 */
export function debounce(callback, wait = 300) {
  var timer = null
  return function () {
    clearTimeout(timer)
    // 延迟执行
    timer = setTimeout(() => {
      callback.apply(this, arguments)
    }, wait)
  }
}