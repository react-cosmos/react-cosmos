'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _slash = require('slash');

var _slash2 = _interopRequireDefault(_slash);

var _resolveFrom = require('resolve-from');

var _resolveFrom2 = _interopRequireDefault(_resolveFrom);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = function(rootPath, userPath) {
  return (
    // Convert Windows backslash paths to slash paths
    (0, _slash2.default)(
      // An absolute path is already resolved
      _path2.default.isAbsolute(userPath)
        ? userPath
        : _resolveFrom2.default.silent(rootPath, userPath) ||
          // Final attempt to resolve path, for when relative paths that don't
          // start with ./
          _path2.default.join(rootPath, userPath)
    )
  );
};
