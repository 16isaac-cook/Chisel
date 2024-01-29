class PFObject {
    constructor(id, name, source, page) {
        this.id = id;
        this.name = name;
        this.source = {};
        this.source.title = source;
        this.source.page = page;
        this.image = [];
        this.rarity = 0;
        this.trait = [];
        this.summary = "";
        this.text = "";
    }
    get title() {
        return this.source.title;
    }
    set title(x) {
        this.source.title = x;
    }
    get page() {
        return this.source.page;
    }
    set page(x) {
        this.source.page = x;
    }

    get json() {
        return JSON.stringify(this);
    }
}

class PFClass extends PFObject {
    constructor(id, name, source, page) {
        super(id, name, source, page);
        this.ability = [];
        this.hp = 0;
        this.proficiencies = {};
        this.proficiencies.attack = {};
        this.proficiencies.attack.simple = 0;
        this.proficiencies.attack.martial = 0;
        this.proficiencies.attack.advanced = 0;
        this.proficiencies.attack.unarmed = 0;
        this.proficiencies.attack.weapon = {};
        this.proficiencies.defense = {};
        this.proficiencies.defense.light = 0;
        this.proficiencies.defense.medium = 0;
        this.proficiencies.defense.heavy = 0;
        this.proficiencies.defense.unarmored = 0;
        this.proficiencies.save = {};
        this.proficiencies.save.fortitude = 0;
        this.proficiencies.save.perception = 0;
        this.proficiencies.save.reflex = 0;
        this.proficiencies.save.will = 0;
        this.proficiencies.skill = {};
        this.proficiencies.skill.granted = {};
        this.proficiencies.skill.choice = {};
        this.proficiencies.skill.base = 0;
        this.levels = {};
        this.levels["1"] = {};
    }

    get simple() {
        return this.proficiencies.attack.simple;
    }
    set simple(x) {
        this.proficiencies.attack.simple = x;
    }
    get martial() {
        return this.proficiencies.attack.martial;
    }
    set martial(x) {
        this.proficiencies.attack.martial = x;
    }
    get advanced() {
        return this.proficiencies.attack.advanced;
    }
    set advanced(x) {
        this.proficiencies.attack.advanced = x;
    }
    get unarmed() {
        return this.proficiencies.attack.unarmed;
    }
    set unarmed(x) {
        this.proficiencies.attack.unarmed = x;
    }
    get weapon() {
        return this.proficiencies.attack.weapon;
    }
    get light() {
        return this.proficiencies.defense.light;
    }
    set light(x) {
        this.proficiencies.defense.light = x;
    }
    get medium() {
        return this.proficiencies.defense.medium;
    }
    set medium(x) {
        this.proficiencies.defense.medium = x;
    }
    get heavy() {
        return this.proficiencies.defense.heavy;
    }
    set heavy(x) {
        this.proficiencies.defense.heavy = x;
    }
    get unarmored() {
        return this.proficiencies.defense.unarmored;
    }
    set unarmored(x) {
        this.proficiencies.defense.unarmored = x;
    }
    get fortitude() {
        return this.proficiencies.save.fortitude;
    }
    set fortitude(x) {
        this.proficiencies.save.fortitude = x;
    }
    get perception() {
        return this.proficiencies.save.perception;
    }
    set perception(x) {
        this.proficiencies.save.perception = x;
    }
    get reflex() {
        return this.proficiencies.save.reflex;
    }
    set reflex(x) {
        this.proficiencies.save.reflex = x;
    }
    get will() {
        return this.proficiencies.save.will;
    }
    set will(x) {
        this.proficiencies.save.will = x;
    }
    get skill() {
        return this.proficiencies.skill;
    }
}

class PFItem extends PFObject {
    constructor(id, name, source, page) {
        super(id, name, source, page);
        this.hands = 0;
        this.price = 0;
        this.weight = 0;
    }
}

class PFAncestry extends PFObject {
    constructor(id, name, source, page) {
        super(id, name, source, page);
        this.ability = {};
        this.ability.granted = [];
        this.ability.flaw = [];
        this.ability.chosen = [];
        this.hp = 0;
        this.languages = [];
        this.size = 1;
        this.speed = {};
        this.speed.land = 25;
        this.vision = "";
        this.other = [];
    }
}