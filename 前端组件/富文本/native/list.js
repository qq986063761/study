/**
 * 列表功能模块
 */
class ListManager {
  constructor(vueApp) {
    this.app = vueApp;
    this.editor = null;
    this.initKeyboardHandlers();
  }

  getEditor() {
    if (!this.editor) {
      this.editor = this.app.$refs.editor;
    }
    return this.editor;
  }

  initKeyboardHandlers() {
    // 监听键盘事件，处理删除键退出列表的逻辑
    setTimeout(() => {
      const editor = this.getEditor();
      if (editor) {
        editor.addEventListener('keydown', (e) => {
          this.handleListKeydown(e);
        });
      }
    }, 100);
  }

  handleListKeydown(e) {
    // 只处理Backspace键
    if (e.key !== 'Backspace') {
      return;
    }

    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      return;
    }

    const range = selection.getRangeAt(0);
    const listItem = this.getCurrentListItem(range);
    
    if (!listItem) {
      return;
    }

    // 检查当前列表项是否为空（只有空白字符）
    const isListItemEmpty = this.isListItemEmpty(listItem);
    if (isListItemEmpty) {
      // 如果列表项为空，阻止默认的删除行为，改为退出列表
      e.preventDefault();
      this.exitList();
    }
  }

  getCurrentListItem(range) {
    // 获取当前光标所在的列表项
    let container = range.startContainer;
    
    // 如果光标在文本节点中，获取其父元素
    if (container.nodeType === Node.TEXT_NODE) {
      container = container.parentNode;
    }
    
    // 向上查找最近的li元素
    while (container && container !== this.editor) {
      if (container.tagName === 'LI') {
        return container;
      }
      container = container.parentNode;
    }
    
    return null;
  }

  isListItemEmpty(listItem) {
    // 检查列表项是否为空（只有空白字符、换行符等）
    const textContent = listItem.textContent || '';
    const trimmedText = textContent.replace(/[\s\n\r\t]/g, '');
    
    // 如果去除空白字符后为空，或者只有&nbsp;
    return trimmedText === '' || trimmedText === '\u00A0';
  }

  exitList() {
    // 退出列表模式
    this.editor.execCommand('outdent');
    
    // 确保光标在正确的位置
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        // 如果光标在空段落中，可以插入一个空格
        if (range.collapsed && range.startContainer.nodeType === Node.TEXT_NODE) {
          const textNode = range.startContainer;
          if (textNode.textContent === '') {
            textNode.textContent = ' ';
            range.setStart(textNode, 1);
            range.setEnd(textNode, 1);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
    }, 0);
  }

  toggleUnorderedList() {
    this.toggleList('insertUnorderedList');
  }

  toggleOrderedList() {
    this.toggleList('insertOrderedList');
  }

  indent() {
    document.execCommand('indent');
    this.getEditor().focus();
    this.app.updateEditorState();
  }

  outdent() {
    document.execCommand('outdent');
    this.getEditor().focus();
    this.app.updateEditorState();
  }

  toggleList(command) {
    // 检查当前是否已经在列表中
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const listItem = range.commonAncestorContainer.parentElement.closest('li');

      if (listItem) {
        // 如果在列表中，先退出列表
        document.execCommand('outdent');
      }
    }

    document.execCommand(command);
    this.getEditor().focus();
    this.app.updateEditorState();
  }
}
