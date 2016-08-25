var React = require('react'),
    ReactDOM = require('../../packages/react-dom-polyfill')(React),
    $ = require('jquery'),
    ComponentTree = require('../../packages/react-component-tree'),
    ComponentPlayground = require('../../packages/react-component-playground/src');

module.exports = function(fixture, container) {
  var container = container || document.createElement('div'),
      component,
      $component;

  component = ComponentTree.render({
    component: ComponentPlayground,
    snapshot: fixture,
    container: container
  });

  $component = $(ReactDOM.findDOMNode(component));

  return {
    container: container,
    component: component,
    $component: $component
  };
};
