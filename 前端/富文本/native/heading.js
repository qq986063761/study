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
        const p = document.createElement('div');
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
      // 如果没有选择文本，将当前行变成标题元素
      const currentElement = range.startContainer;
      let targetElement = currentElement;
      
      // 如果当前节点是文本节点，找到其父元素
      if (currentElement.nodeType === Node.TEXT_NODE) {
        targetElement = currentElement.parentElement;

        // 如果父元素就是 editor-content，则创建 div 替换文本节点
        if (targetElement === this.getEditor()) {
          const div = document.createElement('div');
          div.appendChild(currentElement.cloneNode(true));
          targetElement.replaceChild(div, currentElement);
          targetElement = div
        }
      }
        
      // 如果当前元素已经是目标标签，则转换为段落
      if (targetElement.tagName.toLowerCase() === tag.toLowerCase()) {
        // 转换为段落
        const p = document.createElement('div');
        p.innerHTML = targetElement.innerHTML;
        targetElement.parentNode.replaceChild(p, targetElement);
        
        // 将光标移到段落内
        range.setStart(p, 0);
        range.setEnd(p, 0);
      } else {
        // 将当前元素转换为目标标题
        const newElement = document.createElement(tag === 'p' ? 'p' : tag);
        newElement.innerHTML = targetElement.innerHTML || ' &nbsp;';

        // 如果现在 targetElement 是 editor-content，则追加到编辑器中
        if (targetElement === this.getEditor()) {
          targetElement.appendChild(newElement);
        } else {
          targetElement.parentNode.replaceChild(newElement, targetElement);
        }
        
        // 将光标移到新元素内
        range.setStart(newElement, 0);
        range.setEnd(newElement, 0);
      }

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }

    editor.focus();
  }
}
