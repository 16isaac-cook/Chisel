/*
=== SECTIONS ===
Overview
    A location for quick access to things like recently worked on items, players, etc.
World Objects
    Where the magic happens. For creating and viewing objects such as locations, NPCs, deities, etc.
    The types of objects are as follows:
        - Articles
            - General purpose text pages
            - Players Handbook
        - Buildings
        - Characters
        - Countries
        - Deities
        - Documents
        - Ethnicities
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

const explorer = document.querySelector('#explorer');
const menu = document.querySelector('#menu');

explorer.addEventListener('click', e => {
    if(e.target.className == 'explorer-button') {
        const menuID = e.target.getAttribute('href');
        const activeMenu = menu.querySelector('div[data-active=true]');
        const newActive = menu.querySelector(menuID);
        if(activeMenu !== newActive) {
            activeMenu.dataset.active = false;
            newActive.dataset.active = true;
        }
    }
});

const tag = new Tag('tag');

const test = new Building('test', [tag]);
console.log(test);

document.querySelector('#form').addEventListener('submit', e => {
    e.preventDefault();
    const input = document.querySelector('#text');
    //test.addTag(input.value);
    test.tags.add(input.value);
    console.log(test);
});