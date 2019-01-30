// @flow

import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import type { ProxyProps } from 'react-cosmos-flow/proxy';

type Options = {
  fixtureKey: string
};

export const createReduxProxy = ({ fixtureKey = 'reduxState' }: Options) => (
  props: ProxyProps
) => {
  const { nextProxy, ...rest } = props;
  const { value: NextProxy, next } = nextProxy;
  const { [fixtureKey]: reduxState, ...fixture } = rest.fixture;

  if (reduxState === undefined) {
    return <NextProxy {...rest} nextProxy={next()} />;
  }

  const store = createStore(s => s, reduxState);

  return (
    <Provider store={store}>
      <NextProxy {...rest} fixture={fixture} nextProxy={next()} />
    </Provider>
  );
};
