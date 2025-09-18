/**
 * 富文本编辑器主类
 */
class RichTextEditor {
  constructor() {
    this.editor = document.getElementById('editor');
    this.currentRange = null; // 保存当前选区
    this.initEventListeners();
  }

  initEventListeners() {
    // 初始化各个功能模块
    this.fontSizeSelector = new FontSizeSelector(this);
    this.fontColorSelector = new FontColorSelector(this);
    this.textFormatter = new TextFormatter(this);
    this.listManager = new ListManager(this);
    this.editorUtils = new EditorUtils(this);

    // 监听编辑器内的选区变化
    this.editor.addEventListener('mouseup', () => {
      setTimeout(() => this.saveCurrentRange(), 0);
    });

    this.editor.addEventListener('keyup', () => {
      setTimeout(() => this.saveCurrentRange(), 0);
    });

    this.editor.addEventListener('mousedown', () => {
      setTimeout(() => this.saveCurrentRange(), 0);
    });

    this.editor.addEventListener('keydown', () => {
      setTimeout(() => this.saveCurrentRange(), 0);
    });

    // 监听选择变化，更新按钮状态
    document.addEventListener('selectionchange', () => {
      this.updateButtonStates();
    });

    // 监听键盘快捷键
    this.editor.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });
  }

  saveCurrentRange() {
    // 保存当前选区，只保存编辑器内的选区
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      // 检查选区是否在编辑器内
      if (this.editor.contains(range.commonAncestorContainer) || 
          this.editor.contains(range.startContainer) || 
          this.editor.contains(range.endContainer)) {
        this.currentRange = range.cloneRange();
      }
    }
  }

  restoreRange() {
    // 恢复选区
    if (this.currentRange) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(this.currentRange);
    }
  }

  execCommand(command, showUI = false, value = null) {
    console.log('execCommand', command, showUI, value, this.currentRange)
    
    // 特殊处理字体大小和颜色
    if (command === 'fontSize' && value) {
      this.setFontSize(value);
    } else if (command === 'foreColor' && value) {
      this.setFontColor(value);
    } else {
      document.execCommand(command, showUI, value);
    }
    
    this.editor.focus();
  }

  setFontSize(size) {
    // 使用保存的选区设置字体大小
    if (this.currentRange) {
      // 先恢复选区
      this.restoreRange();
      
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // 如果选择了文本，直接应用样式
        if (!range.collapsed) {
          // 创建span元素包装选中文本
          const span = document.createElement('span');
          span.style.fontSize = size;
          
          try {
            range.surroundContents(span);
          } catch (e) {
            // 如果surroundContents失败，使用extractContents和insertNode
            const contents = range.extractContents();
            span.appendChild(contents);
            range.insertNode(span);
          }
        } else {
          // 如果没有选择文本，插入一个带样式的span
          const span = document.createElement('span');
          span.style.fontSize = size;
          span.innerHTML = '&nbsp;'; // 插入一个空格
          range.insertNode(span);
          
          // 将光标移到span后面
          range.setStartAfter(span);
          range.setEndAfter(span);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  }

  setFontColor(color) {
    // 使用保存的选区设置字体颜色
    if (this.currentRange) {
      // 先恢复选区
      this.restoreRange();
      
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // 如果选择了文本，直接应用样式
        if (!range.collapsed) {
          // 创建span元素包装选中文本
          const span = document.createElement('span');
          span.style.color = color;
          
          try {
            range.surroundContents(span);
          } catch (e) {
            // 如果surroundContents失败，使用extractContents和insertNode
            const contents = range.extractContents();
            span.appendChild(contents);
            range.insertNode(span);
          }
        } else {
          // 如果没有选择文本，插入一个带样式的span
          const span = document.createElement('span');
          span.style.color = color;
          span.innerHTML = '&nbsp;'; // 插入一个空格
          range.insertNode(span);
          
          // 将光标移到span后面
          range.setStartAfter(span);
          range.setEndAfter(span);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  }


  updateButtonStates() {
    // 更新粗体按钮状态
    const boldBtn = document.getElementById('boldBtn');
    boldBtn.classList.toggle('active', document.queryCommandState('bold'));

    // 更新斜体按钮状态
    const italicBtn = document.getElementById('italicBtn');
    italicBtn.classList.toggle('active', document.queryCommandState('italic'));

    // 更新列表按钮状态
    const unorderedListBtn = document.getElementById('unorderedListBtn');
    const orderedListBtn = document.getElementById('orderedListBtn');

    unorderedListBtn.classList.toggle('active', document.queryCommandState('insertUnorderedList'));
    orderedListBtn.classList.toggle('active', document.queryCommandState('insertOrderedList'));
  }

  handleKeyboardShortcuts(e) {
    // Ctrl+B: 粗体
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      this.toggleFormat('bold');
    }
    // Ctrl+I: 斜体
    else if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      this.toggleFormat('italic');
    }
    // Tab: 增加缩进
    else if (e.key === 'Tab') {
      e.preventDefault();
      this.execCommand('indent');
    }
    // Shift+Tab: 减少缩进
    else if (e.shiftKey && e.key === 'Tab') {
      e.preventDefault();
      this.execCommand('outdent');
    }
  }
}

// 初始化编辑器
document.addEventListener('DOMContentLoaded', () => {
  new RichTextEditor();
});
