const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');
 
let win;
 
function createWindow() {
    win = new BrowserWindow({
        minWidth: 1366, 
        minHeight: 768,
        autoHideMenuBar: true
    });
    win.loadURL(url.format ({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.maximize();
}
 
app.on('ready', createWindow);