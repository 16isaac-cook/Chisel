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

const createWorld = (name, theme, author) => {
    const nameFormatted = formatString(name, false);    

    electronAPI.readDir(`quill/${nameFormatted}`)
        .then(data => {
            if(data) {
                //create a new folder with a different name, this one already exists
            } else {
                console.log(`Created folder ${nameFormatted} in quill directory.`);
            }
        })
        .catch(err => console.log(err));
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

    //auther name input
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

    box.addEventListener('submit', e => {
        e.preventDefault();
        const name = box.querySelector('#name-input');
        const theme = box.querySelector('#theme-select');
        const author = box.querySelector('#author-input');

        pop.dataset.active = false;
        while(box.hasChildNodes()) {
            box.removeChild(box.lastChild);
        }

        createWorld(name.value, theme.value, author.value);
    });
}

const openWorld = () => {
    const explorerList = document.querySelector('#explorer-world');
    const explorerHeader = explorerList.querySelector('.small-header');
    explorerList.dataset.active = true;
    explorerHeader.innerHTML = currentWorld;
}

worldCreationPopup();