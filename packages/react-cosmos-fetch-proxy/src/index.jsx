import React, { Component } from 'react';
import proxyPropTypes from 'react-cosmos-utils/lib/proxy-prop-types';

const createFetchMock = response => () =>
  new Promise(resolve => {
    resolve({
      json: () =>
        new Promise(resolve => {
          resolve(response);
        }),
    });
  });

const defaults = {
  fixtureKey: 'fetch',
};

export default function createFetchProxy(options) {
  const { fixtureKey } = { ...defaults, ...options };

  class FetchProxy extends Component {
    constructor(props) {
      super(props);

      const response = props.fixture[fixtureKey];
      if (response) {
        this.realFetch = window.fetch;
        window.fetch = createFetchMock(response);
      }
    }

    componentWillUnmount() {
      // Unmock fetch
      if (this.realFetch) {
        window.fetch = this.realFetch;
      }
    }

    render() {
      const { props } = this;
      const { nextProxy, onComponentRef } = props;

      return React.createElement(nextProxy.value, {
        ...props,
        nextProxy: nextProxy.next(),
        onComponentRef,
      });
    }
  }

  FetchProxy.propTypes = {
    ...proxyPropTypes,
  };

  return FetchProxy;
}
