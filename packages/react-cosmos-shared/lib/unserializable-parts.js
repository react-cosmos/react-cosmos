'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var isSerializable = function isSerializable(obj) {
  if (
    obj === undefined ||
    obj === null ||
    typeof obj === 'boolean' ||
    typeof obj === 'number' ||
    typeof obj === 'string'
  ) {
    return true;
  }

  if (!(0, _lodash2.default)(obj) && !Array.isArray(obj)) {
    return false;
  }

  var serializable = true;

  Object.keys(obj).forEach(function(key) {
    if (!isSerializable(obj[key])) {
      serializable = false;
    }
  });

  return serializable;
};

var splitUnserializableParts = function splitUnserializableParts(obj) {
  var serializable = {};
  var unserializable = {};

  Object.keys(obj).forEach(function(key) {
    if (isSerializable(obj[key])) {
      serializable[key] = obj[key];
    } else if (key === 'props' && (0, _lodash2.default)(obj[key])) {
      Object.keys(obj.props).forEach(function(propKey) {
        var propVal = obj.props[propKey];
        var propHome = isSerializable(propVal) ? serializable : unserializable;

        if (!propHome.props) {
          propHome.props = {};
        }
        propHome.props[propKey] = propVal;
      });
    } else {
      unserializable[key] = obj[key];
    }
  });

  return { serializable: serializable, unserializable: unserializable };
};

exports.default = splitUnserializableParts;
