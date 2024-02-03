const builder = document.querySelector('#builder');
const list = builder.querySelector('#builder-content-list');
const main = builder.querySelector('#builder-content-main');
const mainHeader = main.querySelector('#builder-content-main-header');
const displayBuilder = main.querySelector('#builder-content-main-display-builder');
const displayPreview = main.querySelector('#builder-content-main-display-preview');
const switchButton = main.querySelector('#builder-content-main-display-switch');

let builderHeader = '';

const createJSONFile = (obj, name) => {
    const jsonString = JSON.stringify(obj, null, '\t');
    window.electronAPI.writeJSON(jsonString, name, 'quill');
};

const createObjectJSON = (titleIn, textIns, areaIns, selectIns, radios, typeID, iconID) => {
    const objectJSON = {};
    objectJSON['type'] = typeID;
    if(iconID.includes('line')) {
        objectJSON['icon'] = iconID;
    } else {
        objectJSON['icon'] = iconID + '-fill';
    }
    objectJSON['title'] = { 'name': titleIn[1].trim(), text: titleIn[0].value.trim() };
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
}

const getInputs = () => {
    const pairs = displayBuilder.querySelectorAll('.pair');
    let titleInput;
    const textInputs = {};
    const textAreas = {};
    const selectInputs = {};
    const radios = {};
    pairs.forEach((pair, key) => {
        const queryTextInput = pair.querySelector('input[type=text]');
        const queryTextArea = pair.querySelector('textarea');
        const querySelect = pair.querySelector('select');
        const queryEye = pair.querySelector('input[type=checkbox]');
        const queryLabel = pair.querySelector('label');
        const queryRadio = pair.querySelector('div.radio');
        if(queryTextInput) {
            if(queryTextInput.id == 'builder-title') {
                titleInput = [queryTextInput, queryLabel.innerText];
            } else {
                textInputs[`pair${key}`] = [queryTextInput, queryEye, queryLabel.innerText];
            }
        } else if(queryTextArea) {
            textAreas[`pair${key}`] = [queryTextArea, queryEye, queryLabel.innerText];
        } else if(querySelect) {
            selectInputs[`pair${key}`] = [querySelect, queryEye, queryLabel.innerText];
        } else if(queryRadio) {
            radios[`pair${key}`] = [queryRadio, queryEye, queryLabel.innerText];
        } else {
            console.error('Found nothing in a pair for some reason');
        }
    });

    const typeIDEle = displayBuilder.querySelector('#builder-type');
    const typeID = typeIDEle.dataset.type.toLowerCase().trim().replace(' ', '');
    const iconID = typeIDEle.dataset.icon.toLowerCase().trim().replace(' ', '');

    displayBuilder.addEventListener('click', e => {
        e.preventDefault();
        if(e.target.classList.contains('builder-save-button')){
            createObjectJSON(titleInput, textInputs, textAreas, selectInputs, radios, typeID, iconID);
        }
    });
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