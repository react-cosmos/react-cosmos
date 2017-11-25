// @flow

import until from 'async-until';
import React, { Component } from 'react';
import Loader from './components/Loader';
import type { ComponentType, Element, ElementRef } from 'react';

type ComponentInstance = ElementRef<typeof Component>;

type Wrapper = {
  unmount: () => any
};

type Fixture = {
  ref?: (ref: ComponentInstance) => Promise<any>
};

type Args = {
  renderer: (element: Element<any>) => Wrapper,
  proxies?: Array<ComponentType<any>>,
  fixture: Fixture,
  ref?: (ref: ComponentInstance) => Promise<any>
};

type Return = {
  mount: () => Promise<any>,
  unmount: () => any,
  getRef: () => ?ComponentInstance,
  getWrapper: () => ?Wrapper,
  get: (fixtureKey?: string) => any,
  set: (fixtureParts: {}) => any
};

export function createContext(args: Args): Return {
  const { renderer, proxies = [], fixture, ref } = args;

  let updatedFixture = { ...fixture };
  let wrapper: ?Wrapper;
  let compRef: ?ComponentInstance;

  return {
    mount: () => {
      return new Promise(async (resolve, reject) => {
        try {
          wrapper = renderer(
            <Loader
              proxies={proxies}
              fixture={updatedFixture}
              onComponentRef={ref => {
                compRef = ref;
              }}
            />
          );

          // Only Class components have refs, so for stateless components mount
          // will be synchronous. If fixture.ref or args.ref exists for a
          // stateless component mount will hang forever
          if (ref || fixture.ref) {
            await until(() => compRef);
          }

          // At this point we're sure compRef exists, but Flow doesn't
          // understand what until() does...
          if (ref && compRef) {
            await ref(compRef);
          }

          if (fixture.ref && compRef) {
            await fixture.ref(compRef);
          }

          resolve();
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
    getWrapper: () => wrapper,
    get: fixtureKey => (fixtureKey ? updatedFixture[fixtureKey] : fixture),
    set: fixtureParts => {
      updatedFixture = { ...updatedFixture, ...fixtureParts };
    }
  };
}
