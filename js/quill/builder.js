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

const createJSONFile = (obj, name) => {
    const jsonString = JSON.stringify(obj, null, '\t');
    window.electronAPI.writeJSON(jsonString, name, 'quill');
};

const switchToBuilder = obj => {
    while(displayQuick.firstChild) {
        displayQuick.removeChild(displayQuick.lastChild);
    }
    const objSelection = builderObjects[obj];
    let newObjClass = new objSelection[2](objSelection[0], objSelection[1]);
    newObjClass.pushHTML();
    getInputs();

    displayQuickMenu.dataset.activeBuilder = false;
    displayBuilder.dataset.activeBuilder = true;
    switchButton.dataset.activeBuilder = true;

    newObjClass = null;
};

const createQuickMenu = () => {
    while(displayBuilder.firstChild) {
        displayBuilder.removeChild(displayBuilder.lastChild);
    }
    switchButton.dataset.activeBuilder = false;
    displayBuilder.dataset.activeBuilder = false;
    displayQuickMenu.dataset.activeBuilder = true;
    builderObjects.forEach((obj, count) => {
        const text = obj[0];
        const textMod = text.toLowerCase().trim().replace(' ', '-');
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

const createObjectJSON = (titleIn, linkCheck, textIns, areaIns, selectIns, radios, typeID, iconID) => {
    const objectJSON = {};
    objectJSON['type'] = typeID;
    if(iconID.includes('line')) {
        objectJSON['icon'] = iconID;
    } else {
        objectJSON['icon'] = iconID + '-fill';
    }
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
        const input = val[0].querySelector('input[name="builder-radio"]:checked').value.trim();
        const eye = val[1].checked;
        const name = val[0].id.substring(val[0].id.indexOf('-') + 1);
        const displayName = val[2].trim();
        objectJSON['extra'][name] = {'name': displayName, 'text': input, 'visible': eye};
    }

    jsonFileName = objectJSON['title']['text'].toLowerCase().replace(' ', '-');
    if(jsonFileName == '') { jsonFileName = 'placeholder'; }
    createJSONFile(objectJSON, jsonFileName);
    createQuickMenu();
}

const getInputs = () => {
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
                titleInput = [queryTextInput, queryLabel.innerText];
            } else {
                textInputs[`pair${key}`] = [queryTextInput, queryEye, queryLabel.innerText];
            }
        } else if(queryLinkCheck) {
            const linkCheck = queryLinkCheck.querySelector('input[type=checkbox]');
            linkCheckInput = linkCheck;
        } else if(queryTextArea) {
            const queryEye = pair.querySelector('input[type=checkbox]');
            textAreas[`pair${key}`] = [queryTextArea, queryEye, queryLabel.innerText];
        } else if(querySelect) {
            const queryEye = pair.querySelector('input[type=checkbox]');
            selectInputs[`pair${key}`] = [querySelect, queryEye, queryLabel.innerText];
        } else if(queryRadio) {
            const queryEye = pair.querySelector('input[type=checkbox]');
            radios[`pair${key}`] = [queryRadio, queryEye, queryLabel.innerText];
        } else {
            console.error('Found nothing in a pair for some reason');
        }
    });

    const typeIDEle = displayBuilder.querySelector('#builder-obj-type');
    const typeID = typeIDEle.dataset.type.toLowerCase().trim().replace(' ', '');
    const iconID = typeIDEle.dataset.icon.toLowerCase().trim().replace(' ', '');

    const saveButtons = displayBuilder.querySelectorAll('.builder-save-button');
    saveButtons.forEach(button => {
        button.addEventListener('click', e => {
            createObjectJSON(titleInput, linkCheckInput, textInputs, textAreas, selectInputs, radios, typeID, iconID);
        });
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

switchButton.addEventListener('click', switchDisplay);

document.querySelector('#builder-content-list-add-button').addEventListener('click', createQuickMenu);