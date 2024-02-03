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
- Rooms
- Settlements
- Species
- Spells
- Technologies
- Traditions
- Vehicles
*/

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
    constructor(type) {
        this.type = type;
        this.html = [];
        this.header = `Builder - ${type}`;
        this.html.push(this.addTextInput('builder-title', `${this.type} Title`, null, null));
        this.html.push(this.addTextbox('builder-desc', `${this.type} Description`, null, null));
        this.html.push(this.addNote());
        this.html.push(this.addTextbox('builder-gm-notes', `GM Notes`, null, false));
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
                    var y, i, k, s, h, sl, yl;
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
    addSaveButton() {
        const newSaveButton = document.createElement('button');
        newSaveButton.id = 'builder-save-button';
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
            typeID.id = 'builder-type';
            typeID.dataset.type = this.type;
            builder.append(typeID);
            for(i = 0; i < this.html.length; i++) {
                builder.append(this.html[i]);
            }
        }
    }
}

class BuilderLandmark extends Builder {
    constructor() {
        super('Landmark');
        this.html.push(this.addSelect('builder-parent', 'Landmark Location', 'This option sets a location this landmark can be found in and links it to that object.'));
        this.html.push(this.addTextInput('builder-date-built', 'Date of Construction', 'The date the landmark was built or constructed.'));
        this.html.push(this.addTextInput('builder-date-destroyed', 'Date of Destruction', 'The date, if any, that the landmark was destroyed. This option will mark the object as a ruin.'));
        this.html.push(this.addSelect('builder-owner', 'Landmark Owner', 'This option sets a person who owns this landmark and links it to that object.'));
        this.html.push(this.addSelect('builder-owner-org', 'Landmark Owning Organization', 'This option sets an organization that owns this landmark and links it to that object.'));
        this.html.push(this.addTextInput('builder-alt-names', 'Alternate Names', 'Any other names the object is known by.'));
        this.html.push(this.addTextbox('builder-purpose', 'Landmark Purpose', 'The intended purpose of this landmark, and the purpose it may have come to obtain despite that.'));
        this.html.push(this.addTextbox('builder-alterations', 'Landmark Alterations', 'Alterations that have been made to the landmark.'));
        this.html.push(this.addSaveButton());
    }
}