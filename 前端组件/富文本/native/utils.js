/**
 * 工具功能模块
 */
class UtilsManager {
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

  clearFormat() {
    document.execCommand('removeFormat');
    this.getEditor().focus();
    this.app.updateEditorState();
  }

  getHtml() {
    const editor = this.getEditor();
    if (!editor) return;
    
    const html = editor.innerHTML;
    console.log('HTML内容:', html);
    alert('HTML内容已输出到控制台，请按F12查看');
  }
}
