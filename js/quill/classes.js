const formatString = (string, lower = true, hyphen = false) => {
    let newString = string.trim();
    if(hyphen) {
        newString = newString.replaceAll(' ', '-');
    } else {
        newString = newString.replaceAll(' ', '');
    }

    newString = newString.replaceAll('\\', '')
        .replaceAll('/', '')
        .replaceAll(':', '_')
        .replaceAll('*', '')
        .replaceAll('"', '')
        .replaceAll('<', '')
        .replaceAll('>', '')
        .replaceAll('|', '')
        .replaceAll(',', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll("'", '')
        .replaceAll('`', '')
        .replaceAll('~', '')
        .replaceAll('!', '')
        .replaceAll('@', '')
        .replaceAll('#', '')
        .replaceAll('$', '')
        .replaceAll('%', '')
        .replaceAll('^', '')
        .replaceAll('&', '')
        .replaceAll('*', '')
        .replaceAll('+', '')
        .replaceAll('=', '');

    if(lower) {
        newString = newString.toLowerCase()
    }

    
    return newString;
};

//object list folders and items
class Folder {
    constructor(name) {
        this.name = name;
        this.thisObj = builderObjects.find(e => formatString(e[1], false, false) == this.name);
        this.plural = this.thisObj[1];
        this.icon = this.thisObj[2];
        this.id = 'builder-list-folder-' + formatString(this.plural, true, true);
        this.html = this.createHTML();
    }
    createHTML() {
        const listFolder = document.createElement('div');
        listFolder.id = this.id;
        listFolder.classList.add('folder');
        listFolder.dataset.folder = this.plural;

        const folderCheck = document.createElement('input');
        folderCheck.type = 'checkbox';
        folderCheck.id = this.id + '-toggle';
        folderCheck.classList.add('folder-toggle');
        listFolder.append(folderCheck);

        const folderLabel = document.createElement('label');
        folderLabel.htmlFor = folderCheck.id;
        folderLabel.id = this.id + '-label';
        folderLabel.classList.add('folder-label');
        folderLabel.innerHTML = `<i class="ri-${this.icon}"></i> ${this.plural}`;
        listFolder.append(folderLabel);

        const listItems = document.createElement('div');
        listItems.id = this.id + '-items';
        listItems.classList.add('items');
        listFolder.append(listItems);

        return listFolder;
    }
}

class FolderItem {
    constructor(fileName, data, folder) {
        this.fileName = fileName;
        this.data = data;
        this.title = this.data.title;
        this.id = 'builder-item-' + fileName.replace('.json', '');
        this.folder = folder;
        this.html = this.createListItem();
    }
    createListItem() {
        const listItem = document.createElement('div');
        listItem.id = this.id;
        listItem.classList.add('item');
        listItem.innerHTML = this.title;
        listItem.dataset.parentFolder = this.folder;

        return listItem;
    }
}

//builders
class Builder {
    constructor(type, plural, icon) {
        this.type = type;
        this.plural = plural;
        this.icon = icon;
        this.html = [];
        this.header = `Builder - ${type}`;
        this.text('builder-title', `${this.type} Title`, null, null);
        this.box('builder-desc', `${this.type} Description`, null, null);
        this.html.push(this.addLinkCheck('builder-checkbox-link', 'Should this object get auto-linked in other objects?'));
        this.html.push(this.addNote());
        this.box('builder-gm-notes', `GM Notes`, null, false);
    }
    addNote() {
        const newNote = document.createElement('div');
        newNote.id = 'obj-note';
        newNote.classList.add('note');
        newNote.innerHTML = '<i class="ri-eye-fill"></i> = can be seen by players, <i class="ri-eye-close-fill"></i> = cannot be seen by players. Click to toggle';
    
        return newNote;
    }
    addSaveButton() {
        const newSaveButton = document.createElement('input');
        newSaveButton.type = 'submit';
        newSaveButton.classList.add('builder-save-button');
        newSaveButton.value = 'Save Object';

        return newSaveButton;
    }
    addTextInput(id, label, desc, eye = true) {
        const newCont = document.createElement('div');
        newCont.classList.add('container');
        
        const newLabel = document.createElement('label');
        newLabel.id = id + '-label';
        if(eye == true) {
            newLabel.innerHTML = `${label} <input type="checkbox" id="${id}-eye" class="eye-checkbox" checked><label for="${id}-eye" class="eye-checkbox-label"></label>`
        } else if(eye == false) {
            newLabel.innerHTML = `${label} <input type="checkbox" id="${id}-eye" class="eye-checkbox"><label for="${id}-eye" class="eye-checkbox-label"></label>`
        } else if(eye == null) {
            newLabel.innerHTML = label;
        }

        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.id = id;

        let newDesc;
        if(desc) {
            newDesc = document.createElement('p');
            newDesc.innerHTML = desc;
        }

        if(id == 'builder-title') {
            const newWrap = document.createElement('div');
            newWrap.id = 'builder-title-wrapper';
            newInput.required = true;
            newWrap.append(newInput);
            newWrap.append(this.addSaveButton());
            newCont.append(newWrap);
            newCont.append(newLabel);
        } else {
            newCont.append(newLabel);
            newCont.append(newInput);
        }
        if(newDesc) {
            newCont.append(newDesc);
        }

        return newCont;
    }
    addTextbox(id, label, desc, eye = true) {
        const newCont = document.createElement('div');
        newCont.classList.add('container');
        
        const newLabel = document.createElement('label');
        newLabel.id = id + '-label';
        if(eye == true) {
            newLabel.innerHTML = `${label} <input type="checkbox" id="${id}-eye" class="eye-checkbox" checked><label for="${id}-eye" class="eye-checkbox-label"></label>`
        } else if(eye == false) {
            newLabel.innerHTML = `${label} <input type="checkbox" id="${id}-eye" class="eye-checkbox"><label for="${id}-eye" class="eye-checkbox-label"></label>`
        } else if(eye == null) {
            newLabel.innerHTML = label;
        }

        const newTextbox = document.createElement('textarea');
        newTextbox.id = id;

        let newDesc;
        if(desc) {
            newDesc = document.createElement('p');
            newDesc.innerHTML = desc;
        }

        newCont.append(newLabel);
        newCont.append(newTextbox);
        if(newDesc) {
            newCont.append(newDesc);
        }

        return newCont;
    }
    addSelect(id, label, desc, eye = true) {
        const newCont = document.createElement('div');
        newCont.classList.add('container');
        
        const newLabel = document.createElement('label');
        newLabel.id = id + '-label';
        newLabel.for = id;
        if(eye == true) {
            newLabel.innerHTML = `${label} <input type="checkbox" id="${id}-eye" class="eye-checkbox" checked><label for="${id}-eye" class="eye-checkbox-label"></label>`
        } else if(eye == false) {
            newLabel.innerHTML = `${label} <input type="checkbox" id="${id}-eye" class="eye-checkbox"><label for="${id}-eye" class="eye-checkbox-label"></label>`
        } else if(eye == null) {
            newLabel.innerHTML = label;
        }

        const newSelectBox = document.createElement('div');
        newSelectBox.classList.add('select-box');

        const newSelect = document.createElement('select');
        newSelect.id = id;
        newSelectBox.append(newSelect);

        const firstOption = document.createElement('option');
        firstOption.value = 'none';
        firstOption.innerHTML = 'Select object...';
        newSelect.append(firstOption);

        let newDesc;
        if(desc) {
            newDesc = document.createElement('p');
            newDesc.innerHTML = desc;
        }

        const newAddButton = document.createElement('a');
        newAddButton.href = '#';
        newAddButton.id = id + '-link';
        newAddButton.innerHTML = '<i class="ri-add-box-fill"></i> Create and Link a New Object';
        newSelectBox.append(newAddButton);

        newCont.append(newLabel);
        newCont.append(newSelectBox);
        if(newDesc) {
            newCont.append(newDesc);
        }

        return newCont;
    }
    addRadio(id, label, desc, items = [], eye = true) {
        const newCont = document.createElement('div');
        newCont.classList.add('container');
        
        const newLabel = document.createElement('label');
        newLabel.id = id + '-label';
        newLabel.for = id;
        if(eye == true) {
            newLabel.innerHTML = `${label} <input type="checkbox" id="${id}-eye" class="eye-checkbox" checked><label for="${id}-eye" class="eye-checkbox-label"></label>`
        } else if(eye == false) {
            newLabel.innerHTML = `${label} <input type="checkbox" id="${id}-eye" class="eye-checkbox"><label for="${id}-eye" class="eye-checkbox-label"></label>`
        } else if(eye == null) {
            newLabel.innerHTML = label;
        }

        const radioDiv = document.createElement('div');
        radioDiv.id = id;
        radioDiv.classList.add('radio');

        items.forEach((item, count) => {
            const newInput = document.createElement('input');
            newInput.type = 'radio';
            newInput.id = id + `-radio-${count}`;
            newInput.name = id;
            newInput.value = formatString(item);
            if(count == 0) {
                newInput.checked = true;
            }

            const newRLabel = document.createElement('label');
            newRLabel.htmlFor = id + `-radio-${count}`;
            newRLabel.innerHTML = item;

            radioDiv.append(newInput);
            radioDiv.append(newRLabel);
        });

        let newDesc;
        if(desc) {
            newDesc = document.createElement('p');
            newDesc.innerHTML = desc;
        }

        newCont.append(newLabel);
        newCont.append(radioDiv);

        if(newDesc) {
            newCont.append(newDesc);
        }

        return newCont;
    }
    addLinkCheck(id, label) {
        const newCont = document.createElement('div');
        newCont.classList.add('container');
        
        const newLabel = document.createElement('label');
        newLabel.id = id;
        newLabel.innerHTML = `${label} <input type="checkbox" id="${id}-checkbox" class="link-checkbox" checked><label for="${id}-checkbox" class="link-checkbox-label"></label>`
        newCont.append(newLabel);

        return newCont;
    }
    text(id, label, desc, eye = true) {
        this.html.push(this.addTextInput(id, label, desc, eye));
    }
    box(id, label, desc, eye = true) {
        this.html.push(this.addTextbox(id, label, desc, eye));
    }
    select(id, label, desc, eye = true) {
        this.html.push(this.addSelect(id, label, desc, eye));
    }
    radio(id, label, desc, items = [], eye = true) {
        this.html.push(this.addRadio(id, label, desc, items, eye));
    }
    save() {
        this.html.push(this.addSaveButton());
    }
}

class BuilderBuilding extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
        this.select('builder-parent', 'Building Location', 'This option sets a location this building can be found in and links it to that object.');
        this.text('builder-date-built', 'Date of Construction', 'The date the building was built or constructed.');
        this.text('builder-date-destroyed', 'Date of Destruction', 'The date, if any, that the building was destroyed. This option will mark the object as a ruin.');
        this.select('builder-owner', 'Building Owner', 'This option sets a person who owns this building and links it to that object.');
        this.select('builder-owner-org', 'Building Owning Organization', 'This option sets an organization that owns this building and links it to that object.');
        this.text('builder-alt-names', 'Alternate Names', 'Any other names the object is known by.');
        this.box('builder-purpose', 'Building Purpose', 'The intended purpose of this building, and the purpose it may have come to obtain despite that.');
        this.box('builder-alterations', 'Building Alterations', 'Alterations that have been made to the building.');
        this.save();
    }
}

