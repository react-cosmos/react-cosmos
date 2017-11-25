// @flow

import React, { Component } from 'react';
import { Loader } from 'react-cosmos-loader';
import createRefCallbackProxy from 'react-cosmos-loader/lib/components/RefCallbackProxy';
import type { ComponentType, Element, ElementRef } from 'react';

const RefCallbackProxy = createRefCallbackProxy();

type Wrapper = {
  unmount: () => any
};

type Args = {
  renderer: (element: Element<any>) => Wrapper,
  proxies?: Array<ComponentType<any>>,
  fixture: Object
};

type Return = {
  mount: () => Promise<any>,
  unmount: () => any,
  getRef: () => ?ElementRef<typeof Component>,
  getWrapper: () => ?Wrapper
};

export function createContext(args: Args): Return {
  const { renderer, proxies = [], fixture } = args;

  let wrapper: ?Wrapper;
  let compRef;

  return {
    mount: () => {
      return new Promise((resolve, reject) => {
        try {
          wrapper = renderer(
            <Loader
              proxies={[RefCallbackProxy, ...proxies]}
              fixture={fixture}
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
