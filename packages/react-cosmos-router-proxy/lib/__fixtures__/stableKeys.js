'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var MyComponent = function MyComponent() {
  return _react2.default.createElement('div', null, 'MyComponent');
};
var MyComponentWithRouter = (0, _reactRouter.withRouter)(MyComponent);

exports.default = {
  component: MyComponentWithRouter,
  url: '/',
  props: {}
};
