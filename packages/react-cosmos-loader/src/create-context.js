// @flow

import until from 'async-until';
import React, { Component } from 'react';
import Loader from './components/Loader';
import { isComponentClass } from './utils/is-component-class';

import type { ComponentType, Element, ElementRef } from 'react';

type ComponentInstance = ElementRef<typeof Component>;

type Wrapper = {
  unmount: () => any
};

type GettersSetters = {
  getRef: () => ?ComponentInstance,
  getWrapper: () => ?Wrapper,
  get: (fixtureKey?: string) => any,
  set: (fixtureParts: {}) => any
};

type Fixture = {
  component: ComponentType<any>,
  init?: (args: GettersSetters) => Promise<any>
};

type Args = {
  renderer: (element: Element<any>) => Wrapper,
  proxies?: Array<ComponentType<any>>,
  fixture: Fixture,
  beforeInit?: () => Promise<any>
};

type Return = {
  mount: () => Promise<any>,
  unmount: () => any
} & GettersSetters;

export function createContext(args: Args): Return {
  const { renderer, proxies = [], fixture, beforeInit } = args;

  let updatedFixture = { ...fixture };
  let wrapper: ?Wrapper;
  let compRef: ?ComponentInstance;

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
          await fixture.init({ getWrapper, getRef, get, set });
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
