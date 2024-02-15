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

    const themes = ['Fantasy', 'Sci-Fi', 'Lovecraftian', 'Steampunk', 'Superhero', 'Western', 'Historical', 'Modern', 'Survival', 'Dystopian', 'Other'];
    themes.forEach(theme => {
        const newOption = document.createElement('option');
        newOption.value = formatString(theme);
        newOption.innerHTML = theme;
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