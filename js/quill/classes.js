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

class Building extends WorldObject {
    constructor(name, tags = null, parent = null, children = new Set([])) {
        super(name, tags, parent, children);
    }
}