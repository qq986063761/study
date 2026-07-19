import {
  app,
  BrowserWindow,
  clipboard,
  dialog,
  ipcMain,
  nativeTheme,
  Notification,
  shell
} from 'electron'
import { readFile, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { arch, hostname, platform, release } from 'node:os'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const MAX_TEXT_FILE_SIZE = 1024 * 1024

function getWindow(event: Electron.IpcMainInvokeEvent): BrowserWindow {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (!window) throw new Error('The desktop window is unavailable')
  return window
}

function registerIpcHandlers(): void {
  ipcMain.handle('desktop:get-system-info', () => ({
    appVersion: app.getVersion(),
    electronVersion: process.versions.electron,
    chromiumVersion: process.versions.chrome,
    nodeVersion: process.versions.node,
    platform: platform(),
    release: release(),
    arch: arch(),
    hostname: hostname(),
    locale: app.getLocale(),
    theme: nativeTheme.shouldUseDarkColors ? 'Dark' : 'Light',
    homePath: app.getPath('home'),
    documentsPath: app.getPath('documents')
  }))

  ipcMain.handle('desktop:open-text-file', async (event) => {
    const result = await dialog.showOpenDialog(getWindow(event), {
      title: 'Open text file',
      properties: ['openFile'],
      filters: [
        { name: 'Text files', extensions: ['txt', 'md', 'json', 'log', 'csv'] },
        { name: 'All files', extensions: ['*'] }
      ]
    })
    if (result.canceled || result.filePaths.length === 0) return null

    const path = result.filePaths[0]
    const content = await readFile(path, 'utf8')
    if (Buffer.byteLength(content, 'utf8') > MAX_TEXT_FILE_SIZE) {
      throw new Error('Files larger than 1 MB are not supported')
    }
    return { path, name: basename(path), content }
  })

  ipcMain.handle(
    'desktop:save-text-file',
    async (event, payload: { path: string | null; content: string }) => {
      if (Buffer.byteLength(payload.content, 'utf8') > MAX_TEXT_FILE_SIZE) {
        throw new Error('Files larger than 1 MB are not supported')
      }

      let path = payload.path
      if (!path) {
        const result = await dialog.showSaveDialog(getWindow(event), {
          title: 'Save text file',
          defaultPath: 'untitled.md',
          filters: [
            { name: 'Markdown', extensions: ['md'] },
            { name: 'Text', extensions: ['txt'] }
          ]
        })
        if (result.canceled || !result.filePath) return null
        path = result.filePath
      }

      await writeFile(path, payload.content, 'utf8')
      return { path, name: basename(path) }
    }
  )

  ipcMain.handle('desktop:read-clipboard', () => clipboard.readText())
  ipcMain.handle('desktop:write-clipboard', (_, text: string) => clipboard.writeText(text))
  ipcMain.handle('desktop:notify', (_, body: string) => {
    if (Notification.isSupported()) {
      new Notification({ title: 'Desktop Workbench', body }).show()
      return true
    }
    return false
  })
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1120,
    height: 760,
    minWidth: 920,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#f4f7f8',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#f4f7f8',
      symbolColor: '#273239',
      height: 42
    },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const protocol = new URL(url).protocol
    if (protocol === 'https:' || protocol === 'http:') shell.openExternal(url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
