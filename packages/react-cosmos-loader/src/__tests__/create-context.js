// @flow

import React, { Component } from 'react';
import TestRenderer from 'react-test-renderer';
import afterPendingPromises from 'after-pending-promises';
import Loader from '../components/Loader';
import { createContext } from '../create-context';

function ProxyA(props) {
  const { nextProxy } = props;
  return <nextProxy.value {...props} nextProxy={nextProxy.next()} />;
}

function ProxyB(props) {
  const { nextProxy } = props;
  return <nextProxy.value {...props} nextProxy={nextProxy.next()} />;
}

class FooComp extends Component<{}> {
  render() {
    return 'YO';
  }
}

const wrapper = {
  unmount: jest.fn()
};
const renderer = jest.fn(element => {
  TestRenderer.create(element);
  return wrapper;
});
const proxies = [ProxyA, ProxyB];
const fixture = { component: FooComp, state: { count: 5 } };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('mounting', () => {
  beforeEach(async () => {
    const { mount } = createContext({ renderer, proxies, fixture });
    await mount();
  });

  it('calls renderer on mount', () => {
    expect(renderer).toHaveBeenCalled();
  });

  it('calls renderer with Loader element', () => {
    const element = renderer.mock.calls[0][0];
    expect(element.type).toBe(Loader);
  });

  describe('Loader props', () => {
    it('has fixture', () => {
      const element = renderer.mock.calls[0][0];
      expect(element.props.fixture).toEqual(fixture);
    });

    it('includes user proxies', () => {
      const element = renderer.mock.calls[0][0];
      expect(element.props.proxies).toContain(ProxyA);
      expect(element.props.proxies).toContain(ProxyB);
    });
  });
});

describe('unmounting', () => {
  beforeEach(async () => {
    const { mount, unmount } = createContext({ renderer, fixture });
    await mount();
    await unmount();
  });

  it('calls wrapper.unmount', () => {
    expect(wrapper.unmount).toHaveBeenCalled();
  });
});

it('returns component ref', async () => {
  const { mount, getRef } = createContext({ renderer, fixture });
  await mount();

  expect(getRef()).toBeInstanceOf(FooComp);
});

it('returns wrapper', async () => {
  const { mount, getWrapper } = createContext({ renderer, fixture });
  await mount();

  expect(getWrapper()).toBe(wrapper);
});

it('stalls mounting until beforeInit resolves', async () => {
  let resolveHook;
  const beforeInit = () =>
    new Promise(resolve => {
      resolveHook = resolve;
    });
  const { mount } = createContext({ renderer, fixture, beforeInit });

  let hasMounted = false;
  mount().then(() => {
    hasMounted = true;
  });

  await afterPendingPromises();
  expect(hasMounted).toBe(false);

  if (resolveHook) {
    resolveHook();
  } else {
    throw new Error('Ref has not been called');
  }

  await afterPendingPromises();
  expect(hasMounted).toBe(true);
});

it('stalls mounting until fixture.init resolves', async () => {
  let resolveHook;
  const init = () =>
    new Promise(resolve => {
      resolveHook = resolve;
    });
  const { mount } = createContext({ renderer, fixture: { ...fixture, init } });

  let hasMounted = false;
  mount().then(() => {
    hasMounted = true;
  });

  await afterPendingPromises();
  expect(hasMounted).toBe(false);

  if (resolveHook) {
    resolveHook();
  } else {
    throw new Error('Ref has not been called');
  }

  await afterPendingPromises();
  expect(hasMounted).toBe(true);
});

it('gets fixture', async () => {
  const { get } = createContext({ renderer, fixture });

  expect(get()).toEqual(fixture);
});

it('gets fixture part', async () => {
  const { get } = createContext({ renderer, fixture });

  expect(get('state')).toEqual({ count: 5 });
});

it('set fixture part', async () => {
  const { get, set } = createContext({ renderer, fixture });

  set({ state: { count: 6 } });
  expect(get('state')).toEqual({ count: 6 });
});
