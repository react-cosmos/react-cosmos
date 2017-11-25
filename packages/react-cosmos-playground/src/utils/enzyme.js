// @flow

import { mount as mountEnzyme } from 'enzyme';
import { createContext as _createContext } from 'react-cosmos-loader';
import createFetchProxy from 'react-cosmos-fetch-proxy';

import type { ComponentType } from 'react';

type Args = {
  proxies: Array<ComponentType<*>>,
  fixture: Object,
  ref?: Function
};

type Selector = string | ComponentType<*>;

export function createContext(args: Args) {
  const { fixture } = args;
  const FetchProxy = createFetchProxy();

  const context = _createContext({
    ...args,
    renderer: mountEnzyme,
    proxies: [FetchProxy]
  });
  const { getWrapper } = context;

  const getRootWrapper = () => {
    const wrapper = getWrapper();
    // Always keep wrapper up to date
    wrapper.update();
    return wrapper;
  };

  return {
    ...context,
    getRootWrapper,
    getWrapper: (selector: ?Selector) => {
      const innerWrapper = getRootWrapper().find(fixture.component);
      return selector ? innerWrapper.find(selector) : innerWrapper;
    }
  };
}

export function afterPendingTimers(): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, 0));
}
