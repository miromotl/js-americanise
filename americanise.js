/* Replace british words with american words. It can read and write from and to
 * console or files.
 *
 * Taken from the book "Programming in GO"
 *
 * Usage:
 * node americanize [<][infile.txt] [>][outfile.txt]
 */

'use strict';

const fs = require('fs');
const path = require('path');

const dir = path.dirname(process.argv[1]);

// The path to the british american word list file
const britishAmerican = path.format({
    root: '/',
    dir: dir,
    base: 'british-american.txt',
    ext: 'txt',
    name: 'file'
});

const filenamesFromCommandLine = (function ( ) {
    const args = process.argv.slice(2);
    let result = {};
    
    // check first if user has asked for help
    if (args.length > 0 && (args[0] === '-h' || args[0] === '--help')) {
        return {
            error: 'usage: node americanise [infile.txt [outfile.txt]]'
        };
    }
    
    // if there are arguments, they must be file names
    if (args.length > 0) {
        result.infile = args[0];
        
        if (args.length > 1) {
            result.outfile = args[1];
        }
    }
    
    // sanity check: in and out file should be different
    if (result.infile && result.infile === result.outfile) {
        result.error = "won't overwrite the infile"
    }
    
    return result;
}());

var makeReplacerFunction = function (filename, callback) {

    fs.readFile(filename, 'utf8', function (err, dictText) {
    let usForBritish = {};
    let lines, i, dictLine;
    
    if (err) {
        callback(err);
        return;
    }
    
    lines = dictText.split('\n');
    
    for (i = 0; i < lines.length; i += 1) {
        dictLine = lines[i].split(' ');
        usForBritish[dictLine[0]] = dictLine[1];
    }
    
    callback(undefined, function (word) {
        if (usForBritish.hasOwnProperty(word)) {
            return usForBritish[word];
        }
            return word;
        });
    });
};

var americanise = function (textin, callback) {
    makeReplacerFunction(britishAmerican, function (err, replacer) {
        const wordRx = /([A-Za-z]+)/g;
        let matches, i;
        let textout = '';
        
        if (err) {
            callback(err);
            return;
        }
        
        matches = textin.match(wordRx);
        
        for (i = 0; i < matches.length; i += 1) {
            textout += replacer(matches[i]) + ' ';
        }
        
        callback(undefined, textout);
    });
};

var writeText = function (err, textout) {
    if (err) {
        process.stderr.write("Error: " + err.message + "\n");
        process.exit(1);
    }
    
    if (filenamesFromCommandLine.outfile) {
        fs.writeFile(filenamesFromCommandLine.outfile, textout, 'utf8', function (err) {
            if (err) {
                process.stderr.write("ERROR: " + err.message + "\n");
                process.exit(1);
            }
        });
    } else {
        process.stdout.write(textout);
    }
};

// main
if (filenamesFromCommandLine.error) {
    process.stderr.write(filenamesFromCommandLine.error + "\n");
    process.exit(0);
}

if (filenamesFromCommandLine.infile) {
    fs.readFile(filenamesFromCommandLine.infile, 'utf8', function (err, data) {
        if (err) {
            process.stderr.write("ERROR: " + err.message + "\n");
            process.exit(1);
        }
        
        americanise(data, writeText);
    });
} else {
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('readable', () => {
        let chunk = process.stdin.read( );
        
        if (chunk != null) {
            americanise(chunk, writeText);
        }
    });
}
