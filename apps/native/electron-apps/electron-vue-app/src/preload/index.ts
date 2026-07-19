import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const desktopAPI = {
  getSystemInfo: () => ipcRenderer.invoke('desktop:get-system-info'),
  openTextFile: () => ipcRenderer.invoke('desktop:open-text-file'),
  saveTextFile: (path: string | null, content: string) =>
    ipcRenderer.invoke('desktop:save-text-file', { path, content }),
  readClipboard: () => ipcRenderer.invoke('desktop:read-clipboard'),
  writeClipboard: (text: string) => ipcRenderer.invoke('desktop:write-clipboard', text),
  notify: (body: string) => ipcRenderer.invoke('desktop:notify', body)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('desktop', desktopAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.desktop = desktopAPI
}
