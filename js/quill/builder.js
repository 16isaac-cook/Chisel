const builder = document.querySelector('#builder');
const list = builder.querySelector('#builder-content-list');
const main = builder.querySelector('#builder-content-main');
const mainHeader = main.querySelector('#builder-content-main-header');
const displayBuilder = main.querySelector('#builder-content-main-display-builder');
const displayPreview = main.querySelector('#builder-content-main-display-preview');
const displayQuickMenu = main.querySelector('#builder-content-main-display-quick-access');
const displayQuick = main.querySelector('#builder-content-main-display-quick-access-buttons');
const switchButton = main.querySelector('#builder-content-main-display-switch');

let builderHeader = '';
let builderWorld;

let openedBuilder = false;
let savedObjects = [];

const createJSONFile = (obj, name) => {
    const jsonString = JSON.stringify(obj, null, '\t');
    window.electronAPI.writeJSON(jsonString, name, `quill/${builderWorld}`)
    .then(log => {
        console.log(log);
        initiateBuilder(builderWorld)
    })
    .catch(err => console.error(err));
};

const createBuilderList = (files = []) => {
    if(typeof files != 'string' && files.length) {
        //getting data
        files.forEach(file => {
            if(!savedObjects.find(element => element.fileName == file.fileName)){
                savedObjects.push({ fileName: file.fileName, data: file.data });
            }
        });
    }

    savedObjects.forEach(item => {
        let newFolderItem = new FolderItem(item.fileName, JSON.parse(item.data));
        const thisFolder = document.querySelector(`#builder-list-folder-${formatString(newFolderItem.data.type.plural, true, true)}-items`);
        if(thisFolder) {
            const newListItem = newFolderItem.createListItem();
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
    });

    const builderList = document.querySelector('#builder-content-list-list');
    builderList.addEventListener('click', e => {
        if(e.target.classList.contains('builder-list-item')) {
            const thisItem = e.target.id.replace('builder-list-item-', '') + '.json';
            const itemData = JSON.parse(savedObjects.find(obj => obj.fileName == thisItem).data);
            const thisObj = builderObjects.findIndex(obj => obj[0] == itemData.type.singular);
            switchToBuilder(thisObj, itemData);
        }
    });
};

const switchToBuilder = (obj, data = null) => {
    while(displayBuilder.firstChild) {
        displayBuilder.removeChild(displayBuilder.lastChild);
    }
    const objSelection = builderObjects[obj];
    let newObjClass = new objSelection[3](objSelection[0], objSelection[1], objSelection[2]);
    newObjClass.pushHTML();

    if(data) {
        getInputs(data);   
    } else {
        getInputs();
    }

    displayQuickMenu.dataset.activeBuilder = false;
    displayBuilder.dataset.activeBuilder = true;
    switchButton.dataset.activeBuilder = true;

    newObjClass = null;
};

const createQuickMenu = () => {
    while(displayQuick.firstChild) {
        displayQuick.removeChild(displayQuick.lastChild);
    }
    while(displayBuilder.firstChild) {
        displayBuilder.removeChild(displayBuilder.lastChild);
    }
    switchButton.dataset.activeBuilder = false;
    displayBuilder.dataset.activeBuilder = false;
    displayQuickMenu.dataset.activeBuilder = true;
    builderObjects.forEach((obj, count) => {
        const text = obj[0];
        const textMod = formatString(text);
        const icon = obj[1];

        const objButton = document.createElement('a');
        objButton.href = `#${textMod}`;
        objButton.classList.add('builder-choose-button');
        objButton.dataset.obj = count;

        const objButtonIcon = document.createElement('div');
        objButtonIcon.classList.add('builder-choose-button-icon');
        objButtonIcon.innerHTML = `<i class="ri-${icon}"></i>`;
        objButton.append(objButtonIcon);

        const objButtonText = document.createElement('div');
        objButtonText.classList.add('builder-choose-button-text');
        objButtonText.innerHTML = text;
        objButton.append(objButtonText);

        displayQuick.append(objButton);
    });
};

const createObjectJSON = (titleIn, linkCheck, textIns, areaIns, selectIns, radios, typeIDEle) => {
    const objectJSON = {};
    objectJSON['type'] = { singular: typeIDEle.dataset.type, plural: typeIDEle.dataset.plural };
    objectJSON['icon'] = typeIDEle.dataset.icon;
    objectJSON['title'] = { 'name': titleIn[1].trim(), text: titleIn[0].value.trim() };
    objectJSON['link'] = linkCheck.checked;
    objectJSON['description'] = {};
    objectJSON['gm-notes'] = {};
    objectJSON['extra'] = {};
    for (const [key, val] of Object.entries(textIns)) {
        const input = val[0].value.trim();
        const eye = val[1].checked;
        const name = val[0].id.substring(val[0].id.indexOf('-') + 1);
        const displayName = val[2].trim();
        objectJSON['extra'][name] = {'name': displayName, 'text': input, 'visible': eye};
    }
    for (const [key, val] of Object.entries(areaIns)) {
        const input = val[0].value.trim();
        const name = val[0].id.substring(val[0].id.indexOf('-') + 1);
        if(name == 'desc') {
            const displayName = val[2].trim();
            objectJSON['description'] = {'name': displayName, 'text': input};
        } else if(name == 'gm-notes') {
            const eye = val[1].checked;
            const displayName = val[2].trim();
            objectJSON['gm-notes'] = {'name': displayName, 'text': input, 'visible': eye};
        } else {
            const eye = val[1].checked;
            const displayName = val[2].trim();
            objectJSON['extra'][name] = {'name': displayName, 'text': input, 'visible': eye};
        }
    }
    for (const [key, val] of Object.entries(selectIns)) {
        const input = val[0].value.trim();
        const eye = val[1].checked;
        const name = val[0].id.substring(val[0].id.indexOf('-') + 1);
        const displayName = val[2].trim();
        objectJSON['extra'][name] = {'name': displayName, 'text': input, 'visible': eye};
    }
    for (const [key, val] of Object.entries(radios)) {
        const input = val[0].querySelector('input[type="radio"]:checked').value.trim();
        const eye = val[1].checked;
        const name = val[0].id.substring(val[0].id.indexOf('-') + 1);
        const displayName = val[2].trim();
        objectJSON['extra'][name] = {'name': displayName, 'text': input, 'visible': eye};
    }

    jsonFileName = formatString(objectJSON['title']['text']);
    if(jsonFileName == '') { jsonFileName = 'placeholder'; }
    createJSONFile(objectJSON, jsonFileName);
    createQuickMenu();
}

const getInputs = (data = null) => {
    const pairs = displayBuilder.querySelectorAll('.pair');
    let titleInput;
    let linkCheckInput;
    const textInputs = {};
    const textAreas = {};
    const selectInputs = {};
    const radios = {};
    pairs.forEach((pair, key) => {
        const queryTextInput = pair.querySelector('input[type=text]');
        const queryTextArea = pair.querySelector('textarea');
        const querySelect = pair.querySelector('select');
        const queryLabel = pair.querySelector('label');
        const queryRadio = pair.querySelector('div.radio');
        const queryLinkCheck = pair.querySelector('#builder-checkbox-link');
        if(queryTextInput) {
            const queryEye = pair.querySelector('input[type=checkbox]');
            if(queryTextInput.id == 'builder-title') {
                if(data) {
                    queryTextInput.value = data.title.text;
                }
                titleInput = [queryTextInput, queryLabel.innerText];
            } else {
                if(data) {
                    const thisID = queryTextInput.id.replace('builder-', '');
                    queryTextInput.value = data.extra[thisID].text;
                    queryEye.checked = data.extra[thisID].visible;
                }
                textInputs[`pair${key}`] = [queryTextInput, queryEye, queryLabel.innerText];
            }
        } else if(queryLinkCheck) {
            const linkCheck = queryLinkCheck.querySelector('input[type=checkbox]');
            if(data) {
                linkCheck.checked = data.link;
            }
            linkCheckInput = linkCheck;
        } else if(queryTextArea) {
            const queryEye = pair.querySelector('input[type=checkbox]');
            if(data) {
                const thisID = queryTextArea.id.replace('builder-', '');
                if(thisID == 'desc') {
                    queryTextArea.value = data.description.text;
                } else if(thisID == 'gm-notes') {
                    queryTextArea.value = data['gm-notes'].text;
                    queryEye.checked = data['gm-notes'].visible;
                } else {
                    queryTextArea.value = data.extra[thisID].text;
                    queryEye.checked = data.extra[thisID].visible;
                }
            }
            textAreas[`pair${key}`] = [queryTextArea, queryEye, queryLabel.innerText];
        } else if(querySelect) {
            const queryEye = pair.querySelector('input[type=checkbox]');
            /*
                add import code once the select code is ready
            */
            selectInputs[`pair${key}`] = [querySelect, queryEye, queryLabel.innerText];
        } else if(queryRadio) {
            const queryEye = pair.querySelector('input[type=checkbox]');
            if(data) {
                const thisID = queryRadio.id.replace('builder-', '');
                const findRadio = queryRadio.querySelector(`input[value=${data.extra[thisID].text}]`);
                findRadio.checked = true;
                queryEye.checked = data.extra[thisID].visible;
            }
            radios[`pair${key}`] = [queryRadio, queryEye, queryLabel.innerText];
        } else {
            console.error('Found nothing in a pair for some reason');
        }
    });

    const typeIDEle = displayBuilder.querySelector('#builder-obj-type');

    displayBuilder.addEventListener('submit', e => {
        e.preventDefault();
        createObjectJSON(titleInput, linkCheckInput, textInputs, textAreas, selectInputs, radios, typeIDEle);
    })
};

const createPreview = () => {
    return 'preview';
};

let preview = false;

const switchDisplay = () => {
    let headerText = mainHeader.innerHTML;
    if(!preview) {
        preview = true;
        builderHeader = mainHeader.innerHTML;
        mainHeader.innerHTML = `Preview`;
        switchButton.innerHTML = 'Switch to Builder';
        builderHeader = headerText;
        displayBuilder.dataset.activeBuilder = false;
        displayPreview.dataset.activeBuilder = true;
    } else {
        preview = false;
        mainHeader.innerHTML = builderHeader;
        switchButton.innerHTML = 'Switch to Preview';
        displayPreview.dataset.activeBuilder = false;
        displayBuilder.dataset.activeBuilder = true;
    }
};

const initiateBuilder = (world) => {
    builderWorld = world;
    window.electronAPI.readDir(`quill/${builderWorld}`)
        .then((data) => {
            createBuilderList(data);
        })
        .catch(err => {
            console.error(err);
        });
};

switchButton.addEventListener('click', switchDisplay);
document.querySelector('#builder-content-list-add-button').addEventListener('click', createQuickMenu);