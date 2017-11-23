// @flow

import React from 'react';
import { mount as mountEnzyme } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createInitCallbackProxy from 'react-cosmos-loader/lib/components/InitCallbackProxy';
import createFetchProxy from 'react-cosmos-fetch-proxy';

import type { ComponentType } from 'react';

type Args = {
  proxies: Array<ComponentType<*>>,
  fixture: Object,
  mockRefs?: Function
};

type Selector = string | ComponentType<*>;

export function createContext({ fixture, mockRefs }: Args) {
  const InitCallbackProxy = createInitCallbackProxy();
  const FetchProxy = createFetchProxy();

  let wrapper;
  let compInstance;

  const mount = async () =>
    new Promise(resolve => {
      // Mount component in order for ref and lifecycle methods to be called
      wrapper = mountEnzyme(
        <Loader
          proxies={[InitCallbackProxy, FetchProxy]}
          fixture={{
            ...fixture,
            init: async (...args) => {
              if (mockRefs) {
                await mockRefs(...args);
              }
              if (fixture.init) {
                await fixture.init(...args);
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
