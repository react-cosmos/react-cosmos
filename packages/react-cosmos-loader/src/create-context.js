// @flow

import until from 'async-until';
import React from 'react';
import Loader from './components/Loader';
import { isComponentClass } from './utils/is-component-class';

import type { Element } from 'react';
import type {
  ComponentRef,
  Wrapper,
  Fixture,
  Proxy,
  ContextFunctions
} from './types';

type Args = {
  renderer: (element: Element<any>) => Wrapper,
  proxies?: Array<Proxy>,
  fixture: Fixture,
  beforeInit?: () => Promise<any>
};

export function createContext(args: Args): ContextFunctions {
  const { renderer, proxies = [], fixture, beforeInit } = args;

  let updatedFixture = { ...fixture };
  let wrapper: ?Wrapper;
  let compRef: ?ComponentRef;

  const getRef = () => compRef;
  const getWrapper = () => wrapper;
  const get = fixtureKey => (fixtureKey ? updatedFixture[fixtureKey] : fixture);
  const set = fixtureParts => {
    updatedFixture = { ...updatedFixture, ...fixtureParts };
  };

  const mount = () => {
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

        // Ensure component ref is available when mounting is resolved (esp.
        // convenient in headless tests)
        if (isComponentClass(fixture.component)) {
          await until(() => compRef);
        }

        // Useful for **mocking refs** before fixture.init is called
        if (beforeInit) {
          await beforeInit();
        }

        // Allow fixture to do run setup steps after component mounts
        if (fixture.init) {
          await fixture.init({ getRef });
        }

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };

  const unmount = () => {
    if (wrapper) {
      wrapper.unmount();
    }
  };

  return {
    mount,
    unmount,
    getRef,
    getWrapper,
    get,
    set
  };
}
