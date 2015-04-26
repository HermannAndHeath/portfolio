var Minimize = require('minimize');

var minimize = new Minimize({
    conditionals: true
});

var CleanCss = require('clean-css');
var cleaner = new CleanCss();
var cleanCss = cleaner.minify.bind(cleaner);

var utils = require('./async-utils');

var minifyFile = function minifyFile(file, callback) {
    var filename = file.filename;

    if (!!~filename.indexOf('.html')) {
        return minimize.parse(file.file, utils.setSubObject(file, 'file', callback));
    } else if (!!~filename.indexOf('.css')) {
        return cleanCss(file.file, utils.getSubObject('styles', utils.setSubObject(file, 'file', callback)));
    }

    return callback(null, file);
};

module.exports = minifyFile;
