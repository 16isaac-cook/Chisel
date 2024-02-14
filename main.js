const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs').promises;
const util = require('util');
const windowStateKeeper = require('electron-window-state');
try {
	require('electron-reloader')(module);
} catch {}

let devMode = true;

let win;

const fileNaming = (name, filePath = '') => {
    if(!name.includes('.json')) {
        name = name + '.json';
    }

    return readDir(filePath)
        .then(files => {
            let newName = name;
            let checking = true;
            let number = 2;
            let renamed = false;
            while(checking) {
                files.forEach(file => {
                    console.log(`Comparing ${file.fileName} & ${newName}`);
                    if(file.fileName == newName) {
                        if(number == 2) {
                            if(file.fileName.includes(`-${number}.json`)) {
                                newName = newName.replace(`-${number}.json`, `-${number + 1}.json`);
                                number++;
                            } else {
                                newName = newName.replace('.json', `-${number}.json`);
                            }
                        } else {
                            newName = newName.replace(`-${number}.json`, `-${number + 1}.json`);
                            number++
                        }
                        renamed = true;
                    } else {
                        renamed = false;
                    }
                });
                if(!renamed) {
                    checking = false;
                }
            }
            return newName;
        })
        .catch(err => { throw err; });
}

const writeJSON = async (data, name, filePath = '', rename = '') => {
    const fullPath = path.join(__dirname, `json/${filePath}/`);
    if(!name.includes('.json')) {
        name = name + '.json';
    }
    const jsonPath = path.join(fullPath, `${name}`);

    if(rename != '') {
        const checkNewName = await fileNaming(rename, filePath)
            .then(newName => newName)
            .catch(err => {throw err;});
        const newPath = path.join(fullPath, `${checkNewName}`);
        return fs.mkdir(fullPath, { recursive: true })
            .then(() => {
                return fs.writeFile(jsonPath, data)
                    .then(() => `Created file ${checkNewName} at ${fullPath}`)
                    .catch(err => {throw err;});
            }).then(() => {
                return fs.rename(jsonPath, newPath)
                    .then(() => `Renamed ${name} to ${checkNewName}`)
                    .catch(err => { throw err; });
            })
            .catch(err => {throw err;});
    } else {
        const checkNewName = await fileNaming(name, filePath)
            .then(newName => newName)
            .catch(err => {throw err;});
        const newPath = path.join(fullPath, `${checkNewName}`);
        return fs.mkdir(fullPath, { recursive: true })
            .then(() => {
                return fs.writeFile(newPath, data)
                    .then(() => `Created file ${checkNewName} at ${fullPath}`)
                    .catch(err => {throw err;});
            })
            .catch(err => {throw err;});
    }
}

const readJSON = (name, filePath = '') => {
    const fullPath = path.join(__dirname, `json/${filePath}/`);
    if (!name.includes('.json')) {
        name = name + '.json';
    }
    const jsonPath = path.join(fullPath, `${name}`);

    return fs.readFile(jsonPath, 'utf8')
        .then(data => data)
        .catch(err => { throw err; });
}

const readDir = (filePath = '') => {
    const fullPath = path.join(__dirname, `json/${filePath}/`);

    return fs.readdir(fullPath)
        .then(files => {
            return Promise.all(files.map(file => {
                if(file.includes('.json')) {
                    return readJSON(file, filePath)
                        .then(data => ({ fileName: file, data: data }))
                        .catch(err => { throw err; });
                } else {
                    return { fileName: '', data: `Non-json file, ${file}` };
                }
            }));
        })
        .catch(err => { 
            console.log(`${fullPath} not found, creating...`);
            return fs.mkdir(fullPath, { recursive: true })
                .then(() => {
                    return fs.readdir(fullPath)
                        .then(files => {
                            return Promise.all(files.map(file => {
                                if(file.includes('.json')) {
                                    return readJSON(file, filePath)
                                    .then(data => ({ fileName: file, data: data }))
                                    .catch(err => { throw err; });
                                }
                            }));
                        })
                        .catch(err => { throw err; });
                })
                .catch(err => {throw err;});
        });
}

const getWorldObjects = (filePath = '') => {
    const fullPath = path.join(__dirname, `json/${filePath}/`);

    return fs.readdir(fullPath)
        .then(folders => {
            const onlyFolders = folders.filter(folder => !folder.includes('.'));

            return Promise.all(onlyFolders.map(folder => {
                return readDir(`${filePath}/${folder}`)
                    .then(data => ({ folder, files: data }))
                    .catch(err => { throw err; });
            }));
        })
        .catch(err => { throw err; });
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
    ipcMain.handle('writeJSON', async (e, data, name, filePath, rename) => await writeJSON(data, name, filePath, rename));
    ipcMain.handle('readJSON', async (e, name, filePath) => await readJSON(name, filePath));
    ipcMain.handle('readDir', async (e, filePath) => await readDir(filePath));
    ipcMain.handle('getWorldObjects', async (e, filePath) => await getWorldObjects(filePath));
    createWindow();
    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0) { createWindow(); }
    })
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') { app.quit(); }
})