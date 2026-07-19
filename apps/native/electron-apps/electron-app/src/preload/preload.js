const { contextBridge, ipcRenderer } = require('electron');

const invoke = (channel, payload) => ipcRenderer.invoke(channel, payload);

// 只暴露业务需要的最小能力集合，渲染进程不接触 Node.js 或原始 ipcRenderer。
contextBridge.exposeInMainWorld('desktop', {
  app: {
    getInfo: () => invoke('app:get-info'),
  },
  window: {
    getState: () => invoke('window:get-state'),
    minimize: () => invoke('window:minimize'),
    toggleMaximize: () => invoke('window:maximize-toggle'),
    close: () => invoke('window:close'),
    onStateChanged: (callback) => {
      const listener = (_event, state) => callback(state);
      ipcRenderer.on('window:state-changed', listener);
      return () => ipcRenderer.removeListener('window:state-changed', listener);
    },
  },
  file: {
    openText: () => invoke('file:open-text'),
    saveText: (payload) => invoke('file:save-text', payload),
    reveal: (filePath) => invoke('file:reveal', filePath),
  },
  dialog: {
    showMessage: (payload) => invoke('dialog:message', payload),
  },
  clipboard: {
    readText: () => invoke('clipboard:read-text'),
    writeText: (text) => invoke('clipboard:write-text', text),
  },
  notification: {
    show: (payload) => invoke('notification:show', payload),
  },
  shell: {
    openExternal: (url) => invoke('shell:open-external', url),
  },
});
