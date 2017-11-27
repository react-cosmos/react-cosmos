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
const onUpdate = jest.fn();
const proxies = [ProxyA, ProxyB];
const fixture = { component: FooComp, state: { count: 5 } };

beforeEach(() => {
  jest.clearAllMocks();
});

it('calls renderer with Loader element', async () => {
  const { mount } = createContext({ renderer, proxies, fixture });
  await mount();

  const element = renderer.mock.calls[0][0];
  expect(element.type).toBe(Loader);
});

it('includes fixture in Loader props', async () => {
  const { mount } = createContext({ renderer, proxies, fixture });
  await mount();

  const element = renderer.mock.calls[0][0];
  expect(element.props.fixture).toEqual(fixture);
});

it('includes user proxies in Loader props', async () => {
  const { mount } = createContext({ renderer, proxies, fixture });
  await mount();

  const element = renderer.mock.calls[0][0];
  expect(element.props.proxies).toContain(ProxyA);
  expect(element.props.proxies).toContain(ProxyB);
});

it('includes update callback in Loader props', async () => {
  const { mount } = createContext({ renderer, proxies, fixture, onUpdate });
  await mount();

  const element = renderer.mock.calls[0][0];
  const { onFixtureUpdate } = element.props;

  onFixtureUpdate({ state: { count: 6 } });
  expect(onUpdate).toHaveBeenCalledWith({ state: { count: 6 } });
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

it('updates fixture part', async () => {
  const { get, update } = createContext({ renderer, fixture });

  update({ state: { count: 6 } });
  expect(get('state')).toEqual({ count: 6 });
});

it('forwards update calls', async () => {
  const { update } = createContext({ renderer, fixture, onUpdate });

  update({ state: { count: 6 } });
  expect(onUpdate).toHaveBeenCalledWith({ state: { count: 6 } });
});

it('calls wrapper.unmount on unmount', async () => {
  const { mount, unmount } = createContext({ renderer, fixture });
  await mount();
  await unmount();

  expect(wrapper.unmount).toHaveBeenCalled();
});
