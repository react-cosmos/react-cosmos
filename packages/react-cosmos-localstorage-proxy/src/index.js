import React, { Component } from 'react';
import proxyPropTypes from 'react-cosmos-utils/lib/proxy-prop-types';

// Mocking localStorage completely ensures no conflict with existing browser
// data and works in test environments like Jest
class LocalStorageMock {
  constructor(store = {}, onUpdate) {
    this.store = { ...store };
    this.onUpdate = onUpdate;
  }

  clear() {
    this.store = {};
    this.update();
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
    this.update();
  }

  removeItem(key) {
    delete this.store[key];
    this.update();
  }

  update() {
    this.onUpdate(this.store);
  }
}

const defaults = {
  fixtureKey: 'localStorage'
};

export default function createLocalStorageProxy(options) {
  const { fixtureKey } = { ...defaults, ...options };

  class LocalStorageProxy extends Component {
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

  LocalStorageProxy.propTypes = proxyPropTypes;

  return LocalStorageProxy;
}
