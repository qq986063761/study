/**
 * 字体大小功能模块
 */
class FontSizeManager {
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

  applyFontSize(size) {
    const editor = this.getEditor();
    if (!editor) return;

    // 使用缓存的选区
    const range = this.app.getCachedRange();
    if (!range) return;
    
    // 如果选择了文本，直接应用样式
    if (!range.collapsed) {
      const span = document.createElement('span');
      span.style.fontSize = size;
      
      try {
        range.surroundContents(span);
      } catch (e) {
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);
      }
    } else {
      // 如果没有选择文本，插入一个带样式的span
      const span = document.createElement('span');
      span.style.fontSize = size;
      span.innerHTML = '&nbsp;';
      range.insertNode(span);
      
      // 将光标移到span后面
      range.setStartAfter(span);
      range.setEndAfter(span);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    editor.focus();
  }
}
