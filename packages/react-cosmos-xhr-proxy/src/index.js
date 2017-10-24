import React, { Component } from 'react';
import xhrMock from 'xhr-mock';
import { proxyPropTypes } from 'react-cosmos-shared';

const defaults = {
  fixtureKey: 'xhr'
};

const mockDefaults = {
  method: 'get'
};

export default function createXhrProxy(options) {
  const { fixtureKey } = { ...defaults, ...options };

  class XhrProxy extends Component {
    constructor(props) {
      super(props);

      this.mock();
    }

    componentWillUnmount() {
      // Make sure we don't clear a mock from a newer instance (in React 16
      // B.constructor is called before A.componentWillUnmount)
      if (xhrMock.__prevProxy === this) {
        this.unmock();
      }
    }

    mock() {
      // Clear mocks from a previous FetchProxy instance
      // Warning: A page can only have one FetchProxy instance at the same time
      this.unmock();

      const mocks = this.props.fixture[fixtureKey];
      if (mocks) {
        xhrMock.setup();

        mocks.forEach(options => {
          const { url, method, response } = { ...mockDefaults, ...options };
          xhrMock[method.toLowerCase()](url, response);
        });
        xhrMock.__prevProxy = this;
      }
    }

    unmock() {
      xhrMock.teardown();
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

  XhrProxy.propTypes = proxyPropTypes;

  return XhrProxy;
}
