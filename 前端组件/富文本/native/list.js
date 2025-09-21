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
    this.outdent();
    
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
    this.indentList();
    this.getEditor().focus();
    this.app.updateEditorState();
  }

  outdent() {
    this.outdentList();
    this.getEditor().focus();
    this.app.updateEditorState();
  }

  /**
   * 增加列表缩进
   */
  indentList() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const listItem = this.getCurrentListItem(range);
    
    if (listItem) {
      // 如果当前在列表中，增加缩进
      const parentList = listItem.parentNode;
      if (parentList.tagName === 'UL' || parentList.tagName === 'OL') {
        // 创建新的嵌套列表
        const newList = document.createElement(parentList.tagName);
        newList.appendChild(listItem);
        parentList.parentNode.insertBefore(newList, parentList.nextSibling);
      }
    } else {
      // 如果不在列表中，创建新的列表项
      this.createListItem(range);
    }
  }

  /**
   * 减少列表缩进
   */
  outdentList() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const listItem = this.getCurrentListItem(range);
    
    if (listItem) {
      const parentList = listItem.parentNode;
      const grandParent = parentList.parentNode;
      
      if (grandParent && (grandParent.tagName === 'UL' || grandParent.tagName === 'OL')) {
        // 将当前列表项移到父级列表
        grandParent.insertBefore(listItem, parentList.nextSibling);
        
        // 如果原列表为空，删除它
        if (parentList.children.length === 0) {
          parentList.remove();
        }
      } else {
        // 如果已经是顶级列表，转换为段落
        this.convertListItemToParagraph(listItem);
      }
    }
  }

  /**
   * 创建列表项
   */
  createListItem(range) {
    const listItem = document.createElement('li');
    listItem.innerHTML = '&nbsp;';
    
    if (range.collapsed) {
      range.insertNode(listItem);
    } else {
      const contents = range.extractContents();
      listItem.appendChild(contents);
      range.insertNode(listItem);
    }
    
    // 创建列表容器
    const list = document.createElement('ul');
    list.appendChild(listItem);
    
    // 将列表插入到合适的位置
    const paragraph = this.getCurrentParagraph(range);
    if (paragraph) {
      paragraph.parentNode.insertBefore(list, paragraph.nextSibling);
      paragraph.remove();
    } else {
      range.insertNode(list);
    }
  }

  /**
   * 将列表项转换为段落
   */
  convertListItemToParagraph(listItem) {
    const paragraph = document.createElement('div');
    paragraph.innerHTML = listItem.innerHTML;
    
    const parentList = listItem.parentNode;
    parentList.parentNode.insertBefore(paragraph, parentList.nextSibling);
    listItem.remove();
    
    // 如果列表为空，删除列表
    if (parentList.children.length === 0) {
      parentList.remove();
    }
  }

  /**
   * 获取当前段落
   */
  getCurrentParagraph(range) {
    let node = range.startContainer;
    
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

  toggleList(command) {
    // 检查当前是否已经在列表中
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const listItem = this.getCurrentListItem(range);

      if (listItem) {
        // 如果在列表中，先退出列表
        this.outdentList();
        return;
      }
    }

    // 创建新列表
    this.createList(command);
    this.getEditor().focus();
    this.app.updateEditorState();
  }

  /**
   * 创建新列表
   */
  createList(command) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const listItem = document.createElement('li');
    
    if (range.collapsed) {
      listItem.innerHTML = '&nbsp;';
      range.insertNode(listItem);
    } else {
      const contents = range.extractContents();
      listItem.appendChild(contents);
      range.insertNode(listItem);
    }
    
    // 创建列表容器
    const listTag = command === 'insertOrderedList' ? 'ol' : 'ul';
    const list = document.createElement(listTag);
    list.appendChild(listItem);
    
    // 将列表插入到合适的位置
    const paragraph = this.getCurrentParagraph(range);
    if (paragraph) {
      paragraph.parentNode.insertBefore(list, paragraph.nextSibling);
      paragraph.remove();
    } else {
      range.insertNode(list);
    }
  }
}
