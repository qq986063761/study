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
    
    // 获取当前选区所在的段落
    let paragraph = this.getCurrentParagraph(range);
    
    if (!paragraph) {
      console.log('没有找到段落', range);

      // 如果没有找到段落，根据选区情况处理
      if (!range.collapsed) {
        console.log('有选区', range);
        // 如果有选区，将选区内容包裹在段落中
        const contents = range.extractContents();
        paragraph = document.createElement('p');
        paragraph.appendChild(contents);
        range.insertNode(paragraph);
      } else {
        console.log('只是光标位置', range);
        // 如果只是光标位置，创建一个段落
        paragraph = document.createElement('p');
        paragraph.innerHTML = '&nbsp;';
        range.insertNode(paragraph);
      }
    }
    
    // 设置整行的对齐方式
    paragraph.style.textAlign = alignment;
    
    // 保持原有选区，不移动光标
    editor.focus();
  }

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
}