class BuilderCelestialBody extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
        this.radio('builder-type', 'Type of Celestial Body', 'This option sets the type assigned to this object.', ['Planet', 'Star', 'Moon', 'Asteroid', 'Comet', 'Nebula', 'Galaxy', 'Other']);
        this.box('builder-purpose', 'Cultural Significance', 'Any significance this celestial body may have for cultures, such as being an object of worship.');
    }
}

class BuilderCharacter extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderCondition extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderConflict extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderCountry extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderCurrency extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderDeity extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderDocument extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderEthnicity extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderGeographicLocation extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderItem extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderLandmark extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
        this.select('builder-parent', 'Landmark Location', 'This option sets a location this landmark can be found in and links it to that object.');
        this.text('builder-date-built', 'Date of Construction', 'The date the landmark was built or constructed.');
        this.text('builder-date-destroyed', 'Date of Destruction', 'The date, if any, that the landmark was destroyed. This option will mark the object as a ruin.');
        this.select('builder-owner', 'Landmark Owner', 'This option sets a person who owns this landmark and links it to that object.');
        this.select('builder-owner-org', 'Landmark Owning Organization', 'This option sets an organization that owns this landmark and links it to that object.');
        this.text('builder-alt-names', 'Alternate Names', 'Any other names the object is known by.');
        this.box('builder-purpose', 'Landmark Purpose', 'The intended purpose of this landmark, and the purpose it may have come to obtain despite that.');
        this.box('builder-alterations', 'Landmark Alterations', 'Alterations that have been made to the landmark.');
        this.save();
    }
}

