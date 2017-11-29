// @flow

import React from 'react';
import { mount as mountEnzyme } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createRefCallbackProxy from 'react-cosmos-loader/lib/components/RefCallbackProxy';
import createFetchProxy from 'react-cosmos-fetch-proxy';

import type { ComponentType } from 'react';

type Args = {
  proxies: Array<ComponentType<*>>,
  fixture: Object,
  mockRefs?: Function
};

type Selector = string | ComponentType<*>;

export function createContext({ fixture, mockRefs }: Args) {
  const RefCallbackProxy = createRefCallbackProxy();
  const FetchProxy = createFetchProxy();

  let wrapper;
  let compInstance;

  const mount = async () =>
    new Promise(resolve => {
      // Mount component in order for ref and lifecycle methods to be called
      wrapper = mountEnzyme(
        <Loader
          proxies={[RefCallbackProxy, FetchProxy]}
          fixture={{
            ...fixture,
            ref: async (...args) => {
              if (mockRefs) {
                await mockRefs(...args);
              }
              if (fixture.ref) {
                await fixture.ref(...args);
              }
            }
          }}
          onComponentRef={ref => {
            compInstance = ref;
            resolve();
          }}
        />
      );
    });

  const getRootWrapper = () => {
    // Always keep wrapper up to date
    wrapper.update();
    return wrapper;
  };

  return {
    mount,
    unmount: () => wrapper.unmount(),
    getRootWrapper,
    getWrapper: (selector: ?Selector) => {
      const innerWrapper = getRootWrapper().find(fixture.component);
      return selector ? innerWrapper.find(selector) : innerWrapper;
    },
    getCompInstance: () => compInstance
  };
}

export function afterPendingTimers(): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, 0));
}
