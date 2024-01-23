const builder = document.querySelector('#builder');
const list = builder.querySelector('#builder-content-list');
const main = builder.querySelector('#builder-content-main');
const mainHeader = main.querySelector('#builder-content-main-header');
const display = main.querySelector('#builder-content-main-display-builder');
const switchButton = main.querySelector('#builder-content-main-display-switch');

let storedBuilder;
let builderHeader = 'Builder';
let builderHTML = {};

/*
- Articles
    - General purpose text pages
    - Players Handbook
- Buildings
- Characters
- Countries
- Deities
- Documents
- Ethnicities
- Family Trees
- Geographic Locations
- Items
- Laws of Nature/Magic
- Languages
- Materials/Resources
- Military Conflicts
- Military Formations
- Myths & Legends
- Organizations
- Professions
- Religions
- Settlements
- Species
- Spells
- Technologies
- Traditions
- Vehicles
*/

//creates the builder HTML
const createBuilder = html => {

};

//sets the builder HTML when creating a new Object
const createNewBuilder = object => {
    switch(object) {
        case 'building': 
            builderHeader = 'Builder - Building';
        default: 
            console.error('Something went wrong creating the builder');
    }
};

//sets the builder HTML when editing an already made Object
const createOldBuilder = object => {
    
};

//creates a preview based on the values already in the builder
const createPreview = () => {
    return Math.random();
};

const switchDisplay = () => {
    let headerText = mainHeader.innerHTML;
    if(headerText === 'Builder') {
        mainHeader.innerHTML = 'Preview';
        switchButton.innerHTML = 'Switch to Builder';
        storedBuilder = display.innerHTML;
        display.innerHTML = createPreview();
    } else {
        mainHeader.innerHTML = builderHeader;
        switchButton.innerHTML = 'Switch to Preview';
        display.innerHTML = storedBuilder;
    }
};

switchButton.addEventListener('click', switchDisplay);