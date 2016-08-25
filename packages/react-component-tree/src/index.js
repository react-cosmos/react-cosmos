import React from 'react';

module.exports = {
  Mixin: require('./load-child-mixin.js'),
  // React <0.13 didn't have ES6 classes
  Component: React.Component ? require('./load-child-component.js') : null,
  loadChild: require('./load-child.js'),
  serialize: require('./serialize.js').serialize,
  render: require('./render.js').render,
  injectState: require('./render.js').injectState
};
