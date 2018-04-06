// @flow

import React, { Component } from 'react';
import fetchMock from 'fetch-mock';

import type { ProxyProps } from 'react-cosmos-flow/proxy';

type Options = {
  fixtureKey?: string
};

export function createFetchProxy({ fixtureKey = 'fetch' }: Options = {}) {
  class FetchProxy extends Component<ProxyProps> {
    constructor(props: ProxyProps) {
      super(props);

      this.mock();
    }

    componentWillUnmount() {
      // Make sure we don't clear a mock from a newer instance (in React 16
      // B.constructor is called before A.componentWillUnmount)
      if (fetchMock.__prevProxy === this) {
        this.unmock();
      }
    }

    mock() {
      // Clear mocks from a previous FetchProxy instance
      // Warning: A page can only have one FetchProxy instance at the same time
      this.unmock();

      const mocks = this.props.fixture[fixtureKey];
      if (mocks) {
        mocks.forEach(options => {
          fetchMock.mock(options);
        });

        // Allow unmocked requests to fall through
        // eslint-disable-next-line unicorn/catch-error-name
        fetchMock.catch((...args) => fetchMock.realFetch.apply(window, args));

        fetchMock.__prevProxy = this;
      }
    }

    unmock() {
      if (typeof fetchMock.restore === 'function') {
        fetchMock.restore();
        delete fetchMock.__prevProxy;
      }
    }

    render() {
      const { props } = this;
      const { nextProxy, onComponentRef } = props;

      return React.createElement(nextProxy.value, {
        ...props,
        nextProxy: nextProxy.next(),
        onComponentRef
      });
    }
  }

  return FetchProxy;
}
