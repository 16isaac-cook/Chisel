const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const windowStateKeeper = require('electron-window-state');
try {
	require('electron-reloader')(module);
} catch {}
 
let devMode = true;

let win;

async function writeJSON(data, name, filePath = '') {
    const fullPath = path.join(__dirname, `json/${filePath}/`);
    const jsonPath = path.join(fullPath, `${name}.json`);
    fs.access(fullPath, err => {
        if(err) { 
            fs.mkdir(fullPath, err => { if(err) throw err });
            fs.writeFile(jsonPath, data, err => {
                if(err) throw err;
                console.log(`Saved ${name}.json`);
            })
        } else {
            fs.writeFile(jsonPath, data, err => {
                if(err) throw err;
                console.log(`Saved ${name}.json`);
            })
        }
    })
}

async function readJSON(name, filePath = '') {
    const fullPath = path.join(__dirname, `json/${filePath}/`);
    const jsonPath = path.join(fullPath, `${name}.json`);
    const jsonData = fs.readFileSync(jsonPath, 'utf8', (err, data) => {
        if(err) throw err;
        console.log(data);
        return JSON.stringify(data);
    })
    return jsonData;
}
 
function createWindow() {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1366,
        defaultHeight: 768,
        maximize: false,
        fullscreen: false
    })

    win = new BrowserWindow({
        minWidth: 1366, 
        minHeight: 768,
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadURL(url.format ({
        pathname: path.join(__dirname, 'quill.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindowState.manage(win);

    if(mainWindowState.isMaximized) {
        win.maximize();
    }
    if(mainWindowState.isFullScreen) {
        win.setFullScreen();
    }
    if(devMode) {
        win.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    ipcMain.handle('writeJSON', (e, data, name, filePath) => writeJSON(data, name, filePath));
    ipcMain.handle('readJSON', async (e, name, filePath) => readJSON(name, filePath));
    createWindow();
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) { createWindow(); }
    })
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') { app.quit(); }
})