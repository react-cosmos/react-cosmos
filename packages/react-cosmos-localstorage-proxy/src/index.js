import React, { Component } from 'react';
import proxyPropTypes from 'react-cosmos-utils/lib/proxy-prop-types';

const defaults = {
  fixtureKey: 'localStorage'
};

export default function createLocalStorageProxy(options) {
  const { fixtureKey } = { ...defaults, ...options };

  // Mocking localStorage completely ensures no conflict with existing browser
  // data and works in test environments like Jest
  class LocalStorageMock {
    constructor(store) {
      this.store = store;
    }
    clear() {
      this.store = {};
    }
    getItem(key) {
      return this.store[key] || null;
    }
    setItem(key, value) {
      this.store[key] = value.toString();
    }
    removeItem(key) {
      delete this.store[key];
    }
  }

  class LocalStorageProxy extends Component {
    constructor(props) {
      super(props);

      const mock = this.props.fixture[fixtureKey];
      if (mock) {
        this._localStorage = global.localStorage;
        Object.defineProperty(global, 'localStorage', {
          writable: true,
          value: new LocalStorageMock(mock)
        });
      }
    }

    componentWillUnmount() {
      // Only clear localStorage if proxy was activated in the first place
      if (this._localStorage) {
        global.localStorage = this._localStorage;
      }
    }

    render() {
      const { value: NextProxy, next } = this.props.nextProxy;

      return <NextProxy {...this.props} nextProxy={next()} />;
    }
  }

  LocalStorageProxy.propTypes = proxyPropTypes;

  return LocalStorageProxy;
}
