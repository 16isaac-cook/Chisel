/* 
-----------TO DO-----------

Popup function
    World Name
    Theme
    Image
    Author Name

Display Worlds
    Similar to the create menu in builder
    | image |
    | (theme icon) title |
    | author |

Clicking a World loads the World Explorer with that World
    Changes header to World name
    Sets WorldName variables
    Switches to Overview page

*/

const worldsMenu = document.querySelector('div#worlds.menu');
const worldsContent = worldsMenu.querySelector('.content');

const worldThemes = [
    { name: 'Fantasy', icon: 'sword-fill' }, 
    { name: 'Sci-Fi', icon: 'aliens-fill' }, 
    { name: 'Lovecraftian', icon: 'psychotherapy-fill' }, 
    { name: 'Steampunk', icon: 'settings-5-fill' }, 
    { name: 'Superhero', icon: 'user-star-fill' }, 
    { name: 'Western', icon: 'cactus-fill' }, 
    { name: 'Historical', icon: 'quill-pen-fill' }, 
    { name: 'Modern', icon: 'building-4-fill' }, 
    { name: 'Survival', icon: 'seedling-fill' }, 
    { name: 'Dystopian', icon: 'earthquake-fill' }, 
    { name: 'Other', icon: 'box-3-fill' }
];

const switchToWorld = () => {
    const explorerList = document.querySelector('#explorer-world');
    const explorerHeader = explorerList.querySelector('.small-header');
    //enable the list in the explorer, it's hidden by default
    explorerList.dataset.active = true;
    //change the header of the explorer list to the name of the world
    explorerHeader.innerHTML = currentWorld;
    //use main.js switch function, just like what would happen if you clicked a button
    switchToMenu('#overview');
}

// <div class="world-box">
//     <div class="world-box-image"><img src="img/blank.png" alt="" class="image"></div>
//     <div class="world-box-footer">
//         <div class="world-box-footer-name"><i class="ri-settings-5-fill"></i> Settings</div>
//         <div class="world-box-footer-author">John Doe</div>
//     </div>
// </div>

const createWorldBox = (infoJSON, imgSrc, worldName) => {
    const newBox = document.createElement('div');
    newBox.classList.add('world-box');
    newBox.dataset.worldName = worldName;

    const imgBox = document.createElement('div');
    imgBox.classList.add('world-box-image');

    const img = document.createElement('img');
    img.src = imgSrc;
    img.classList.add('image');
    imgBox.append(img);

    newBox.append(imgBox);

    const footer = document.createElement('div');
    footer.classList.add('world-box-footer');

    const footerName = document.createElement('div');
    footerName.classList.add('world-box-footer-name');
    footerName.innerHTML = `<i class="ri-${infoJSON.icon}"></i> ${infoJSON.name}`;
    footer.append(footerName);

    const footerAuthor = document.createElement('div');
    footerAuthor.classList.add('world-box-footer-author');
    footerAuthor.innerHTML = infoJSON.author;
    footer.append(footerAuthor);

    newBox.append(footer);

    worldsContent.append(newBox);
}

const getWorlds = async () => {
    const read = await electronAPI.getWorldObjects('quill');
    read.forEach(folder => {
        const worldInfo = folder.files.find(file => file.fileName == 'world-info.json');
        if(worldInfo) {
            const worldInfoJSON = JSON.parse(worldInfo.data);
            createWorldBox(worldInfoJSON, 'img/blank.png', formatString(worldInfoJSON.name, false, false));
        }
    })
}

getWorlds();

