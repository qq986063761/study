/**
 * 主题变量配置
 * 提供给主应用和子应用使用，保持视觉风格统一
 */

// ==================== 颜色系统 ====================
export const colors = {
  light: {
    primary: '#2563EB',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    info: '#64748B',
  },
  dark: {
    primary: '#8CC8FF',
    success: '#A8F5B3',
    warning: '#FFD93D',
    danger: '#FF6B9D',
    info: '#B8D4E3',
  },
}

/**
 * 将主题对象转换为 CSS 变量字符串
 * 用于注入到子应用的 :root 元素中
 * @param {Object} themeObj - 主题对象
 * @returns {string} CSS 变量字符串
 */
export function themeToCSSVars(themeObj) {
  const cssVars = []
  
  /**
   * 将 camelCase 转换为 kebab-case
   * @param {string} str - 要转换的字符串
   * @returns {string} kebab-case 格式的字符串
   */
  function toKebabCase(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase()
  }
  
  /**
   * 递归遍历对象，生成 CSS 变量名和值
   * @param {Object} obj - 要遍历的对象
   * @param {string} parentKey - 父级键名
   */
  function traverse(obj, parentKey = '') {
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      const cssVarName = parentKey ? `${parentKey}-${key}` : key
      
      // 如果是对象且不是函数，继续递归
      if (typeof value === 'object' && value !== null && !Array.isArray(value) && typeof value !== 'function') {
        traverse(value, cssVarName)
      } else if (typeof value !== 'function') {
        const varName = `--${toKebabCase(cssVarName)}`
        cssVars.push(`${varName}: ${value};`)
      }
    })
  }
  
  traverse(themeObj)
  return cssVars.join('\n  ')
}

/**
 * 将主题注入到指定文档的 :root 元素
 * @param {Document} doc - 目标文档对象（子应用的 document）
 */
export function injectThemeToDocument(doc) {
  if (!doc || !doc.documentElement) {
    console.warn('无法注入主题：文档对象无效')
    return
  }
  
  // 从 store 中获取当前主题
  // 优先使用主应用的 store（通过 window.$app 或 window.$parentApp）
  const store = window.$app?.store || window.$parentApp?.store || (doc.defaultView && doc.defaultView.$parentApp?.store)
  const themeType = store?.state?.theme || 'light'
  const themeColors = colors[themeType] || colors.light
  const cssVars = themeToCSSVars(themeColors)
  const styleId = 'theme-variables'
  
  // 查找是否已存在样式元素
  let styleElement = doc.getElementById(styleId)
  
  if (!styleElement) {
    // 创建 style 元素
    styleElement = doc.createElement('style')
    styleElement.id = styleId
    doc.head.appendChild(styleElement)
  }
  
  // 设置 CSS 变量
  styleElement.textContent = `:root {\n  ${cssVars}\n}`
}
