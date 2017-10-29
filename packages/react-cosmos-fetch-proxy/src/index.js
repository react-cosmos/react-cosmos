import React, { Component } from 'react';
import fetchMock from 'fetch-mock';
import { proxyPropTypes } from 'react-cosmos-shared/lib/react';

const defaults = {
  fixtureKey: 'fetch'
};

export default function createFetchProxy(options) {
  const { fixtureKey } = { ...defaults, ...options };

  class FetchProxy extends Component {
    constructor(props) {
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

  FetchProxy.propTypes = proxyPropTypes;

  return FetchProxy;
}
