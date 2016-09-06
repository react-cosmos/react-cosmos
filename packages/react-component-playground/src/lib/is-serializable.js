const _ = require('lodash');

exports.isSerializable = function (obj) {
  if (_.isUndefined(obj) ||
      _.isNull(obj) ||
      _.isBoolean(obj) ||
      _.isNumber(obj) ||
      _.isString(obj)) {
    return true;
  }

  if (!_.isPlainObject(obj) &&
      !_.isArray(obj)) {
    return false;
  }

  for (const key in obj) {
    if (!exports.isSerializable(obj[key])) {
      return false;
    }
  }

  return true;
};

