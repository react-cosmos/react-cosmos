import React, { Component } from 'react';
import fetchMock from 'fetch-mock';
import proxyPropTypes from 'react-cosmos-utils/lib/proxy-prop-types';

const defaults = {
  fixtureKey: 'fetch'
};

export default function createFetchProxy(options) {
  const { fixtureKey } = { ...defaults, ...options };

  class FetchProxy extends Component {
    constructor(props) {
      super(props);

      const mocks = props.fixture[fixtureKey];
      if (mocks) {
        mocks.forEach(options => {
          fetchMock.mock(options);
        });
      }
    }

    componentWillUnmount() {
      // Unmock fetch
      if (typeof fetchMock.restore === 'function') {
        fetchMock.restore();
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

  FetchProxy.propTypes = proxyPropTypes;

  return FetchProxy;
}
