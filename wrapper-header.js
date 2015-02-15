(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['react', 'lodash'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but only CommonJS-like
    // environments that support module.exports, like Node
    module.exports = factory(require('react/addons'),
                             require('lodash'));
  } else {
    // Browser globals (root is window)
    root.Cosmos = factory(root.React, root._);
  }
}(this, function(React, _) {
