const exec = require('child_process').exec;
const assert = require('assert').strict;

const expected = `id,json,is_valid
1,"[4,1,2,7,5,3,8,9,6]",true
2,"[90,40,10,20]",true
3,[-5],true
9,[],false
5,[],false
8,[],false
4,[],false
6,[],false
7,[],false
10,"[3,1,4,2]",true`;

exec('node rotate.js testData.csv', function (error, stdout, stderr) {
    assert.equal(expected, stdout);
    assert.equal("", stderr);
});
