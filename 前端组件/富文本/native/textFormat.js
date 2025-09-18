/**
 * 文本格式模块
 */
class TextFormatter {
  constructor(editor) {
    this.editor = editor;
    this.initTextFormat();
  }

  initTextFormat() {
    // 粗体
    document.getElementById('boldBtn').addEventListener('click', () => {
      this.toggleFormat('bold');
    });

    // 斜体
    document.getElementById('italicBtn').addEventListener('click', () => {
      this.toggleFormat('italic');
    });
  }

  toggleFormat(command) {
    this.editor.execCommand(command);
    this.editor.updateButtonStates();
  }
}