const createWorld = async (name, theme, author) => {
    //format the name for the name of the folder
    let nameFormatted = formatString(name, false);    

    //make folder loop
    let creating = true;
    let number = 2;
    let madeNew = false;
    let missingInfo = true;
    while(creating) {
        //check for the folder
        await electronAPI.readDir(`quill/${nameFormatted}`)
            //if we have the folder already, check if it's empty
            //if it is, just continue it doesn't really matter
            //if it's not, add a number to the name and the loop starts again
            //this will ensure we don't overwrite existing worlds
            .then(data => {
                if(typeof data == 'number' && data > 0) {
                    if(number == 2) {
                        nameFormatted = nameFormatted + '-2';
                    } else {
                        nameFormatted = nameFormatted.replace(`-${number - 1}`, `-${number}`);
                    }
                    number++;
                } else if(typeof data == 'object' && data.length > 0) {
                    data.forEach(file => {
                        if(file.fileName == "world-info.json") {
                            missingInfo = false;
                        }
                    });
                    if(missingInfo) {
                        creating = false;
                    }
                } else if(typeof data == 'number' && data == 0) {
                    madeNew = true;
                    creating = false;
                } else {
                    creating = false;
                }
            })
            //if we don't already have the folder, just make it and keep going
            .catch(() => {
                madeNew = true;
                creating = false;
            });
    }

    if(madeNew || missingInfo) {
        //make the json object that'll be added to the folder with the world info
        const worldJSON = {};
        worldJSON['name'] = name;
        worldJSON['theme'] = theme;
        const themeIcon = worldThemes.find(getTheme => formatString(getTheme.name) == theme).icon;
        worldJSON['icon'] = themeIcon;
        worldJSON['image'] = '';
        worldJSON['author'] = author;
        worldJSON['date-created'] = new Date().toDateString();

        //write the json file to the folder
        electronAPI.writeJSON(JSON.stringify(worldJSON, null, '\t'), 'world-info', `quill/${nameFormatted}`)
            .then(() => {
                //change the current world we're in in main.js
                currentWorld = name;
                currentWorldFormatted = nameFormatted;
                //switch to the world's overview page
                switchToWorld();
            })
            .catch(err => console.error(err));
    }
}

const worldCreationPopup = () => {
    //get popup elements that already exist on the page
    const pop = document.querySelector('#popup');
    const box = pop.querySelector('#popup-box');

    //create the header
    const header = document.createElement('div');
    header.id = 'popup-header';
    header.innerHTML = 'Create New World';
    box.append(header);

    //create name input
    const nameLabel = document.createElement('label');
    nameLabel.htmlFor = 'name-input';
    nameLabel.innerHTML = 'World Name:';
    const nameInput = document.createElement('input');
    nameInput.id = 'name-input';
    nameInput.type = 'text';
    nameInput.required = true;
    box.append(nameLabel, nameInput);

    //world theme select
    const themeLabel = document.createElement('label');
    themeLabel.htmlFor = 'theme-select';
    themeLabel.innerHTML = 'World Theme:';
    const themeSelect = document.createElement('select');
    themeSelect.id = 'theme-select';
    themeSelect.required = true;
    const firstOption = document.createElement('option');
    firstOption.value = '';
    firstOption.innerHTML = 'Choose a theme...';
    themeSelect.append(firstOption);

    
    worldThemes.forEach(theme => {
        const newOption = document.createElement('option');
        newOption.value = formatString(theme.name);
        newOption.innerHTML = theme.name;
        themeSelect.append(newOption);
    });
    box.append(themeLabel, themeSelect);

    //world image upload
    ///////
    //WIP//
    ///////

    //author name input
    const authorLabel = document.createElement('label');
    authorLabel.htmlFor = 'author-input';
    authorLabel.innerHTML = 'Author Name (Optional):';
    const authorInput = document.createElement('input');
    authorInput.id = 'author-input';
    authorInput.type = 'text';
    box.append(authorLabel, authorInput);

    //submit button
    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Create World'
    box.append(submitButton);

    //show popup
    pop.dataset.active = true;

    //
    box.addEventListener('submit', e => {
        //forms refresh the page on submit by default
        e.preventDefault();

        const name = box.querySelector('#name-input');
        const theme = box.querySelector('#theme-select');
        const author = box.querySelector('#author-input');

        //hide the popup
        pop.dataset.active = false;

        //delete everything inside the popup for next time
        while(box.hasChildNodes()) {
            box.removeChild(box.lastChild);
        }

        createWorld(name.value, theme.value, author.value);
    });
}