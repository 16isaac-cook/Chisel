const test = new PFClass("testing-id", "Testing", "test-source", 5);
test.addPrimaryAbility('str');
test.addPrimaryAbility('dex');
test.addProficiency('attack', 'simple', 1);
test.addProficiency('attack', 'weapon', 1, 'scimitar');
test.addProficiency('skill', 'granted', 1, 'arcana');
test.addProficiency('defense', 'medium', 2);
test.addProficiency('test', 'fail', 0, 'suck');
console.log(test);