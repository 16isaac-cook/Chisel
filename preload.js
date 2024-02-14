const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
    writeJSON: (data, name, filePath, rename) => ipcRenderer.invoke('writeJSON', data, name, filePath, rename),
    readJSON: (name, filePath) => ipcRenderer.invoke('readJSON', name, filePath),
    readDir: (filePath) => ipcRenderer.invoke('readDir', filePath),
    getWorldObjects: (filePath) => ipcRenderer.invoke('getWorldObjects', filePath)
});