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
let builderWorld = '';
const savedObjects = [];

const populateList = (files = []) => {
    if(typeof files != 'string' && files.length) {
        console.log('Files', files)
        //getting data
        files.forEach(file => {
            if(!savedObjects.find(element => element.folder == file.folder)){
                savedObjects.push({ folder: file.folder, files: file.files });
            }
        });
    }

    savedObjects.forEach(item => {
        if(builderObjects.find(e => formatString(e[1], false, false) == item.folder)) {
            let newFolder = new Folder(item.folder);
            if(!document.querySelector(`[data-folder="${newFolder.plural}"]`)) {
                listDisplay.append(newFolder.html);
            }

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

    const builderList = document.querySelector('#builder-list-display');
    builderList.addEventListener('click', e => {
        if(e.target.classList.contains('item')) {
            const thisItem = e.target.id.replace('builder-item-', '') + '.json';
            const thisFolder = savedObjects.find(obj => obj.folder == formatString(e.target.dataset.parentFolder, false, false));
            const itemData = thisFolder.files.find(obj => obj.fileName == thisItem);
            const thisObj = builderObjects.find(obj => obj[1] == e.target.dataset.parentFolder);
            switchToBuilder(thisObj, itemData);
        }
    });
};

const makeCreateMenu = () => {
    builderObjects.forEach(obj => {
        
    });
};

const switchToBuilder = (builderObj, itemData) => {
    while(mainForm.lastChild) {
        mainForm.firstChild.remove();
    }
    let newObj = new builderObj[3](builderObj[0]);
    newObj.html.forEach(ele => {
        mainForm.append(ele);
    });
    const shownEle = mainDisplay.querySelector('[data-active=true]');
    shownEle.dataset.active = false;
    mainForm.dataset.active = true;
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
                const queryRadio = child.querySelector('input[type="radio"]');
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
                    outputObj['extra'][thisID] = {value: queryArea.value, visible: thisEye};
                }
                //radio
                if(queryRadio) {
                    const thisID = querySelect.id.replace('builder-', '');
                    if(!('extra' in outputObj)) {
                        outputObj['extra'] = {};
                    }
                    outputObj['extra'][thisID] = {value: queryRadio.value, visible: thisEye};
                }
            }
            else {
                console.log('Not a container.');
            }
        });
    }
    console.log(outputObj);
};

const createJSONFile = () => {

};

const switchDisplay = () => {

};

const initiateBuilder = world => {
    builderWorld = world;
    electronAPI.getWorldObjects('quill/TheLand_ALookintoTheDepthsofUltra-Magic')
        .then(data => {
            populateList(data);
        })
        .catch(err => {
            console.error(err);
        });
};

mainForm.addEventListener('submit', e => {
    e.preventDefault();
    createObject();
});

initiateBuilder('TheLand_ALookintoTheDepthsofUltra-Magic');