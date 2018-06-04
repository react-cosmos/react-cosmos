'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createDomRenderer = createDomRenderer;

var _reactDom = require('react-dom');

function createDomRenderer() {
  var opts =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var containerQuerySelector = opts.containerQuerySelector;

  var container = getDomContainer(containerQuerySelector);

  return function renderer(element) {
    (0, _reactDom.render)(element, container);

    return {
      unmount: function unmount() {
        (0, _reactDom.unmountComponentAtNode)(container);
      }
    };
  };
}

function getDomContainer(querySelector) {
  if (!querySelector) {
    return createDomContainer();
  }

  var existingContainer = document.querySelector(querySelector);
  if (!existingContainer) {
    console.warn(
      '[Cosmos] Could not find ' +
        querySelector +
        ' element. Created fresh DOM container.'
    );
    return createDomContainer();
  }

  return existingContainer;
}

function createDomContainer() {
  var existingNode = document.getElementById('root');
  if (existingNode) {
    return existingNode;
  }

  var newNode = document.createElement('div');
  newNode.setAttribute('id', 'root');
  if (document.body) {
    document.body.appendChild(newNode);
  }

  return newNode;
}
