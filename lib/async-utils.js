var getSubObject = function getSubObjectPrep(propertyName, callback) {
    return function getSubObject(err, result) {
        if (err) {
            return callback(err);
        }

        return callback(null, result[propertyName]);
    };
};

var setSubObject = function setSubObjectPrep(of, propertyName, callback) {
    return function setSubObject(err, result) {
        if (err) {
            return callback(err);
        }

        of[propertyName] = result;

        return callback(null, of);
    };
};

module.exports = {
    getSubObject: getSubObject,
    setSubObject: setSubObject
};
