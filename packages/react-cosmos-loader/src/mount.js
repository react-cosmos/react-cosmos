import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import RemoteLoader from './components/RemoteLoader';
import createStateProxy from 'react-cosmos-state-proxy';

// Reuse proxy instance between renders to be able to do deep equals between
// RemoteLoader prop transitions and know whether the user proxies changed.
const StateProxy = createStateProxy();

let domContainer;
let loaderRef;
let prevState;

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

  render(
    <RemoteLoader
      ref={ref => {
        loaderRef = ref;
      }}
      initialState={prevState}
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

export function unmount() {
  if (domContainer) {
    if (loaderRef) {
      prevState = loaderRef.state;
    }

    unmountComponentAtNode(domContainer);
  }
}
