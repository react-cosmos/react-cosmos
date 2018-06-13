// @flow

import React, { Component } from 'react';
import xhrMock from 'xhr-mock';

import type { ProxyProps } from 'react-cosmos-flow/proxy';

type Options = {
  fixtureKey?: 'string'
};

const mockDefaults = {
  method: 'get'
};

export function createXhrProxy({ fixtureKey = 'xhr' }: Options = {}) {
  class XhrProxy extends Component<ProxyProps> {
    constructor(props: ProxyProps) {
      super(props);

      // webpack shiz
      // $FlowFixMe
      if (module.hot) {
        module.hot.status(status => {
          if (status === 'check') {
            xhrMock.teardown();
          } else if (status === 'apply') {
            this.mock();
          }
        });
      }

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
      const { nextProxy, ...rest } = this.props;
      const { value: NextProxy, next } = nextProxy;

      return <NextProxy {...rest} nextProxy={next()} />;
    }
  }

  return XhrProxy;
}
