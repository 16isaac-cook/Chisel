const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');
const windowStateKeeper = require('electron-window-state');
try {
	require('electron-reloader')(module);
} catch {}
 
let devMode = true;

let win;
 
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
        height: mainWindowState.height
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

app.on('ready', createWindow);