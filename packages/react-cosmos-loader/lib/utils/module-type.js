'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _propTypes = require('prop-types');

exports.default = function(innerType) {
  return (0, _propTypes.oneOfType)([
    innerType,
    (0, _propTypes.shape)({
      __esModule: (0, _propTypes.oneOf)([true]),
      default: innerType
    })
  ]);
};
