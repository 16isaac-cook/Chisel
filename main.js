const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const util = require('util');
const windowStateKeeper = require('electron-window-state');
try {
	require('electron-reloader')(module);
} catch {}

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const readdirAsync = util.promisify(fs.readdir);
const mkdirAsync = util.promisify(fs.mkdir);

let devMode = true;

let win;

async function writeJSON(data, name, filePath = '') {
    const fullPath = path.join(__dirname, `json/${filePath}/`);
    if(!name.includes('.json')) {
        name = name + '.json';
    }
    const jsonPath = path.join(fullPath, `${name}`);

    return mkdirAsync(fullPath, { recursive: true })
        .then(() => writeFileAsync(jsonPath, data))
        .then(() => console.log(`Created file ${name} at ${fullPath}`))
        .catch(err => {
            console.error(`Error creating file: ${err.message}`);
            throw err;
        });
}

async function readJSON(name, filePath = '') {
    const fullPath = path.join(__dirname, `json/${filePath}/`);
    if(!name.includes('.json')) {
        name = name + '.json';
    }
    const jsonPath = path.join(fullPath, `${name}`);

    return readFileAsync(jsonPath, 'utf8')
        .then(data => {
            JSON.stringify(data);
        })
        .catch(err => { throw err; });
}

async function readDir(filePath = '') {
    const fullPath = path.join(__dirname, `json/${filePath}/`);

    return readdirAsync(fullPath)
        .then(files => {
            const filePromises = files.map(file => {
                return readJSON(file, filePath)
                        .then(data => ({ fileName: file, data }))
                        .catch(err => { throw err; });
            });

            return Promise.all(filePromises);
        })
        .catch(err => {
            if(err.code === 'ENOENT') {
                return mkdirAsync(fullPath, { recursive: true })
                    .then(() => `File path was not found at "${fullPath}", created it for the future.`)
                    .catch(err => {
                        console.error(`Error creating file: ${err.message}`);
                        throw err;
                    });
            } else {
                throw err;
            }
        })
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
    ipcMain.handle('writeJSON', async (e, data, name, filePath) => await writeJSON(data, name, filePath));
    ipcMain.handle('readJSON', async (e, name, filePath) => await readJSON(name, filePath));
    ipcMain.handle('readDir', async (e, filePath) => await readDir(filePath));
    createWindow();
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) { createWindow(); }
    })
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') { app.quit(); }
})