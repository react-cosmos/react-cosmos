'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _propTypes = require('prop-types');

exports.default = {
  nextProxy: (0, _propTypes.shape)({
    value: _propTypes.func,
    next: _propTypes.func
  }).isRequired,
  fixture: _propTypes.object.isRequired,
  onComponentRef: _propTypes.func.isRequired,
  onFixtureUpdate: _propTypes.func.isRequired
};
