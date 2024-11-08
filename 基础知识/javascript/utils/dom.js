import { getBrowser, userAgent } from "./utils.js";

const IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
const captureMode = {
  capture: false,
  passive: false
};

// 添加 dom 事件监听
function on(el, event, fn) {
  el.addEventListener(event, fn, !IE11OrLess && captureMode);
}

// 移除 dom 事件绑定
function off(el, event, fn) {
  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}

// 触发 dom 事件
function fire(el, eventType) {
  var e = null;
  if (getBrowser().indexOf("IE") !== -1) {
    e = document.createEventObject();
    e.eventType = "on" + eventType;
    el.fireEvent(e.eventType, e);
  } else {
    e = document.createEvent("HTMLEvents");
    e.initEvent(eventType, false, false);
    el.dispatchEvent(e, eventType);
  }
}

/**
 * 匹配选择器
 * @param {HTMLElement} el 元素
 * @param {String} selector 选择器
 * @return {Boolean} 是否匹配到指定元素
 */
function matches(el, selector) {
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

// 获取父节点
function getParent(el) {
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
function closest(el, selector, ctx, includeCTX) {
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

/**
 * 获取当前真实 dom 样式对象
 * @param {HTMLElement} el 元素
 */
function getStyle(el) {
  return window.getComputedStyle
    ? window.getComputedStyle(el, null)
    : el.currentStyle;
}

/**
 * 获取最近一个滚动父元素
 * @param {HTMLElement} el dom元素
 */
function getScrollParent(el) {
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
function getScrollParents(el) {
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

/**
 * 返回所选元素在父元素中的索引
 * @param  {HTMLElement} el
 * @param  {selector} selector 指定了选择器，则返回在这类选择器中的索引
 * @return {number}
 */
function index(el, selector = '>*') {
  var index = 0;

  if (!el || !el.parentNode) {
    return -1;
  }

  while (el && (el = el.previousElementSibling)) {
    if (
      el.nodeName.toUpperCase() !== "TEMPLATE" &&
      (selector === ">*" || matches(el, selector))
    ) {
      index++;
    }
  }

  return index;
}

/**
 * 切换class
 * @param {HTMLElement} el 元素
 * @param {string} name 类名
 * @param {boolean} state 状态开关
 */
const R_SPACE = /\s+/g;
function toggleClass(el, name, state) {
  if (el && name) {
    if (el.classList) {
      el.classList[state ? 'add' : 'remove'](name);
    }
    else {
      let className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
      el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
    }
  }
}

/**
 * 设置 css 样式
 * @param {HTMLElement} el
 * @param {string} prop
 * @param {string} val 像 z-index 这种值必须是字符串
 */
function css(el, prop, val) {
  let style = el && el.style;

  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, '');
      }
      else if (el.currentStyle) {
        val = el.currentStyle;
      }

      return prop === void 0 ? val : val[prop];
    }
    else {
      if (!(prop in style) && prop.indexOf('webkit') === -1) {
        prop = '-webkit-' + prop;
      }

      style[prop] = val + (typeof val === 'string' ? '' : 'px');
    }
  }
}

/**
 * 获取元素相对定位祖先元素（offsetParent）的相对 top 距离
 * @param {Object} el 元素
 * @param {String} selector 选择器
 * @param {number} offset 不是参数，作为尾调用优化的返回数据，内部使用
 */
function offsetTop(el, selector, offset = 0) {
  if (!el || matches(el, selector)) return offset;
  return offsetTop(el.offsetParent, selector, el.offsetTop + offset);
}

/**
 * 获取元素相对定位祖先元素（offsetParent）的相对 left 距离
 * @param {Object} el 元素
 * @param {String} selector 选择器
 * @param {number} offset 不是参数，作为尾调用优化的返回数据，内部使用
 */
function offsetLeft(el, selector, offset = 0) {
  if (!el || matches(el, selector)) return offset;
  return offsetLeft(el.offsetParent, selector, el.offsetLeft + offset);
}

/**
 * 获取元素相对定位祖先元素（offsetParent）的相对距离
 * @param {Object} el 元素
 * @param {String} selector 选择器
 */
function offset(el, selector) {
  if (el) {
    return {
      top: offsetTop(el, selector),
      left: offsetLeft(el, selector)
    };
  } else {
    return null;
  }
}

/**
 * 定位到视图指定元素所在位置
 * @param {HTMLElement} container 容器dom
 * @param {HTMLElement} selected 目标dom
 */
function scrollIntoView(container, selected) {
  if (!selected) {
    container.scrollTop = 0;
    return;
  }

  const offsetParents = [];
  let pointer = selected.offsetParent;
  while (pointer && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer);
    pointer = pointer.offsetParent;
  }
  const top =
    selected.offsetTop +
    offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
  const bottom = top + selected.offsetHeight;
  const viewRectTop = container.scrollTop;
  const viewRectBottom = viewRectTop + container.clientHeight;

  if (top < viewRectTop) {
    container.scrollTop = top;
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight;
  }
}

// 动画滚动到指定位置
function scrollTop(el, from = 0, to, duration = 500) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil((difference / duration) * 50);

  function scroll(start, end, step) {
    if (start === end) return;

    let d = start + step > end ? end : start + step;
    if (start > end) {
      d = start - step < end ? end : start - step;
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

// 设置光标
function setSelection(el, offset) {
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
      // range.setEnd(el.firstChild, 1);        
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