const formatString = (string, lower = true) => {
    let newString = string
        .trim()
        .replaceAll(' ', '')
        .replaceAll('\\', '')
        .replaceAll('/', '')
        .replaceAll(':', '_')
        .replaceAll('*', '')
        .replaceAll('"', '')
        .replaceAll('<', '')
        .replaceAll('>', '')
        .replaceAll('|', '')
        .replaceAll("'", '');
    if(lower) {
        newString = newString.toLowerCase()
    }
    
    return newString;
};

class Tag {
    constructor(name) {
        this._name = name;
        this._objects = new Set([]);
    }

    get objects() {
        return this._objects;
    }
}

class WorldObject {
    constructor(name = 'WorldObject', tags = null, parent = null, children = new Set([])) {
        this._name = name;
        this._tags = new Set([]);
        this._parent = parent;
        this._children = children;

        //add tags and put this Object into the tags' Sets
        if(tags && tags instanceof Array) {
            tags.forEach(tag => {
                if(tag instanceof Tag) {
                    this._tags.add(tag);
                } else {
                    console.error(`WorldObject '${this._name}' was incorrectly given this to add this to its tags: [${tag}](${typeof tag})`);
                }
            });
        } else if(tags && tags instanceof Tag) {
            this._tags.add(tags);
        } else {
            console.error(`WorldObject '${this.name}' was incorrectly given this to add this to its tags: [${tags}](${typeof tags})`);
        }
        if(this._tags.size) {
            this._tags.forEach((tag) => {
                if(tag instanceof Tag) {
                    tag.objects.add(this);
                } else {
                    console.error(`WorldObject '${this._name}' has a tag of [${tag}](${typeof tag}), which is not a Tag object`);
                }
            })
        }
    }

    set name(newName) {
        newName = newName.trim();

        if(newName === '') {
            throw 'The name cannot be empty';
        }

        this._name = newName;
    }
    get name() {
        return this._name;
    }
    
    get tags() {
        return this._tags;
    }
    get parent() {
        return this._parent;
    }
    get children() {
        return this._children;
    }
}

class Landmark extends WorldObject {
    constructor(name, tags = null, parent = null, children = new Set([])) {
        super(name, tags, parent, children);
    }
}

// builders
class Builder {
    constructor(type, icon) {
        this.type = type;
        this.icon = icon;
        this.html = [];
        this.header = `Builder - ${type}`;
        this.text('builder-title', `${this.type} Title`, null, null);
        this.box('builder-desc', `${this.type} Description`, null, null);
        this.html.push(this.addLinkCheck('builder-checkbox-link', 'Should this object get auto-linked in other objects?'));
        this.save();
        this.html.push(this.addNote());
        this.box('builder-gm-notes', `GM Notes`, null, false);
    }
    addNote() {
        const newNote = document.createElement('div');
        newNote.id = 'builder-content-main-display-note';
        newNote.classList.add('note');
        newNote.innerHTML = '<i class="ri-eye-fill"></i> = can be seen by players, <i class="ri-eye-close-fill"></i> = cannot be seen by players. Click to toggle';

        return newNote;
    }
    addTextInput(id, label, desc, eye = true) {
        const newPair = document.createElement('div');
        newPair.classList.add('pair');
        
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

        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.id = id;

        let newDesc;
        if(desc) {
            newDesc = document.createElement('p');
            newDesc.innerHTML = desc;
        }

        if(id == 'builder-title') {
            newPair.append(newInput);
            newPair.append(newLabel);
        } else {
            newPair.append(newLabel);
            newPair.append(newInput);
        }
        if(newDesc) {
            newPair.append(newDesc);
        }

        return newPair;
    }
    addTextbox(id, label, desc, eye = true) {
        const newPair = document.createElement('div');
        newPair.classList.add('pair');
        
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

        const newTextbox = document.createElement('textarea');
        newTextbox.id = id;

        let newDesc;
        if(desc) {
            newDesc = document.createElement('p');
            newDesc.innerHTML = desc;
        }

        newPair.append(newLabel);
        newPair.append(newTextbox);
        if(newDesc) {
            newPair.append(newDesc);
        }

        return newPair;
    }
    addSelect(id, label, desc, eye = true) {
        const newPair = document.createElement('div');
        newPair.classList.add('pair');
        
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

        const newSelectDiv = document.createElement('div');
        newSelectDiv.classList.add('select');
        newSelectBox.append(newSelectDiv)

        const newSelect = document.createElement('select');
        newSelect.id = id;
        newSelectDiv.append(newSelect);

        const firstOption = document.createElement('option');
        firstOption.value = 'none';
        firstOption.innerHTML = 'Select object...';
        newSelect.append(firstOption);

        const createSelectOptions = (sel) => {
            let b, c, ll, j;
            /* For each element, create a new DIV that will contain the option list: */
            b = document.createElement("DIV");
            b.setAttribute("class", "select-items select-hide");
            for (j = 1; j < ll; j++) {
                /* For each option in the original select element,
                create a new DIV that will act as an option item: */
                newSelect.dataset.count++;
                c = document.createElement("DIV");
                c.innerHTML = sel.options[j].innerHTML;
                c.addEventListener("click", function(e) {
                    /* When an item is clicked, update the original select box,
                    and the selected item: */
                    let y, i, k, s, h, sl, yl;
                    s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                    sl = s.length;
                    h = this.parentNode.previousSibling;
                    for (i = 0; i < sl; i++) {
                        if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                        }
                    }
                    h.click();
                });
                b.appendChild(c);
            }
            return b;
        }

