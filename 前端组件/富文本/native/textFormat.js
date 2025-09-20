/**
 * 文本格式功能模块
 */
class TextFormatManager {
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

  toggleBold() {
    document.execCommand('bold');
    this.getEditor().focus();
    this.app.updateEditorState();
  }

  toggleItalic() {
    document.execCommand('italic');
    this.getEditor().focus();
    this.app.updateEditorState();
  }

  toggleUnderline() {
    document.execCommand('underline');
    this.getEditor().focus();
    this.app.updateEditorState();
  }

  toggleStrikethrough() {
    document.execCommand('strikeThrough');
    this.getEditor().focus();
    this.app.updateEditorState();
  }
}
