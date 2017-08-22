import React, { Component } from 'react';
import xhrMock from 'xhr-mock';
import proxyPropTypes from 'react-cosmos-utils/lib/proxy-prop-types';

const defaults = {
  fixtureKey: 'xhr',
};

const mockDefaults = {
  method: 'get',
};

export default function createXhrProxy(options) {
  const { fixtureKey } = { ...defaults, ...options };

  class XhrProxy extends Component {
    constructor(props) {
      super(props);

      const mocks = props.fixture[fixtureKey];
      if (mocks) {
        xhrMock.setup();

        mocks.forEach(options => {
          const { url, method, response } = { ...mockDefaults, ...options };
          xhrMock[method.toLowerCase()](url, response);
        });
      }
    }

    componentWillUnmount() {
      // Unmock xhr
      xhrMock.teardown();
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

  XhrProxy.propTypes = proxyPropTypes;

  return XhrProxy;
}
