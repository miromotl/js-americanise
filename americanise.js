// Replace british words with american words. It can read and write from and to
// console or files.
//
// Taken from the book "Programming in GO"
//
// Usage:
// node americanize [<][infile.txt] [>][outfile.txt]

'use strict';

const path = require('path');
const dir = path.dirname(process.argv[1]);

// The name of the british american word list file
const britishAmerican = path.format({
    root: '/',
    dir: dir,
    base: 'british-american.txt',
    ext: 'txt',
    name: 'file'
});

console.log(britishAmerican);