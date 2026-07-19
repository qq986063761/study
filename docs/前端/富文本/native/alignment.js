/**
 * 文本对齐功能模块
 */
class AlignmentManager {
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

  setAlignment(alignment) {
    const editor = this.getEditor();
    if (!editor) return;

    // 使用缓存的选区
    const range = this.app.getCachedRange();
    if (!range) return;
    
    // 获取当前选区涉及的所有段落
    const paragraphs = this.getCurrentParagraphs(range);
    if (paragraphs.length === 0) {
      // 如果没有找到段落，获取整行内容并包裹在段落中
      const lineContents = this.getLineContents(range);
      const paragraph = document.createElement('div');
      paragraph.appendChild(lineContents);
      range.insertNode(paragraph);
      paragraph.style.textAlign = alignment;
    } else {
      // 设置所有涉及段落的对齐方式
      paragraphs.forEach(paragraph => {
        paragraph.style.textAlign = alignment;
      });
    }
    
    // 保持原有选区，不移动光标
    editor.focus();
  }

  /**
   * 获取当前选区涉及的所有段落元素
   * @param {Range} range - 选区范围
   * @returns {Array} 段落元素数组
   */
  getCurrentParagraphs(range) {
    const paragraphs = new Set();
    const blockElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'];
    
    if (range.collapsed) {
      // 如果是光标位置，只返回当前段落
      const paragraph = this.getCurrentParagraph(range);
      return paragraph ? [paragraph] : [];
    }
    
    // 获取选区开始和结束的容器
    let startContainer = range.startContainer;
    let endContainer = range.endContainer;
    
    // 如果容器是文本节点，获取其父元素
    if (startContainer.nodeType === Node.TEXT_NODE) {
      startContainer = startContainer.parentNode;
    }
    if (endContainer.nodeType === Node.TEXT_NODE) {
      endContainer = endContainer.parentNode;
    }
    
    // 向上查找开始和结束的块级元素
    const startBlock = this.findBlockElement(startContainer);
    const endBlock = this.findBlockElement(endContainer);
    
    if (!startBlock || !endBlock) {
      return [];
    }
    
    // 如果开始和结束是同一个块级元素
    if (startBlock === endBlock) {
      return [startBlock];
    }
    
    // 查找开始和结束块级元素之间的所有块级元素
    const allBlocks = this.getBlocksBetween(startBlock, endBlock);
    
    // 过滤出段落元素
    allBlocks.forEach(block => {
      if (blockElements.includes(block.tagName.toLowerCase())) {
        paragraphs.add(block);
      }
    });
    
    return Array.from(paragraphs);
  }

  /**
   * 获取当前选区所在的单个段落（保持向后兼容）
   * @param {Range} range - 选区范围
   * @returns {Element|null} 段落元素
   */
  getCurrentParagraph(range) {
    let node = range.startContainer;
    
    // 向上查找段落元素
    while (node && node !== this.getEditor()) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'].includes(tagName)) {
          return node;
        }
      }
      node = node.parentNode;
    }
    
    return null;
  }

  /**
   * 查找包含指定元素的块级元素
   * @param {Node} element - 要查找的元素
   * @returns {Element|null} 块级元素
   */
  findBlockElement(element) {
    let node = element;
    const blockElements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'li'];
    
    while (node && node !== this.getEditor()) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (blockElements.includes(node.tagName.toLowerCase())) {
          return node;
        }
      }
      node = node.parentNode;
    }
    
    return null;
  }

  /**
   * 获取两个块级元素之间的所有块级元素
   * @param {Element} startBlock - 开始块级元素
   * @param {Element} endBlock - 结束块级元素
   * @returns {Array} 块级元素数组
   */
  getBlocksBetween(startBlock, endBlock) {
    const blocks = [];
    const editor = this.getEditor();
    
    // 如果开始和结束是同一个元素
    if (startBlock === endBlock) {
      return [startBlock];
    }
    
    // 获取编辑器的所有子元素
    const allChildren = Array.from(editor.children);
    const startIndex = allChildren.indexOf(startBlock);
    const endIndex = allChildren.indexOf(endBlock);
    
    if (startIndex === -1 || endIndex === -1) {
      return [startBlock, endBlock];
    }
    
    // 获取范围内的所有元素
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    
    for (let i = start; i <= end; i++) {
      if (allChildren[i]) {
        blocks.push(allChildren[i]);
      }
    }
    
    return blocks;
  }

  getLineContents(range) {
    if (!range.collapsed) {
      // 如果有选区，提取选区内容
      return range.extractContents();
    } else {
      // 如果只是光标位置，获取光标所在行的内容
      const startContainer = range.startContainer;
     
      // 如果是文本节点，获取其父元素
      let container = startContainer.nodeType === Node.TEXT_NODE 
        ? startContainer.parentNode 
        : startContainer;
      
      // 如果 container 是 editor-content 自己，说明内容没有被包裹
      // 则创建一个 div 包裹
      if (container === this.getEditor()) {
        const div = document.createElement('div');
        div.appendChild(startContainer);
        container = div;
      }
      
      // 创建一个新的范围来选中整行
      const lineRange = document.createRange();
      
      // 从行的开始到结束
      lineRange.setStart(container, 0);
      lineRange.setEnd(container, container.childNodes.length);
      
      // 提取整行内容
      const contents = lineRange.extractContents();
      
      // 如果内容为空，添加一个空格
      if (contents.textContent.trim() === '') {
        const textNode = document.createTextNode('\u00A0'); // 不间断空格
        contents.appendChild(textNode);
      }
      
      return contents;
    }
  }
}
