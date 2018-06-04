'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isComponentClass = isComponentClass;

var _react = require('react');

function isComponentClass(componentType) {
  // Warning: Some functions don't have the .prototype property
  return (
    componentType.prototype &&
    // ES6 Class
    (componentType.prototype instanceof _react.Component ||
      // React.createClass
      componentType.prototype.getInitialState !== undefined) &&
    true
  );
}
