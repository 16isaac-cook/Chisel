const builder = document.querySelector('#builder');
const list = builder.querySelector('#builder-list');
const listDisplay = list.querySelector('#builder-list-display');
const listButton = list.querySelector('#builder-list-add');
const main = builder.querySelector('#builder-main');
const mainHeader = main.querySelector('.small-header');
const mainDisplay = main.querySelector('#builder-main-display');
const mainCreate = mainDisplay.querySelector('#builder-main-display-create');
const mainForm = mainDisplay.querySelector('#builder-main-display-form');
const mainPreview = mainDisplay.querySelector('#builder-main-display-preview');
const mainSwitch = mainDisplay.querySelector('#builder-main-display-switch');

let openedBuilder = false;
let preview = false;
let savedObjects = [];

const populateList = (files = []) => {
    savedObjects = [];
    if(typeof files != 'string' && files.length) {
        //getting data
        files.forEach(file => {
            if(!savedObjects.find(element => element.folder == file.folder)){
                savedObjects.push({ folder: file.folder, files: file.files });
            }
        });
    }

    while(listDisplay.firstChild) {
        listDisplay.removeChild(listDisplay.lastChild);
    }
    savedObjects.forEach(item => {
        if(builderObjects.find(e => formatString(e[1], false, false) == item.folder)) {
            let newFolder = new Folder(item.folder);
            listDisplay.append(newFolder.html);

            item.files.forEach(file => {
                let newFolderItem = new FolderItem(file.fileName, JSON.parse(file.data), newFolder.plural);
                const thisFolder = document.querySelector(`[data-folder="${newFolderItem.folder}"]`).querySelector('.items');
                if(thisFolder) {
                    const newListItem = newFolderItem.html;
                    let alreadyThere = false;
                    thisFolder.childNodes.forEach(item => {
                        if(item.id == newListItem.id) {
                            alreadyThere = true;
                        }
                    })
                    if(!alreadyThere) {
                        thisFolder.append(newListItem);
                    }
                }
                newFolderItem = null;
            })
            newFolder = null;
        }
    });
};

const makeCreateMenu = () => {
    const buttons = mainCreate.querySelector('#builder-main-display-create-buttons');
    while(buttons.firstChild) {
        buttons.removeChild(buttons.lastChild);
    }
    builderObjects.forEach(obj => {
        const text = obj[0];
        const textMod = formatString(text);
        const icon = obj[2];

        const objButton = document.createElement('a');
        objButton.href = `#${textMod}`;
        objButton.classList.add('object-button');
        objButton.dataset.type = obj[1];

        const objButtonIcon = document.createElement('div');
        objButtonIcon.classList.add('icon');
        objButtonIcon.innerHTML = `<i class="ri-${icon}"></i>`;
        objButton.append(objButtonIcon);

        const objButtonText = document.createElement('div');
        objButtonText.classList.add('text');
        objButtonText.innerHTML = text;
        objButton.append(objButtonText);

        buttons.append(objButton);
    });

    const shownEle = mainDisplay.querySelector('[data-active=true]');
    shownEle.dataset.active = false;
    mainCreate.dataset.active = true;
};

const switchToBuilder = (builderObj, itemData = null, imported = false) => {
    while(mainForm.firstChild) {
        mainForm.removeChild(mainForm.lastChild);
    }
    let newObj = new builderObj[3](builderObj[0]);
    newObj.html.forEach(ele => {
        mainForm.append(ele);
    });

    if(itemData) {
        const jsonData = JSON.parse(itemData);
        
        for(const [key, val] of Object.entries(jsonData)) {
            if(key == 'title') {
                mainForm.querySelector('#builder-title').value = val;
            }  else if (key == 'link') {
                mainForm.querySelector('#builder-checkbox-link-checkbox').checked = val;
            } else if (key == 'description') {
                mainForm.querySelector('#builder-desc').value = val;
            } else if (key == 'gm-notes') {
                mainForm.querySelector(`#builder-${key}`).value = val.value;
                mainForm.querySelector(`#builder-${key}-label`).querySelector('.eye-checkbox').checked = val.visible;
            } else if (key == 'extra') {
                for(const [exKey, exVal] of Object.entries(val)) {
                    if(exKey == 'type') {
                        mainForm.querySelector(`[name="builder-${exKey}"][value="${exVal.value}"]`).checked = true;
                        mainForm.querySelector(`#builder-${exKey}-label`).querySelector('.eye-checkbox').checked = exVal.visible;
                    } else {
                        mainForm.querySelector(`#builder-${exKey}`).value = exVal.value;
                        mainForm.querySelector(`#builder-${exKey}-label`).querySelector('.eye-checkbox').checked = exVal.visible;
                    }
                }
            }
        }

        mainForm.dataset.filename = formatString(jsonData.title, true, true);
    } else {
        mainForm.dataset.filename = '';
    }

    const shownEle = mainDisplay.querySelector('[data-active=true]');
    shownEle.dataset.active = false;
    mainForm.dataset.active = true;
    mainForm.dataset.folder = formatString(builderObj[1], false, false);
};

