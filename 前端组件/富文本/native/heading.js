/**
 * 标题功能模块
 */
class HeadingManager {
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

  applyHeading(tag) {
    const editor = this.getEditor();
    if (!editor) return;

    // 使用缓存的选区
    const range = this.app.getCachedRange();
    if (!range) return;
    
    // 如果选择了文本，直接应用标题
    if (!range.collapsed) {
      if (tag === 'p') {
        // 转换为段落
        const p = document.createElement('p');
        try {
          range.surroundContents(p);
        } catch (e) {
          const contents = range.extractContents();
          p.appendChild(contents);
          range.insertNode(p);
        }
      } else {
        // 转换为标题
        const heading = document.createElement(tag);
        try {
          range.surroundContents(heading);
        } catch (e) {
          const contents = range.extractContents();
          heading.appendChild(contents);
          range.insertNode(heading);
        }
      }
    } else {
      // 如果没有选择文本，插入一个标题元素
      const element = document.createElement(tag === 'p' ? 'p' : tag);
      element.innerHTML = '&nbsp;';
      range.insertNode(element);
      
      // 将光标移到元素后面
      range.setStartAfter(element);
      range.setEndAfter(element);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    editor.focus();
  }
}
