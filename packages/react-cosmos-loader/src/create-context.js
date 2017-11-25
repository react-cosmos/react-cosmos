// @flow

import React, { Component } from 'react';
import Loader from './components/Loader';
import createRefCallbackProxy from './components/RefCallbackProxy';
import type { ComponentType, Element, ElementRef } from 'react';

const RefCallbackProxy = createRefCallbackProxy();

type Wrapper = {
  unmount: () => any
};

type Fixture = {
  ref?: () => Promise<any>
};

type Args = {
  renderer: (element: Element<any>) => Wrapper,
  proxies?: Array<ComponentType<any>>,
  fixture: Fixture,
  ref?: () => Promise<any>
};

type Return = {
  mount: () => Promise<any>,
  unmount: () => any,
  getRef: () => ?ElementRef<typeof Component>,
  getWrapper: () => ?Wrapper
  // get: (fixtureKey: string) => any
};

export function createContext(args: Args): Return {
  const { renderer, proxies = [], fixture, ref } = args;

  let wrapper: ?Wrapper;
  let compRef: ?ElementRef<typeof Component>;

  return {
    mount: () => {
      return new Promise((resolve, reject) => {
        try {
          wrapper = renderer(
            <Loader
              proxies={[RefCallbackProxy, ...proxies]}
              fixture={ref ? decorateFixtureRef(fixture, ref) : fixture}
              onComponentRef={ref => {
                compRef = ref;
                resolve();
              }}
            />
          );
        } catch (err) {
          reject(err);
        }
      });
    },
    unmount: () => {
      if (wrapper) {
        wrapper.unmount();
      }
    },
    getRef: () => compRef,
    getWrapper: () => wrapper
  };
}

function decorateFixtureRef(
  fixture: Fixture,
  ref: () => Promise<any>
): Fixture {
  return {
    ...fixture,
    async ref(...args) {
      if (ref) {
        await ref(...args);
      }
      if (fixture.ref) {
        await fixture.ref(...args);
      }
    }
  };
}
