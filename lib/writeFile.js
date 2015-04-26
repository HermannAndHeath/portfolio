var async = require('async');
var fs = require('fs');


var filenameRegex = /content/;
var writeFileToDisk = fs.writeFile.bind(fs);

var writeFile = function writeFile(file, callback) {
    file.filename = file.filename.replace(filenameRegex, 'dist');

    async.parallel([
        async.apply(writeFileToDisk, file.filename, file.file),
        async.apply(writeFileToDisk, file.filename + '.dfl', file.deflate),
        async.apply(writeFileToDisk, file.filename + '.gz', file.gzip)
    ], callback);
};

module.exports = writeFile;
