/* eslint-disable global-require */

import React from 'react';

module.exports = {
  Mixin: require('./load-child-mixin'),
  // React <0.13 didn't have ES6 classes
  Component: React.Component ? require('./load-child-component') : null,
  loadChild: require('./load-child'),
  serialize: require('./serialize').serialize,
  render: require('./render').render,
  injectState: require('./render').injectState,
};
