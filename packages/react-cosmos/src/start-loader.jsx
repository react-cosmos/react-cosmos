import React from 'react';
import reactDomPolyfill from 'react-dom-polyfill';
import { loadComponents, loadFixtures } from './load-modules';
import Loader from './components/Loader';
import PropsProxy from './components/proxies/PropsProxy';
import createStateProxy from './components/proxies/StateProxy';

const ReactDOM = reactDomPolyfill(React);

const createDomContainer = () => {
  const node = document.createElement('div');
  node.style.position = 'absolute';
  node.style.width = '100%';
  node.style.height = '100%';

  return node;
};

module.exports = ({
  proxies,
  components,
  fixtures,
  containerQuerySelector,
}) => {
  const container =
    containerQuerySelector ?
    document.querySelector(containerQuerySelector) :
    document.body.appendChild(createDomContainer());

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
    container
  );
};
