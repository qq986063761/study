/**
 * 全屏功能模块
 */
class FullscreenManager {
  constructor(vueApp) {
    this.app = vueApp;
    this.editor = null;
    this.container = null;
  }

  getEditor() {
    if (!this.editor) {
      this.editor = this.app.$refs.editor;
    }
    return this.editor;
  }

  getContainer() {
    if (!this.container) {
      this.container = document.querySelector('.editor-container');
    }
    return this.container;
  }

  toggleFullscreen() {
    const container = this.getContainer();
    if (!container) return;

    if (this.app.isFullscreen) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }

  enterFullscreen() {
    const container = this.getContainer();
    if (!container) return;

    container.classList.add('fullscreen');
    this.app.isFullscreen = true;
    
    // 添加ESC键监听
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  exitFullscreen() {
    const container = this.getContainer();
    if (!container) return;

    container.classList.remove('fullscreen');
    this.app.isFullscreen = false;
    
    // 移除ESC键监听
    document.removeEventListener('keydown', this.handleEscapeKey);
  }

  handleEscapeKey = (e) => {
    if (e.key === 'Escape' && this.app.isFullscreen) {
      this.exitFullscreen();
    }
  }
}
