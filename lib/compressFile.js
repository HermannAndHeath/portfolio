var async = require('async');
var zlib = require('zlib');

var utils = require('./async-utils');

var compressFile = function compressFile(file, callback) {
    async.parallel([
        function deflateFile(callback) {
            zlib.deflate(file.file, utils.setSubObject(file, 'deflate', callback));
        },
        function gzipFile(callback) {
            zlib.gzip(file.file, utils.setSubObject(file, 'gzip', callback));
        }
    ], function (err) {
        if (err) {
            return callback(err);
        }

        callback(null, file);
    });
};

module.exports = compressFile;
