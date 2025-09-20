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
    
    // 获取当前段落或创建新段落
    let paragraph = this.getCurrentParagraph(range);
    
    if (!paragraph) {
      // 如果没有段落，创建一个
      paragraph = document.createElement('p');
      paragraph.innerHTML = '&nbsp;';
      range.insertNode(paragraph);
    }
    
    // 设置对齐方式
    paragraph.style.textAlign = alignment;
    
    // 将光标移到段落内
    const newRange = document.createRange();
    newRange.selectNodeContents(paragraph);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);

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
