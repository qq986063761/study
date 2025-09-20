/**
 * 文本格式功能模块
 */
class TextFormatManager {
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

  toggleBold() {
    this.toggleFormat('strong');
    this.getEditor().focus();
    this.app.updateEditorState();
  }

  toggleItalic() {
    this.toggleFormat('em');
    this.getEditor().focus();
    this.app.updateEditorState();
  }

  toggleUnderline() {
    this.toggleFormat('u');
    this.getEditor().focus();
    this.app.updateEditorState();
  }

  toggleStrikethrough() {
    this.toggleFormat('s');
    this.getEditor().focus();
    this.app.updateEditorState();
  }

  /**
   * 通用的格式切换方法
   * @param {string} tagName - 标签名称
   */
  toggleFormat(tagName) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const editor = this.getEditor();
    
    // 检查当前选区是否已经在指定格式中
    const isInFormat = this.isInFormat(tagName, range);
    
    if (isInFormat) {
      // 如果已经在格式中，移除格式
      this.removeFormat(tagName, range);
    } else {
      // 如果不在格式中，添加格式
      this.addFormat(tagName, range);
    }
  }

  /**
   * 检查选区是否在指定格式中
   * @param {string} tagName - 标签名称
   * @param {Range} range - 选区范围
   * @returns {boolean}
   */
  isInFormat(tagName, range) {
    let container = range.commonAncestorContainer;
    
    // 如果光标在文本节点中，获取其父元素
    if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentNode;
    }
    
    // 向上查找是否包含指定格式标签
    while (container && container !== this.getEditor()) {
      if (container.nodeType === Node.ELEMENT_NODE) {
        if (container.tagName.toLowerCase() === tagName) {
          return true;
        }
      }
      container = container.parentNode;
    }
    
    return false;
  }

  /**
   * 添加格式
   * @param {string} tagName - 标签名称
   * @param {Range} range - 选区范围
   */
  addFormat(tagName, range) {
    if (range.collapsed) {
      // 如果只是光标位置，插入格式标签
      const element = document.createElement(tagName);
      element.innerHTML = '&nbsp;';
      range.insertNode(element);
      
      // 将光标移到元素内
      const newRange = document.createRange();
      newRange.selectNodeContents(element);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // 如果有选区，用格式标签包裹选区内容
      const element = document.createElement(tagName);
      try {
        range.surroundContents(element);
      } catch (e) {
        // 如果选区跨越多个元素，提取内容后包裹
        const contents = range.extractContents();
        element.appendChild(contents);
        range.insertNode(element);
      }
    }
  }

  /**
   * 移除格式
   * @param {string} tagName - 标签名称
   * @param {Range} range - 选区范围
   */
  removeFormat(tagName, range) {
    const selection = window.getSelection();
    
    // 查找选区内的所有格式标签
    const walker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          if (node.tagName.toLowerCase() === tagName) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );
    
    const elementsToRemove = [];
    let node;
    
    while (node = walker.nextNode()) {
      elementsToRemove.push(node);
    }
    
    // 移除格式标签，保留文本内容
    elementsToRemove.forEach(element => {
      const parent = element.parentNode;
      while (element.firstChild) {
        parent.insertBefore(element.firstChild, element);
      }
      parent.removeChild(element);
    });
  }
}
