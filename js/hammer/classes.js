class PFClass {
    constructor(id, name, source, page) {
        this.id = id;
        this.name = name;
        this.source = source;
        this.page = page;
        this.json = {};
        this.json.id = this.id;
        this.json.name = this.name;
        this.json.source = {};
        this.json.source.title = this.source;
        this.json.source.page = this.page;
    }

    addPrimaryAbility(ability) {
        if(!this.json.ability){this.json.ability = [];}
        this.json.ability.push(ability);
    }
    removePrimaryAbility(ability) {
        if(this.json.ability) {
            const getAbility = this.json.ability.indexOf(ability);
            console.log(getAbility);
            this.json.ability.splice(getAbility, 1);
        }
    }
    changeHP(hp) {
        this.json.hp = hp;
    }
    addProficiency(category, type, training, subtype = null) {
        if(!this.json.proficiencies){this.json.proficiencies = {};}

        const profs = this.json.proficiencies;

        if(!profs[category]){profs[category] = {};}

        const cat = profs[category];

        if(category == "attack") {
            if(type == "simple" || type == "martial" || type == "advanced" || type == "unarmed") {
                cat[type] = training;
            } else if(type == "weapon" && subtype) {
                if(!cat.weapon){cat.weapon = {};}
                cat.weapon[subtype] = training;
            }
        }
        else if(category == "defense" || category == "saves") {
            cat[type] = training;
        }
        else if(category == "skill") {
            if(type == "granted" && subtype) {
                if(!cat.granted){cat.granted = {};}
                cat.granted[subtype] = training;
            } else if (type == "choice" && subtype) {
                if(!cat.choice){cat.choice = {};}
                cat.choice[subtype] = training;
            } else if (type == "base") {
                cat.base = training;
            }
        }
        else {
            console.log(`Something went wrong trying to add a proficiency to class ${this.name}(${this.id})\nCategory: ${category}, type: ${type}, training: ${training}, subtype: ${subtype}`);
        }
    }
    changeProficiency(category, type, training, subtype = null) {
        const profs = this.json.proficiencies;
        const cat = profs[category];
        if(this.json.ability) {
            const getAbility = this.json.ability.indexOf(ability);
            console.log(getAbility);
            this.json.ability.splice(getAbility, 1);
        }
    }
}