const createObject = () => {
    const formCh = mainForm.childNodes;
    const outputObj = {};
    if(formCh.length) {
        formCh.forEach(child => {
            if(child.classList.contains('container')) {
                //check for all the different input types within this container
                const queryText = child.querySelector('input[type="text"]');
                const queryArea = child.querySelector('textarea');
                const querySelect = child.querySelector('select');
                const queryRadio = child.querySelectorAll('input[type="radio"]');
                const queryEye = child.querySelector('.eye-checkbox');
                const queryLink = child.querySelector('#builder-checkbox-link-checkbox');

                //visiblity eye
                let thisEye;
                if(queryEye) {
                    thisEye = queryEye.checked;
                }
                //text input
                if(queryText) {
                    const thisID = queryText.id.replace('builder-', '');
                    if(thisID == 'title') {
                        outputObj['title'] = queryText.value;
                    }
                    else {
                        if(!('extra' in outputObj)) {
                            outputObj['extra'] = {};
                        }
                        outputObj['extra'][thisID] = {value: queryText.value, visible: thisEye};
                    }
                }
                //textarea
                if(queryArea) {
                    const thisID = queryArea.id.replace('builder-', '');
                    if(thisID == 'desc') {
                        outputObj['description'] = queryArea.value;
                    }
                    else if(thisID == 'gm-notes') {
                        outputObj['gm-notes'] = {value: queryArea.value, visible: thisEye};
                    }
                    else {
                        if(!('extra' in outputObj)) {
                            outputObj['extra'] = {};
                        }
                        outputObj['extra'][thisID] = {value: queryArea.value, visible: thisEye};
                    }
                }
                //select
                if(querySelect) {
                    const thisID = querySelect.id.replace('builder-', '');
                    if(!('extra' in outputObj)) {
                        outputObj['extra'] = {};
                    }
                    outputObj['extra'][thisID] = {value: querySelect.value, visible: thisEye};
                }
                //radio
                if(queryRadio) {
                    queryRadio.forEach(radio => {
                        if(radio.checked) {
                            const thisID = radio.name.replace('builder-', '');
                            if(!('extra' in outputObj)) {
                                outputObj['extra'] = {};
                            }
                            outputObj['extra'][thisID] = {value: radio.value, visible: thisEye};
                        }
                    });
                }
                //link toggle
                if(queryLink) {
                    outputObj['link'] = queryLink.checked;
                }
            }
        });
    }

    makeCreateMenu();
    let newName;
    let rename;
    if(mainForm.dataset.filename) {
        newName = mainForm.dataset.filename;
        rename = outputObj.title;
    } else {
        newName = outputObj.title
        rename = ''
    }
    return {obj: outputObj, name: newName, rename};
};

const createJSONFile = (object, folder) => {
    const name = formatString(object.name, true, true);
    const rename = formatString(object.rename, true, true);
    electronAPI.writeJSON(JSON.stringify(object.obj, null, '\t'), name, `quill/${currentWorldFormatted}/${folder}`, rename)
        .then(() => initiateBuilder(currentWorld, currentWorldFormatted))
        .catch(err => console.error(err));
};

const switchDisplay = () => {

};

const initiateBuilder = () => {
    electronAPI.getWorldObjects(`quill/${currentWorldFormatted}`)
        .then(data => {
            populateList(data);
            makeCreateMenu();
        })
        .catch(err => {
            console.error(err);
        });
};

list.addEventListener('click', e => {
    if(e.target.classList.contains('item')) {
        const thisItem = e.target.id.replace('builder-item-', '') + '.json';
        const thisFolder = savedObjects.find(obj => obj.folder == formatString(e.target.dataset.parentFolder, false, false));
        const itemData = thisFolder.files.find(obj => obj.fileName == thisItem);
        const thisObj = builderObjects.find(obj => obj[1] == e.target.dataset.parentFolder);
        switchToBuilder(thisObj, itemData.data, true);
    } else if(e.target.id == 'builder-list-add') {
        makeCreateMenu();
    }
});

mainForm.addEventListener('submit', e => {
    e.preventDefault();
    createJSONFile(createObject(), mainForm.dataset.folder);
});

mainCreate.addEventListener('click', e => {
    if(e.target.classList.contains('object-button')) {
        const thisType = e.target.dataset.type;
        const thisObj = builderObjects.find(obj => obj[1] == thisType);
        switchToBuilder(thisObj);
    }
});