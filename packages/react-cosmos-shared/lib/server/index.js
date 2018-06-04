'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _moduleExists = require('./module-exists');

Object.defineProperty(exports, 'moduleExists', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_moduleExists).default;
  }
});

var _resolveUserPath = require('./resolve-user-path');

Object.defineProperty(exports, 'resolveUserPath', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_resolveUserPath).default;
  }
});

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var defaultFileMatch = (exports.defaultFileMatch = [
  '**/__fixture?(s)__/**/*.{js,jsx,ts,tsx}',
  '**/?(*.)fixture?(s).{js,jsx,ts,tsx}'
]);

var defaultExclude = (exports.defaultExclude = []);
