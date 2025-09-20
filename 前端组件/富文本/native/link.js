/**
 * 链接功能模块
 */
class LinkManager {
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

  insertLink() {
    const editor = this.getEditor();
    if (!editor) return;

    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // 获取链接URL
    const url = prompt('请输入链接地址:', 'https://');
    if (!url || url === 'https://') return;
    
    // 获取链接文本
    let linkText = '';
    if (!range.collapsed) {
      linkText = range.toString();
    } else {
      linkText = prompt('请输入链接文本:', url);
      if (!linkText) return;
    }
    
    // 创建链接元素
    const link = document.createElement('a');
    link.href = url;
    link.textContent = linkText;
    link.target = '_blank';
    link.style.color = '#007bff';
    link.style.textDecoration = 'underline';
    
    if (!range.collapsed) {
      // 如果有选中文本，替换选中内容
      try {
        range.deleteContents();
        range.insertNode(link);
      } catch (e) {
        // 如果失败，使用extractContents和insertNode
        range.extractContents();
        range.insertNode(link);
      }
    } else {
      // 如果没有选中文本，插入链接
      range.insertNode(link);
    }
    
    // 将光标移到链接后面
    range.setStartAfter(link);
    range.setEndAfter(link);
    selection.removeAllRanges();
    selection.addRange(range);

    editor.focus();
  }
}
