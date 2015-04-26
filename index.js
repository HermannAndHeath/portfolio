var async = require('async');

var writeFile = require('./lib/writeFile');
var compressFile = require('./lib/compressFile');
var minifyFile = require('./lib/minifyFile');

var handleFile = async.compose(writeFile, compressFile, minifyFile);

var loadFiles = require('./lib/loadFiles');

async.waterfall([
    async.apply(loadFiles, './content'),
    function forEachFile(files, callback) {
        async.each(files, handleFile, callback);
    }
], function (err) {
    if (err) {
        throw err;
    }
});
