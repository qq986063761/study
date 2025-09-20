/**
 * 前景色功能模块
 */
class ForeColorManager {
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

  applyForeColor(color) {
    const editor = this.getEditor();
    if (!editor) return;

    // 保存当前选区
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // 如果选择了文本，直接应用样式
    if (!range.collapsed) {
      const span = document.createElement('span');
      span.style.color = color;
      
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
      span.style.color = color;
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
