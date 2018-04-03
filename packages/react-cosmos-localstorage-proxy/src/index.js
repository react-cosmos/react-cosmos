import React, { Component } from 'react';
import { proxyPropTypes } from 'react-cosmos-shared/react';
import { LocalStorageMock } from './local-storage-mock';

const defaults = {
  fixtureKey: 'localStorage'
};

export function createLocalStorageProxy(options) {
  const { fixtureKey } = { ...defaults, ...options };

  class LocalStorageProxy extends Component {
    static LocalStorageProxy = proxyPropTypes;

    constructor(props) {
      super(props);

      const mock = this.props.fixture[fixtureKey];
      if (mock) {
        this._localStorageOrig = global.localStorage;
        this._localStorageMock = new LocalStorageMock(mock, updatedStore => {
          this.props.onFixtureUpdate({ localStorage: updatedStore });
        });

        Object.defineProperty(global, 'localStorage', {
          writable: true,
          value: this._localStorageMock
        });
      }
    }

    componentWillUnmount() {
      // Make sure we don't clear a mock from a newer instance (in React 16
      //  B.constructor is called before A.componentWillUnmount)
      if (global.localStorage === this._localStorageMock) {
        global.localStorage = this._localStorageOrig;
      }
    }

    render() {
      const { value: NextProxy, next } = this.props.nextProxy;

      return <NextProxy {...this.props} nextProxy={next()} />;
    }
  }

  return LocalStorageProxy;
}
