import ResizeObserver from 'resize-observer-polyfill'
import {getBrowser} from './utils'

const resizeHandler = function(entries) {
  for (let entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach(fn => {
        fn();
      });
    }
  }
}

export function addResizeListener(element, fn) {
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    element.__ro__ = new ResizeObserver(resizeHandler);
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
}

export function removeResizeListener(element, fn) {
  if (!element || !element.__resizeListeners__) return;
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect();
  }
}

// 设置光标
export function setSelection(el, offset) {
  if (window.getSelection) {
    // 设置焦点
    if (!el.firstChild) {
      el.focus();
      return;
    }
    // 获取选中信息对象
    var sel = window.getSelection();
    // 创建一个范围对象,初始范围的左右边界点都是文档开头
    var range = document.createRange();
    if (offset !== undefined) {
      //把该范围的开始点设置为指定的节点中的指定偏移量
      range.setStart(el.firstChild, offset);
      range.setEnd(el.firstChild, 1);        
    } else {
      // 定位到末尾
      range.selectNodeContents(el);
      range.collapse(false);
    }
    sel.removeAllRanges();
    // 重新添加一个新的范围对象
    sel.addRange(range);
  } else {
    console.warn('浏览器不支持window.getSelection');
  }
}

/**
 * 匹配选择器
 * @param {HTMLElement} el 元素
 * @param {String} selector 选择器
 * @return {Boolean} 是否匹配到指定元素
 */
export function matches(el, selector) {
  if (!selector) return;

  selector[0] === '>' && (selector = selector.substring(1));

  if (el) {
    try {
      if (el.matches) {
        return el.matches(selector);
      } else if (el.msMatchesSelector) {
        return el.msMatchesSelector(selector);
      } else if (el.webkitMatchesSelector) {
        return el.webkitMatchesSelector(selector);
      }
    } catch (_) {
      return false;
    }
  }

  return false;
}

/**
 * 获取当前真实 dom 样式对象
 * @param {HTMLElement} el 元素
 */
export function getStyle(el) {
  return window.getComputedStyle
    ? window.getComputedStyle(el, null)
    : el.currentStyle;
}

/**
 * 获取最近一个滚动父元素
 * @param {HTMLElement} el dom元素
 */
export function getScrollParent(el) {
  if (matches(el, "body")) {
    return el;
  }
  var style = getStyle(el.parentElement);
  if (
    ['auto', 'scroll'].includes(style.overflow) ||
    ['auto', 'scroll'].includes(style['overflow-x']) ||
    ['auto', 'scroll'].includes(style['overflow-y'])
  ) {
    return el.parentElement;
  } else {
    return getScrollParent(el.parentElement);
  }
}

/**
 * 获取所有的滚动父元素数组
 * @param {HTMLElement} el dom元素
 */
export function getScrollParents(el) {
  const arr = [];
  // 递归向上查找
  function upQuery(tmp) {
    const pEl = getScrollParent(tmp);
    if (matches(pEl, "body")) {
      return;
    }
    if (pEl) {
      arr.push(pEl);
      upQuery(pEl);
    }
  }
  // 执行
  upQuery(el);
  return arr;
}

// 获取父节点
export function getParent(el) {
  return (el.host && el !== document && el.host.nodeType)
    ? el.host
    : el.parentNode;
}

/**
 * 获取指定选择器的祖先元素
 * @param {HTMLElement} el 元素
 * @param {String} selector 选择器
 * @param {HTMLElement} ctx 上下文 dom 元素
 * @param {boolean} includeCTX 查找时，是否包含上下文本身
 */
export function closest(el, selector, ctx, includeCTX) {
  if (el) {
    ctx = ctx || document;

    do {
      if (
        selector != null &&
        (
          selector[0] === '>'
            ? el.parentNode === ctx && matches(el, selector)
            : matches(el, selector)
        ) ||
        includeCTX && el === ctx
      ) {
        return el;
      }

      if (el === ctx) break;
      el = getParent(el);
    } while (el);
  }

  return null;
}

// 动画滚动到指定位置
export function scrollTop(el, from = 0, to, duration = 500) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / duration * 50);

  function scroll(start, end, step) {
    if (start === end) return;

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }

  scroll(from, to, step);
}

// 触发 dom 事件
export function fire(el, eventType) {
  var e = null
  if (getBrowser().indexOf("IE") !== -1) {
    e = document.createEventObject()
    e.eventType = "on" + eventType
    el.fireEvent(e.eventType, e)
  } else {
    e = document.createEvent("HTMLEvents")
    e.initEvent(eventType, false, false)
    el.dispatchEvent(e, eventType)
  }
}