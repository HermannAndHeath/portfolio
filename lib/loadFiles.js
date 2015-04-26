var async = require('async');
var recurse = require('recursive-readdir');
var fs = require('fs');

var utils = require('./async-utils');

var loadEachFile = function loadEachFile(files, callback) {
    async.map(files, function loadFile(filename, callback) {
        var result = {
            filename: filename
        };

        fs.readFile(filename, utils.setSubObject(result, 'file', callback));
    }, callback);
};

module.exports = function loadFiles(path, callback) {
    async.waterfall([
        async.apply(recurse, path),
        loadEachFile
    ], callback);
};
