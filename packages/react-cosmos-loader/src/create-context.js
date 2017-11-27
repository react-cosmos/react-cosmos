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
  onUpdate?: (fixturePart: {}) => any,
  beforeInit?: () => Promise<any>
};

export function createContext(args: Args): ContextFunctions {
  const { renderer, proxies = [], fixture, onUpdate, beforeInit } = args;

  let updatedFixture = { ...fixture };
  let wrapper: ?Wrapper;
  let compRef: ?ComponentRef;

  function getRef() {
    return compRef;
  }

  function getWrapper() {
    return wrapper;
  }

  function get(fixtureKey) {
    return fixtureKey ? updatedFixture[fixtureKey] : updatedFixture;
  }

  function update(fixturePart) {
    updatedFixture = { ...updatedFixture, ...fixturePart };

    if (onUpdate) {
      onUpdate(fixturePart);
    }
  }

  function mount(clearPrevInstance = true) {
    return new Promise(async (resolve, reject) => {
      try {
        if (clearPrevInstance) {
          unmount();
        }

        wrapper = renderer(
          <Loader
            proxies={proxies}
            fixture={updatedFixture}
            onComponentRef={ref => {
              compRef = ref;
            }}
            onFixtureUpdate={update}
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
  }

  function unmount() {
    if (wrapper) {
      wrapper.unmount();
    }
  }

  return {
    mount,
    unmount,
    getRef,
    getWrapper,
    get
  };
}
