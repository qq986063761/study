import {fire} from '@/assets/dom'

function getValByVnode(vnode, type) {
  // 组件和非组件获取对应的变量上的值
  const isComponent = vnode.tag !== 'input'
  return type === 'old' 
    ? (isComponent 
      ? (vnode.data.model 
        ? vnode.data.model.value 
        : vnode.componentOptions.propsData.value) 
      : vnode.data.domProps.value)
    : vnode.elm._inputEl.value
}

function check(el, {value}, vnode, oldVnode, type) {
  if (value === false) return
  
  const val = getValByVnode(vnode)
  if (!val) return // 空值不用检查

  // 值没有变则不用检测，失焦是要检查的不用做旧值判断
  if (oldVnode  && oldVnode.tag && type !== 'blur') {
    const oldVal = getValByVnode(oldVnode, 'old')
    if (val === oldVal) return
  }

  // 原生 input 没有 ref isComponent ? vnode.ref.i.proxy
  const proxy = {
    setValue(val) {
      // 组件 v-model 同步
      if (vnode.componentInstance) {
        vnode.componentInstance.$emit('input', val)
      } else if (vnode.elm) {
        vnode.elm.value = val
        fire(vnode.elm, 'input')
      }
    }
  }

  const {minus, decimal, length, max, min} = value || {}
  const num = Number(val)
  const valStr = val ? String(val) : ''
  
  // 只针对失焦后的检查
  if (type === 'blur') {
    // 一直只有一个负号
    if (minus && valStr === '-') {
      proxy.setValue('')
      return
    }
    
    // 最小值
    if (min && num < min) {
      proxy.setValue(min)
      return
    }
  } else {
    // 最大值
    if (max && num > max) {
      proxy.setValue(max)
      return
    }

    // 负数
    if (!minus && valStr[0] === '-') {
      proxy.setValue('')
      return false
    }

    // 负数
    if (minus && valStr[0] === '-') {
      if (valStr.length > 1 && isNaN(num)) {
        proxy.setValue('')
        return false
      }
    } else if (isNaN(num)) { // 数字
      proxy.setValue('')
      return false
    } else if (length && valStr.length > length) {
      proxy.setValue(valStr.slice(0, length))
      return false
    }

    // 小数
    if (decimal === false && valStr.includes('.')) {
      proxy.setValue('')
      return false
    } else if (decimal && typeof decimal === 'number' && valStr.includes('.')) {
      // 小数精度
      const decimalVal = valStr.split('.')[1] || ''
      if (decimalVal.length > decimal) {
        const intVal = valStr.split('.')[0]
        proxy.setValue(intVal + '.' + decimalVal.slice(0, decimal))
        return
      }
    }
  }
}

function initEvents(el, binding, vnode, oldVnode) {
  el._inputDirParams = {el, binding, vnode, oldVnode}
  if (el._onBlur) return

  el._inputEl = el instanceof HTMLInputElement ? el : el.querySelector('input')

  // 处理一些输入过程中无法处理的事情
  el._onBlur = function () {
    check(
      el._inputDirParams.el, 
      el._inputDirParams.binding, 
      el._inputDirParams.vnode, 
      el._inputDirParams.oldVnode,
      'blur'
    )
  }
  el.addEventListener('blur', el._onBlur)
}

export default {
  name: 'input',
  bind(el, binding, vnode, oldVnode) {
    if (binding.value !== false) initEvents(el, binding, vnode, oldVnode)
    check(el, binding, vnode, oldVnode)
  },
  update(el, binding, vnode, oldVnode) {
    if (binding.value === false) {
      el.removeEventListener('blur', el._onBlur)
      el._onBlur = null
    } else {
      initEvents(el, binding, vnode, oldVnode)
    }
    check(el, binding, vnode, oldVnode)
  },
  unbind(el) {
    el.removeEventListener('blur', el._onBlur)
    el._onBlur = null
    el._inputDirParams = null
  }
}