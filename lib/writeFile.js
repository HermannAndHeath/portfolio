var async = require('async');
var fs = require('fs');


var filenameRegex = /content/;
var writeFileToDisk = fs.writeFile.bind(fs);

var writeFile = function writeFile(file, callback) {
    file.filename = file.filename.replace(filenameRegex, 'dist');

    writeFileToDisk(file.filename, file.gzip, callback);
};

module.exports = writeFile;