class BuilderLanguage extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderMaterial extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderMilitary extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderMyth extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderNaturalLaw extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderOrganization extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderProfession extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderReligion extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderRule extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderSettlement extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderSpecies extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderSpell extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderTechnology extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderTitle extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderTradition extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

class BuilderVehicle extends Builder {
    constructor(name, icon, plural) {
        super(name, icon, plural);
    }
}

const builderObjects = [
    ['Building', 'Buildings', 'home-3-fill', BuilderBuilding],
    ['Celestial Body', 'Celestial Bodies', 'moon-fill', BuilderCelestialBody],
    ['Character', 'Characters', 'user-fill', BuilderCharacter],
    ['Condition', 'Conditions', 'alert-fill', BuilderCondition],
    ['Conflict', 'Conflicts', 'sword-fill', BuilderConflict],
    ['Country', 'Countries', 'government-fill', BuilderCountry],
    ['Currency', 'Currencies', 'coins-fill', BuilderCurrency],
    ['Deity', 'Deities', 'psychotherapy-fill', BuilderDeity],
    ['Document', 'Documents', 'file-paper-2-fill', BuilderDocument],
    ['Ethnicity', 'Ethnicities', 'walk-fill', BuilderEthnicity],
    ['Geographic Location', 'Geographic Locations', 'landscape-fill', BuilderGeographicLocation],
    ['Item', 'Items', 'key-2-fill', BuilderItem],
    ['Landmark', 'Landmarks', 'building-2-fill', BuilderLandmark],
    ['Language', 'Languages', 'character-recognition-fill', BuilderLanguage],
    ['Material', 'Materials', 'box-3-fill', BuilderMaterial],
    ['Military', 'Militaries', 'honour-fill', BuilderMilitary],
    ['Myth', 'Myths', 'book-2-fill', BuilderMyth],
    ['Natural Law', 'Natural Laws', 'flashlight-fill', BuilderNaturalLaw],
    ['Organization', 'Organizations', 'team-fill', BuilderOrganization],
    ['Profession', 'Professions', 'account-box-fill', BuilderProfession],
    ['Religion', 'Religions', 'sparkling-fill', BuilderReligion],
    ['Rule', 'Rules', 'dice-fill', BuilderRule],
    ['Settlement', 'Settlements', 'community-fill', BuilderSettlement],
    ['Species', 'Species', 'aliens-fill', BuilderSpecies],
    ['Spell', 'Spells', 'fire-fill', BuilderSpell],
    ['Technology', 'Technologies', 'flask-fill', BuilderTechnology],
    ['Title', 'Titles', 'vip-crown-fill', BuilderTitle],
    ['Tradition', 'Traditions', 'chat-history-fill', BuilderTradition],
    ['Vehicle', 'Vehicles', 'riding-line', BuilderVehicle]
]