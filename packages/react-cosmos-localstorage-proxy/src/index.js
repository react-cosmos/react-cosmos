// @flow

import React, { Component } from 'react';
import { LocalStorageMock } from './local-storage-mock';

import type { ProxyProps } from 'react-cosmos-flow/proxy';

type Options = {
  fixtureKey?: string
};

export function createLocalStorageProxy({
  fixtureKey = 'localStorage'
}: Options = {}) {
  class LocalStorageProxy extends Component<ProxyProps> {
    _localStorageOrig: Object;

    _localStorageMock: LocalStorageMock;

    constructor(props: ProxyProps) {
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
