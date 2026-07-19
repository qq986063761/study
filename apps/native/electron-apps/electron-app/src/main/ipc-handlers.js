const {
  app,
  BrowserWindow,
  clipboard,
  dialog,
  ipcMain,
  nativeTheme,
  Notification,
  shell,
} = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

const MAX_TEXT_FILE_SIZE = 1024 * 1024;

function getWindow(event) {
  return BrowserWindow.fromWebContents(event.sender);
}

function requireWindow(event) {
  const window = getWindow(event);
  if (!window) throw new Error('未找到当前窗口');
  return window;
}

function registerIpcHandlers() {
  ipcMain.handle('app:get-info', () => ({
    name: app.getName(),
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron,
    chromiumVersion: process.versions.chrome,
    nodeVersion: process.versions.node,
    platform: process.platform,
    arch: process.arch,
    locale: app.getLocale(),
    darkMode: nativeTheme.shouldUseDarkColors,
    paths: {
      userData: app.getPath('userData'),
      documents: app.getPath('documents'),
      downloads: app.getPath('downloads'),
      temp: app.getPath('temp'),
    },
  }));

  ipcMain.handle('window:get-state', (event) => {
    const window = requireWindow(event);
    return {
      maximized: window.isMaximized(),
      fullScreen: window.isFullScreen(),
      bounds: window.getBounds(),
    };
  });
  ipcMain.handle('window:minimize', (event) => requireWindow(event).minimize());
  ipcMain.handle('window:maximize-toggle', (event) => {
    const window = requireWindow(event);
    if (window.isMaximized()) window.unmaximize();
    else window.maximize();
    return window.isMaximized();
  });
  ipcMain.handle('window:close', (event) => requireWindow(event).close());

  ipcMain.handle('file:open-text', async (event) => {
    const result = await dialog.showOpenDialog(requireWindow(event), {
      title: '打开文本文件',
      properties: ['openFile'],
      filters: [
        { name: '文本文件', extensions: ['txt', 'md', 'json', 'js', 'css', 'html'] },
        { name: '所有文件', extensions: ['*'] },
      ],
    });
    if (result.canceled || result.filePaths.length === 0) return null;

    const filePath = result.filePaths[0];
    const stat = await fs.stat(filePath);
    if (stat.size > MAX_TEXT_FILE_SIZE) {
      throw new Error('演示仅支持打开 1 MB 以内的文本文件');
    }

    return {
      path: filePath,
      name: path.basename(filePath),
      size: stat.size,
      modifiedAt: stat.mtime.toISOString(),
      content: await fs.readFile(filePath, 'utf8'),
    };
  });

  ipcMain.handle('file:save-text', async (event, payload = {}) => {
    const content = String(payload.content ?? '');
    const result = await dialog.showSaveDialog(requireWindow(event), {
      title: '保存文本文件',
      defaultPath: String(payload.defaultPath ?? 'electron-note.txt'),
      filters: [{ name: '文本文件', extensions: ['txt', 'md', 'json'] }],
    });
    if (result.canceled || !result.filePath) return null;

    await fs.writeFile(result.filePath, content, 'utf8');
    return {
      path: result.filePath,
      bytes: Buffer.byteLength(content, 'utf8'),
    };
  });

  ipcMain.handle('file:reveal', (_event, filePath) => {
    if (typeof filePath !== 'string' || filePath.length === 0) {
      throw new TypeError('文件路径不能为空');
    }
    shell.showItemInFolder(filePath);
  });

  ipcMain.handle('dialog:message', (event, payload = {}) => dialog.showMessageBox(requireWindow(event), {
    type: ['none', 'info', 'error', 'question', 'warning'].includes(payload.type)
      ? payload.type
      : 'info',
    title: String(payload.title ?? 'Electron Desktop Lab'),
    message: String(payload.message ?? '原生消息对话框'),
    detail: String(payload.detail ?? ''),
    buttons: ['确定'],
  }));

  ipcMain.handle('clipboard:read-text', () => clipboard.readText());
  ipcMain.handle('clipboard:write-text', (_event, text) => {
    clipboard.writeText(String(text ?? ''));
  });

  ipcMain.handle('notification:show', (_event, payload = {}) => {
    if (!Notification.isSupported()) return false;
    new Notification({
      title: String(payload.title ?? 'Electron Desktop Lab'),
      body: String(payload.body ?? '桌面通知发送成功'),
    }).show();
    return true;
  });

  ipcMain.handle('shell:open-external', async (_event, rawUrl) => {
    const url = new URL(String(rawUrl));
    if (!['https:', 'http:'].includes(url.protocol)) {
      throw new Error('仅允许打开 HTTP 或 HTTPS 链接');
    }
    await shell.openExternal(url.href);
  });
}

module.exports = { registerIpcHandlers };
