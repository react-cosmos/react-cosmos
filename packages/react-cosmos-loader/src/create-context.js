// @flow

import until from 'async-until';
import React from 'react';
import createStateProxy from 'react-cosmos-state-proxy';
import Loader from './components/Loader';
import { isComponentClass } from './utils/is-component-class';

import type {
  ComponentRef,
  Wrapper,
  ContextArgs,
  ContextFunctions
} from './types';

let wrapper: ?Wrapper;

/**
 * Generalized way to render fixtures, without any assumptions on the renderer.
 *
 * The fixture context records state changes received from the rendered proxy
 * chain and provides helper methods for reading the latest state (via get) or
 * subscribing to all updates (via onUpdate). The former is used in headless
 * test environments while the latter in the Playground UI's "fixture editor".
 *
 * Important: Because some proxies are global by nature (eg. fetch-proxy mocks
 * window.fetch) there can only be one active context per page. This means that
 * mounting a new context will unmount the previous automatically.
 */
export function createContext(args: ContextArgs): ContextFunctions {
  const {
    renderer,
    rendererOptions,
    proxies = [],
    fixture,
    onUpdate,
    beforeInit
  } = args;

  let updatedFixture = { ...fixture };
  let compRefCalled = false;
  let compRef: ?ComponentRef;
  let StateProxy;

  function getRef() {
    if (!compRef) {
      throw new Error(
        `Component ref is not available yet. Did you mount() the context?`
      );
    }

    return compRef;
  }

  function getWrapper() {
    if (!wrapper) {
      throw new Error(
        `Context wrapper hasn't been created yet. Did you mount() the context?`
      );
    }

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

          // Bring fixture to its initial state
          updatedFixture = { ...fixture };
        }

        if (!StateProxy) {
          StateProxy = createStateProxy();
        }

        wrapper = renderer(
          <Loader
            proxies={[...proxies, StateProxy]}
            fixture={updatedFixture}
            onComponentRef={ref => {
              // Sometimes the component unmounts instantly (eg. redirects on
              // componentWillMount and parent HoC doesn't render it anymore).
              // In this cases compRef will be null but we'll know that the
              // component rendered
              compRefCalled = true;
              compRef = ref;
            }}
            onFixtureUpdate={update}
          />,
          rendererOptions
        );

        // Ensure component ref is available when mounting is resolved (esp.
        // convenient in headless tests)
        if (isComponentClass(fixture.component)) {
          await until(() => compRefCalled);
        }

        // Useful for **mocking refs** before fixture.init is called
        if (beforeInit) {
          await beforeInit();
        }

        // Allow fixture to do run setup steps after component mounts
        if (fixture.init) {
          await fixture.init({ compRef });
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
      wrapper = undefined;
    }
  }

  return {
    mount,
    unmount,
    getRef,
    getWrapper,
    get,
    getField: get
  };
}
