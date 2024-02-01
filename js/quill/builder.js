const builder = document.querySelector('#builder');
const list = builder.querySelector('#builder-content-list');
const main = builder.querySelector('#builder-content-main');
const mainHeader = main.querySelector('#builder-content-main-header');
const displayBuilder = main.querySelector('#builder-content-main-display-builder');
const displayPreview = main.querySelector('#builder-content-main-display-preview');
const switchButton = main.querySelector('#builder-content-main-display-switch');

let builderHeader = '';

const createJSONFile = obj => {
    console.log(JSON.stringify(obj));
};

const getInputs = () => {
    const pairs = displayBuilder.querySelectorAll('.pair');
    let titleInput;
    const textInputs = {};
    const textAreas = {};
    const selectInputs = {};
    pairs.forEach((pair, key) => {
        const queryTextInput = pair.querySelector('input[type=text]');
        const queryTextArea = pair.querySelector('textarea');
        const querySelect = pair.querySelector('select');
        const queryEye = pair.querySelector('input[type=checkbox]');
        const queryLabel = pair.querySelector('label');
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
        } else {
            console.error('Found nothing in a pair for some reason');
        }
    });

    const typeIDEle = displayBuilder.querySelector('#builder-type');
    const typeID = typeIDEle.dataset.type.toLowerCase().trim().replace(' ', '');

    const saveButton = displayBuilder.querySelector('#builder-save-button');
    saveButton.addEventListener('click', (e, titleIn = titleInput, textIns = textInputs, areaIns = textAreas, selectIns = selectInputs) => {
        const objectJSON = {};
        objectJSON['type'] = typeID;
        objectJSON['title'] = {'name': titleIn[1].trim(), text: titleIn[0].value.trim()}
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
            if(name != 'desc') {
                const eye = val[1].checked;
                const displayName = val[2].trim();
                objectJSON['extra'][name] = {'name': displayName, 'text': input, 'visible': eye};
            } else {
                const displayName = val[2].trim();
                objectJSON['description'] = {'name': displayName, 'text': input};
            }
        }
        for (const [key, val] of Object.entries(selectIns)) {
            const input = val[0].value.trim();
            const eye = val[1].checked;
            const name = val[0].id.substring(val[0].id.indexOf('-') + 1);
            const displayName = val[2].trim();
            objectJSON['extra'][name] = {'name': displayName, 'text': input, 'visible': eye};
        }
        createJSONFile(objectJSON);
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
        displayBuilder.dataset.active = false;
        displayPreview.dataset.active = true;
    } else {
        preview = false;
        mainHeader.innerHTML = builderHeader;
        switchButton.innerHTML = 'Switch to Preview';
        displayPreview.dataset.active = false;
        displayBuilder.dataset.active = true;
    }
};

switchButton.addEventListener('click', switchDisplay);