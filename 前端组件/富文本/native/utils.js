/**
 * 工具功能模块
 */
class UtilsManager {
  constructor(vueApp) {
    this.app = vueApp;
    this.editor = null;
  }

  getEditor() {
    if (!this.editor) {
      this.editor = this.app.$refs.editor;
    }
    return this.editor;
  }

  clearFormat() {
    const editor = this.getEditor();
    if (!editor) return;
    
    // 获取当前选区
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // 如果选择了文本，清除选中内容的格式
    if (!range.collapsed) {
      this.clearSelectedFormat(range);
    } else {
      // 如果没有选择文本，清除光标所在元素的格式
      this.clearElementFormat(range);
    }
    
    // 清除内联样式
    this.removeInlineStyles(range);
    
    editor.focus();
    this.app.updateEditorState();
  }

  /**
   * 清除选中内容的格式
   */
  clearSelectedFormat(range) {
    const contents = range.extractContents();
    const walker = document.createTreeWalker(
      contents,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    );
    
    const elementsToProcess = [];
    let node;
    
    // 收集所有需要处理的元素
    while (node = walker.nextNode()) {
      elementsToProcess.push(node);
    }
    
    // 处理每个元素
    elementsToProcess.forEach(element => {
      // 如果是标题标签，转换为段落
      if (element.tagName && element.tagName.match(/^H[1-6]$/)) {
        const p = document.createElement('p');
        while (element.firstChild) {
          p.appendChild(element.firstChild);
        }
        element.parentNode.replaceChild(p, element);
      }
      // 清除其他格式标签，保留文本内容
      else if (element.tagName && ['STRONG', 'B', 'EM', 'I', 'U', 'S', 'STRIKE'].includes(element.tagName)) {
        const textNode = document.createTextNode(element.textContent);
        element.parentNode.replaceChild(textNode, element);
      }
    });
    
    range.insertNode(contents);
  }

  /**
   * 清除光标所在元素的格式
   */
  clearElementFormat(range) {
    let element = range.startContainer;
    
    // 如果光标在文本节点中，获取其父元素
    if (element.nodeType === Node.TEXT_NODE) {
      element = element.parentElement;
    }
    
    if (!element) return;
    
    // 如果当前元素是标题，转换为段落
    if (element.tagName && element.tagName.match(/^H[1-6]$/)) {
      const p = document.createElement('p');
      p.innerHTML = element.innerHTML;
      element.parentNode.replaceChild(p, element);
      
      // 将光标移到新段落中
      const newRange = document.createRange();
      newRange.selectNodeContents(p);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  }

  getHtml() {
    const editor = this.getEditor();
    if (!editor) return;
    
    const html = editor.innerHTML;
    console.log('HTML内容:', html);
    
    // 检测开发者工具是否开启
    if (!this.isDevToolsOpen()) {
      alert('HTML内容已输出到控制台，请按F12查看');
    }
  }

  /**
   * 移除内联样式
   * @param {Range} range - 选区范围
   */
  removeInlineStyles(range) {
    const walker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    );
    
    const elementsToProcess = [];
    let node;
    
    // 收集所有需要处理的元素
    while (node = walker.nextNode()) {
      elementsToProcess.push(node);
    }
    
    // 处理每个元素，移除内联样式
    elementsToProcess.forEach(element => {
      if (element.nodeType === Node.ELEMENT_NODE) {
        // 移除所有内联样式属性
        const styleAttributes = ['style', 'color', 'background', 'font-size', 'font-weight', 'font-style', 'text-decoration'];
        styleAttributes.forEach(attr => {
          element.removeAttribute(attr);
        });
        
        // 移除style属性
        element.removeAttribute('style');
      }
    });
  }

  /**
   * 检测开发者工具是否开启
   * @returns {boolean} true表示开发者工具已开启，false表示未开启
   */
  isDevToolsOpen() {
    // 方法2: 检测窗口尺寸变化
    if (this.checkWindowResize()) {
      return true;
    }
    
    // 方法3: 检测调试器断点
    if (this.checkDebuggerMethod()) {
      return true;
    }
    
    return false;
  }

  /**
   * 方法2: 通过检测窗口尺寸变化来判断
   */
  checkWindowResize() {
    const threshold = 160;
    return (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    );
  }

  /**
   * 方法3: 通过debugger语句检测
   */
  checkDebuggerMethod() {
    let devtools = false;
    const start = performance.now();
    debugger;
    const end = performance.now();
    // 如果debugger被跳过，说明开发者工具未开启
    return end - start > 100;
  }
}
