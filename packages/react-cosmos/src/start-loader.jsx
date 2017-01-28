import React from 'react';
import { loadComponents, loadFixtures } from './load-modules';
import Loader from './components/Loader';
import PropsProxy from './components/proxies/PropsProxy';
import createStateProxy from './components/proxies/StateProxy';
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

export default function startLoader({
  proxies,
  components,
  fixtures,
  containerQuerySelector,
}) {
  const container =
    containerQuerySelector ?
    document.querySelector(containerQuerySelector) :
    createDomContainer();

  ReactDOM.render(
    <Loader
      components={loadComponents(components)}
      fixtures={loadFixtures(fixtures)}
      proxies={[
        ...proxies,
        // Loaded by default in all configs
        createStateProxy(),
        // The final proxy in the chain simply renders the selected component
        PropsProxy,
      ]}
    />,
    container,
  );
}
