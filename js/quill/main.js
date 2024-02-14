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
        const activeMenu = menu.querySelector(`.menu[data-active=true]`);
        const newActive = menu.querySelector(menuID);
        if(activeMenu !== newActive) {
            activeMenu.dataset.active = false;
            document.querySelector('.current-page').classList.remove('current-page');
            newActive.dataset.active = true;
            e.target.classList.add('current-page');
        }
        if(menuID == '#builder') {
            initiateBuilder(currentWorld, currentWorldFormatted);
        }
        const menuTitle = newActive.querySelector('.menu-header');
        document.title = `Chisel | Quill - ${menuTitle.innerText}`;
    }
});

const createWorldList = () => {
    //create world list :p
};

document.querySelector('#title-bar').addEventListener('click', e => {
    electronAPI.writeJSON('cring', 'spell-2', 'pathfinder/templates', 'super-spell')
        .then(st => console.log(st));
});