        let a, ll, b;
        ll = newSelect.length;
        newSelect.dataset.count = 0;
        /* For each element, create a new DIV that will act as the selected item: */
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = newSelect.options[newSelect.selectedIndex].innerHTML;
        a.dataset.count = 0;
        newSelectDiv.appendChild(a);
        b = createSelectOptions(newSelect);
        newSelectDiv.appendChild(b);
        a.dataset.count = newSelect.dataset.count;
        a.addEventListener("click", function(e) {
            /* When the select box is clicked, close any other select boxes,
            and open/close the current select box: */
            e.stopPropagation();
            if(this.dataset.count > 0) {
                console.log(this);
                closeAllSelect(this);
                this.nextSibling.classList.toggle("select-hide");
                this.classList.toggle("select-arrow-active");
            }
        });

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

        newPair.append(newLabel);
        newPair.append(newSelectBox);
        if(newDesc) {
            newPair.append(newDesc);
        }

        return newPair;
    }
    addRadio(id, label, desc, items = [], eye = true) {
        const newPair = document.createElement('div');
        newPair.classList.add('pair');
        
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

        newPair.append(newLabel);
        newPair.append(radioDiv);

        if(newDesc) {
            newPair.append(newDesc);
        }

        return newPair;
    }
    addLinkCheck(id, label) {
        const newPair = document.createElement('div');
        newPair.classList.add('pair');
        
        const newLabel = document.createElement('label');
        newLabel.id = id;
        newLabel.innerHTML = `${label} <input type="checkbox" id="${id}-checkbox" class="link-checkbox" checked><label for="${id}-checkbox" class="link-checkbox-label"></label>`
        newPair.append(newLabel);

        return newPair;
    }
    addSaveButton() {
        const newSaveButton = document.createElement('button');
        newSaveButton.classList.add('builder-save-button');
        newSaveButton.innerHTML = 'Save Object';

        return newSaveButton;
    }
    pushHTML() {
        const header = document.querySelector('#builder-content-main-header');
        header.innerHTML = this.header;
        const builder = document.querySelector('#builder-content-main-display-builder');
        if(builder) {
            const typeID = document.createElement('div');
            typeID.dataset.active = false;
            typeID.id = 'builder-obj-type';
            typeID.dataset.type = this.type;
            typeID.dataset.icon = this.icon;
            builder.append(typeID);

            for(let i = 0; i < this.html.length; i++) {
                builder.append(this.html[i]);
            }
        }
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
    constructor(name, icon) {
        super(name, icon);
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
    constructor(name, icon) {
        super(name, icon);
        this.radio('builder-type', 'Type of Celestial Body', 'This option sets the type assigned to this object.', ['Planet', 'Star', 'Moon', 'Asteroid', 'Comet', 'Nebula', 'Galaxy', 'Other']);
        this.box('builder-purpose', 'Cultural Significance', 'Any significance this celestial body may have for cultures, such as being an object of worship.');
    }
}

class BuilderCharacter extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderCondition extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderConflict extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderCountry extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderCurrency extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderDeity extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderDocument extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderEthnicity extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderGeographicLocation extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderItem extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderLandmark extends Builder {
    constructor(name, icon) {
        super(name, icon);
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
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderMaterial extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderMilitary extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderMyth extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderNaturalLaw extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderOrganization extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderProfession extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderReligion extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderRule extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderSettlement extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderSpecies extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderSpell extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderTechnology extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderTitle extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderTradition extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

class BuilderVehicle extends Builder {
    constructor(name, icon) {
        super(name, icon);
    }
}

const builderObjects = [
    ['Building', 'home-3-fill', BuilderBuilding],
    ['Celestial Body', 'moon-fill', BuilderCelestialBody],
    ['Character', 'user-fill', BuilderCharacter],
    ['Condition', 'alert-fill', BuilderCondition],
    ['Conflict', 'sword-fill', BuilderConflict],
    ['Country', 'government-fill', BuilderCountry],
    ['Currency', 'coins-fill', BuilderCurrency],
    ['Deity', 'psychotherapy-fill', BuilderDeity],
    ['Document', 'file-paper-2-fill', BuilderDocument],
    ['Ethnicity', 'walk-fill', BuilderEthnicity],
    ['Geographic Location', 'landscape-fill', BuilderGeographicLocation],
    ['Item', 'key-2-fill', BuilderItem],
    ['Landmark', 'building-2-fill', BuilderLandmark],
    ['Language', 'character-recognition-fill', BuilderLanguage],
    ['Material', 'box-3-fill', BuilderMaterial],
    ['Military', 'honour-fill', BuilderMilitary],
    ['Myth', 'book-2-fill', BuilderMyth],
    ['Natural Law', 'flashlight-fill', BuilderNaturalLaw],
    ['Organization', 'team-fill', BuilderOrganization],
    ['Profession', 'account-box-fill', BuilderProfession],
    ['Religion', 'sparkling-fill', BuilderReligion],
    ['Rule', 'dice-fill', BuilderRule],
    ['Settlement', 'community-fill', BuilderSettlement],
    ['Species', 'aliens-fill', BuilderSpecies],
    ['Spell', 'fire-fill', BuilderSpell],
    ['Technology', 'flask-fill', BuilderTechnology],
    ['Title', 'vip-crown-fill', BuilderTitle],
    ['Tradition', 'chat-history-fill', BuilderTradition],
    ['Vehicle', 'riding-line', BuilderVehicle]
]