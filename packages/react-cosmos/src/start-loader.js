import React from 'react';
import createLoaderElement from './create-loader-element';
import reactDomPolyfill from 'react-dom-polyfill';

const ReactDOM = reactDomPolyfill(React);

let domContainer;

const createDomContainer = () => {
  if (!domContainer) {
    domContainer = document.createElement('div');
    domContainer.style.position = 'absolute';
    domContainer.style.width = '100%';
    domContainer.style.height = '100%';
    document.body.appendChild(domContainer);
  }

  return domContainer;
};

export default ({
  proxies,
  components,
  fixtures,
  containerQuerySelector,
}) => {
  const container =
    containerQuerySelector ?
    document.querySelector(containerQuerySelector) :
    createDomContainer();

  ReactDOM.render(
    createLoaderElement({
      proxies,
      components,
      fixtures,
    }),
    container,
  );
};
