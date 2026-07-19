class DesktopStore extends EventTarget {
  constructor(api) {
    super();
    this.api = api;
    this.state = {
      activeView: 'overview',
      info: null,
      window: null,
      file: null,
      clipboardText: '',
      notice: null,
    };
    this.noticeTimer = null;
    this.removeWindowListener = null;
  }

  subscribe(listener) {
    this.addEventListener('change', listener);
    return () => this.removeEventListener('change', listener);
  }

  emitChange() {
    this.dispatchEvent(new Event('change'));
  }

  setView(view) {
    this.state.activeView = view;
    this.emitChange();
  }

  async initialize() {
    try {
      const [info, windowState] = await Promise.all([
        this.api.app.getInfo(),
        this.api.window.getState(),
      ]);
      this.state.info = info;
      this.state.window = windowState;
      this.removeWindowListener = this.api.window.onStateChanged((state) => {
        this.state.window = { ...this.state.window, ...state };
        this.emitChange();
      });
      this.emitChange();
    } catch (error) {
      this.flash(error.message, 'error');
    }
  }

  async execute(action) {
    try {
      await action();
    } catch (error) {
      this.flash(error instanceof Error ? error.message : String(error), 'error');
    }
  }

  async openFile() {
    const file = await this.api.file.openText();
    if (!file) return;
    this.state.file = file;
    this.setView('files');
    this.flash(`已打开 ${file.name}`);
  }

  async saveFile(content, defaultPath = 'electron-note.txt') {
    const result = await this.api.file.saveText({ content, defaultPath });
    if (!result) return;
    this.flash(`已保存 ${result.bytes} 字节`);
    if (this.state.file) {
      this.state.file = { ...this.state.file, path: result.path, content };
      this.emitChange();
    }
  }

  async revealFile() {
    if (this.state.file?.path) await this.api.file.reveal(this.state.file.path);
  }

  async readClipboard() {
    this.state.clipboardText = await this.api.clipboard.readText();
    this.emitChange();
    this.flash('已读取剪贴板');
  }

  async writeClipboard(text) {
    await this.api.clipboard.writeText(text);
    this.state.clipboardText = text;
    this.emitChange();
    this.flash('已写入剪贴板');
  }

  async showMessage() {
    await this.api.dialog.showMessage({
      title: '原生消息对话框',
      message: '这是由主进程创建的系统对话框。',
      detail: '适合确认、警告和需要用户明确操作的桌面流程。',
      type: 'info',
    });
  }

  async showNotification() {
    const supported = await this.api.notification.show({
      title: 'Electron Desktop Lab',
      body: '桌面通知已从主进程发送。',
    });
    this.flash(supported ? '通知已发送' : '当前系统不支持通知', supported ? 'success' : 'warning');
  }

  async copyRuntimeInfo() {
    await this.api.clipboard.writeText(JSON.stringify(this.state.info, null, 2));
    this.flash('运行时信息已复制');
  }

  async openElectronDocs() {
    await this.api.shell.openExternal('https://www.electronjs.org/docs/latest');
    this.flash('已打开 Electron 文档');
  }

  async minimizeWindow() {
    await this.api.window.minimize();
  }

  async toggleMaximizeWindow() {
    const maximized = await this.api.window.toggleMaximize();
    this.state.window = { ...this.state.window, maximized };
    this.emitChange();
  }

  async closeWindow() {
    await this.api.window.close();
  }

  flash(message, tone = 'success') {
    window.clearTimeout(this.noticeTimer);
    this.state.notice = { message, tone };
    this.emitChange();
    this.noticeTimer = window.setTimeout(() => {
      this.state.notice = null;
      this.emitChange();
    }, 3600);
  }
}

window.DesktopStore = DesktopStore;
