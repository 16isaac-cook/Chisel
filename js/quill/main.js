/*
=== SECTIONS ===
Overview
    A location for quick access to things like recently worked on items, players, etc.
World Objects
    Where the magic happens. For creating and viewing objects such as locations, NPCs, deities, etc.
    The types of objects are as follows:
        'Building', 'home-3'
        'Celestial Body', 'moon'
        'Character', 'user'
        'Condition', 'alert'
        'Conflict', 'sword'
        'Country', 'government'
        'Currency', 'coins'
        'Deity', 'psychotherapy'
        'Document', 'file-paper-2'
        'Ethnicity', 'walk'
        'Geographic Location', 'landscape'
        'Item', 'key-2'
        'Landmark', 'building-2'
        'Language', 'character-recognition'
        'Material', 'box-3'
        'Military', 'honour'
        'Myth', 'book-2'
        'Natural Law', 'flashlight'
        'Organization', 'team'
        'Profession', 'account-box'
        'Religion', 'sparkling-line'
        'Rule', 'dice'
        'Settlement', 'community'
        'Species', 'aliens'
        'Spell', 'fire'
        'Technology', 'flask'
        'Title', 'vip-crown'
        'Tradition', 'chat-history'
        'Vehicle', 'riding-line'
Maps
    Where maps are created, including things like image upload and POI tick creator
History
    A location for creating timelines, calendars, etc.
Campaigns
    A location for creating and viewing campaigns
    Should have a section for allowing players to view certain world objects at the GM's approval
    Has a World Handout section for creating a general overview of the setting for your players
Writing Tools
    A section for creating things like brainstorming pages, to-do lists, etc.
Files
    Contains quick access to things like images, as well as the actual markdown files themselves
*/

let currentWorld = 'The Land: A Look into The Depths of Ultra-Magic';
let currentWorldFormatted = formatString(currentWorld, false);

const explorer = document.querySelector('#explorer');
const menu = document.querySelector('#menu');

//switch menus on clicking their respective button
explorer.addEventListener('click', e => {
    if(e.target.classList.contains('explorer-button')) {
        const menuID = e.target.getAttribute('href');
        const activeMenu = menu.querySelector(`div[data-active=true]`);
        const newActive = menu.querySelector(menuID);
        if(activeMenu !== newActive) {
            activeMenu.dataset.active = false;
            document.querySelector('.current-page').classList.remove('current-page');
            newActive.dataset.active = true;
            e.target.classList.add('current-page');
        }
        if(menuID == '#builder') {
            createQuickMenu();
            initiateBuilder(currentWorldFormatted);
        }
        const menuTitle = newActive.querySelector('.small-header');
        document.title = `Chisel | Quill - ${menuTitle.innerText}`;
    }
});

//code for select boxes
function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
            }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

const createWorld = () => {
    const explorerList = document.querySelector('#explorer-list-world');
    const explorerHeader = explorerList.querySelector('#explorer-header');
    explorerList.dataset.explorerActive = true;
    explorerHeader.innerHTML = currentWorld;
};

const createWorldList = () => {
    //create world list :p
};

//world creation popup
const worldNamePopup = () => {
    const popup = document.querySelector('#popup');
    popup.dataset.popup = true;
    
    const box = popup.querySelector('#popup-box');
    const header = box.querySelector('#popup-header');
    const input = box.querySelector('#popup-input');
    
    header.innerHTML = 'Enter world name:';

    box.addEventListener('submit', e => {
        const newName = input.value;
        const formattedName = formatString(newName, false, false);

        //jerry-rig this shit to just check if it exists already and make a folder if it doesn't
        electronAPI.readDir(`quill/${formattedName}`)
            .then((data) => {
                console.log('World file already exists, good to go!');
                currentWorld = input.value;
                currentWorldFormatted = formatString(currentWorld, false);
                createWorld();
                popup.dataset.popup = false;
            })
            .catch(err => {
                console.log('Created world file!')
                currentWorld = input.value;
                currentWorldFormatted = formatString(currentWorld, false);
                createWorld();
                popup.dataset.popup = false;
            });
    });
}

//If the user clicks anywhere outside the select box, then close all select boxes:
document.addEventListener("click", closeAllSelect); 

document.querySelector('#builder-content-main-display-quick-access').addEventListener('click', e => {
    if(e.target.classList.contains('builder-choose-button')) {
        switchToBuilder(e.target.dataset.obj);
    } else if(e.target.parentElement.classList.contains('builder-choose-button')) {
        switchToBuilder(e.target.parentElement.dataset.obj);
    } else if(e.target.parentElement.parentElement.classList.contains('builder-choose-button')) {
        switchToBuilder(e.target.parentElement.parentElement.dataset.obj);
    }
});

// document.querySelector('#worlds').querySelector('button').addEventListener('click', e => {
//     worldNamePopup();
// });
createWorld();
