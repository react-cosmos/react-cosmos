import React from 'react';
import $ from 'jquery';
import ComponentTree from '../../packages/react-component-tree';
import ComponentPlayground from '../../packages/react-component-playground/src';

const ReactDOM = require('../../packages/react-dom-polyfill')(React);

module.exports = (fixture, container = document.createElement('div')) => {
  const component = ComponentTree.render({
    component: ComponentPlayground,
    snapshot: fixture,
    container,
  });

  const $component = $(ReactDOM.findDOMNode(component));

  return {
    container,
    component,
    $component,
  };
};
