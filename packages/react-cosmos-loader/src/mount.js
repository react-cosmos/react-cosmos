import React from 'react';
import { render } from 'react-dom';
import createStateProxy from 'react-cosmos-state-proxy';
import RemoteLoader from './components/RemoteLoader';
import createErrorCatchProxy from './components/ErrorCatchProxy';

let StateProxy;
let ErrorCatchProxy;

const createDomContainer = () => {
  const existingNode = document.getElementById('root');
  if (existingNode) {
    return existingNode;
  }

  const newNode = document.createElement('div');
  newNode.setAttribute('id', 'root');
  document.body.appendChild(newNode);

  return newNode;
};

export function mount({ proxies, fixtures, containerQuerySelector }) {
  const container = containerQuerySelector
    ? document.querySelector(containerQuerySelector)
    : createDomContainer();

  // Reuse proxy instances between renders to be able to do deep equals between
  // RemoteLoader prop transitions and know whether the user proxies changed.
  if (!StateProxy) {
    StateProxy = createStateProxy();
    ErrorCatchProxy = createErrorCatchProxy();
  }

  render(
    <RemoteLoader
      fixtures={fixtures}
      proxies={[
        // Some proxies are loaded by default in all configs
        ErrorCatchProxy,
        ...proxies,
        StateProxy
      ]}
    />,
    container
  );
}
