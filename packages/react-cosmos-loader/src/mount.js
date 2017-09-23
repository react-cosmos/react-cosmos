import React from 'react';
import { render } from 'react-dom';
import RemoteLoader from './components/RemoteLoader';
import createStateProxy from 'react-cosmos-state-proxy';

let domContainer;
let StateProxy;

const createDomContainer = () => {
  if (!domContainer) {
    domContainer = document.createElement('div');
    document.body.appendChild(domContainer);
  }

  return domContainer;
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
