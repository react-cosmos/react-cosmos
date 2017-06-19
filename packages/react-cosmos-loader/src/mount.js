import React from 'react';
import ReactDOM from 'react-dom';
import RemoteLoader from './components/RemoteLoader';
import createStateProxy from 'react-cosmos-state-proxy';

let domContainer;

const createDomContainer = () => {
  if (!domContainer) {
    domContainer = document.createElement('div');
    document.body.appendChild(domContainer);
  }

  return domContainer;
};

export default ({ proxies, components, fixtures, containerQuerySelector }) => {
  const container = containerQuerySelector
    ? document.querySelector(containerQuerySelector)
    : createDomContainer();

  ReactDOM.render(
    <RemoteLoader
      components={components}
      fixtures={fixtures}
      proxies={[
        ...proxies,
        // Loaded by default in all configs
        createStateProxy,
      ]}
    />,
    container
  );
};
