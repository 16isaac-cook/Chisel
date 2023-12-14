// character json processing
class Character {
    constructor() {
        this.filePath = '../characters/pathfinder/';
    }
    async getFile(char) {
        const response = await fetch(`${this.filePath}${char}.json`);
        const data = await response.json();

        return data[0];
    }
}

const example = new Character();

const exampleData = example.getFile('example')
    .then(data => console.log(data))
    .catch(err => console.log(err));
