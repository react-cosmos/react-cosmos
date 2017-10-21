import React from 'react';
import { render } from 'react-dom';
import RemoteLoader from './components/RemoteLoader';
import createStateProxy from 'react-cosmos-state-proxy';

let StateProxy;

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

export function mount({
  proxies,
  components,
  fixtures,
  containerQuerySelector
}) {
  const container = containerQuerySelector
    ? document.querySelector(containerQuerySelector)
    : createDomContainer();

  // Reuse proxy instance between renders to be able to do deep equals between
  // RemoteLoader prop transitions and know whether the user proxies changed.
  if (!StateProxy) {
    StateProxy = createStateProxy();
  }

  render(
    <RemoteLoader
      components={components}
      fixtures={fixtures}
      proxies={[
        ...proxies,
        // Loaded by default in all configs
        StateProxy
      ]}
    />,
    container
  );
}
