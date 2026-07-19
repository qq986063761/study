const { app, BrowserWindow } = require('electron');
const path = require('node:path');

const { installApplicationMenu } = require('./application-menu');
const { registerIpcHandlers } = require('./ipc-handlers');

if (require('electron-squirrel-startup')) {
  app.quit();
}

function sendWindowState(window) {
  if (window.isDestroyed() || window.webContents.isDestroyed()) return;
  window.webContents.send('window:state-changed', {
    maximized: window.isMaximized(),
    fullScreen: window.isFullScreen(),
  });
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#f3f5f7',
    show: false,
    title: 'Electron Desktop Lab',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../preload/preload.js'),
      sandbox: true,
    },
  });

  window.once('ready-to-show', () => window.show());
  window.on('maximize', () => sendWindowState(window));
  window.on('unmaximize', () => sendWindowState(window));
  window.on('enter-full-screen', () => sendWindowState(window));
  window.on('leave-full-screen', () => sendWindowState(window));

  void window.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.whenReady().then(() => {
  app.setAppUserModelId('com.example.electron-desktop-lab');
  registerIpcHandlers();
  installApplicationMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
