const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
    writeJSON: (data, name, filePath) => ipcRenderer.invoke('writeJSON', data, name, filePath),
    readJSON: (name, filePath) => ipcRenderer.invoke('readJSON', name, filePath)
});