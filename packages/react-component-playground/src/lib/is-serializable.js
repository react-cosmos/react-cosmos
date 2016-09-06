const _ = require('lodash');

exports.isSerializable = (obj) => {
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

  let isSerializable = true;

  Object.keys(obj).forEach((key) => {
    if (!exports.isSerializable(obj[key])) {
      isSerializable = false;
    }
  });

  return isSerializable;
};
