/**
 * 其他功能模块
 */
class EditorUtils {
  constructor(editor) {
    this.editor = editor;
    this.initUtils();
  }

  initUtils() {
    // 清除格式
    document.getElementById('clearBtn').addEventListener('click', () => {
      this.clearFormat();
    });

    // 获取HTML
    document.getElementById('getHtmlBtn').addEventListener('click', () => {
      this.getHtml();
    });
  }

  clearFormat() {
    this.editor.execCommand('removeFormat');
    this.editor.updateButtonStates();
  }

  getHtml() {
    const html = this.editor.editor.innerHTML;
    console.log('HTML内容:', html);
    alert('HTML内容已输出到控制台，请按F12查看');
  }
}
