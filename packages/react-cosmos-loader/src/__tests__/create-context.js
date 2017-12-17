// @flow

import React, { Component } from 'react';
import TestRenderer from 'react-test-renderer';
import afterPendingPromises from 'after-pending-promises';
import Loader from '../components/Loader';
import { createContext as _createContext } from '../create-context';

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

// Unmount between tests to prevent leaking module state
let _unmount;
const createContext = args => {
  const context = _createContext(args);
  _unmount = context.unmount;
  return context;
};

function getElementFromLastRendererCall() {
  const { calls } = renderer.mock;
  return calls[calls.length - 1][0];
}

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => _unmount());

it('calls renderer with Loader element', async () => {
  const { mount } = createContext({ renderer, proxies, fixture });
  await mount();

  const element = getElementFromLastRendererCall();
  expect(element.type).toBe(Loader);
});

it('includes fixture in Loader props', async () => {
  const { mount } = createContext({ renderer, proxies, fixture });
  await mount();

  const element = getElementFromLastRendererCall();
  expect(element.props.fixture).toEqual(fixture);
});

it('includes user proxies in Loader props', async () => {
  const { mount } = createContext({ renderer, proxies, fixture });
  await mount();

  const element = getElementFromLastRendererCall();
  expect(element.props.proxies).toContain(ProxyA);
  expect(element.props.proxies).toContain(ProxyB);
});

it('calls renderer with loaderOptions', async () => {
  const rendererOptions = {};
  const { mount } = createContext({
    renderer,
    rendererOptions,
    proxies,
    fixture
  });
  await mount();

  expect(renderer.mock.calls[0][1]).toBe(rendererOptions);
});

it('includes update callback in Loader props', async () => {
  const { mount } = createContext({ renderer, proxies, fixture, onUpdate });
  await mount();

  const element = getElementFromLastRendererCall();
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

it('gets fixture (alias)', async () => {
  const { getField } = createContext({ renderer, fixture });

  expect(getField()).toEqual(fixture);
});

it('gets fixture part (alias)', async () => {
  const { getField } = createContext({ renderer, fixture });

  expect(getField('state')).toEqual({ count: 5 });
});

it('calls wrapper.unmount on unmount', async () => {
  const { mount, unmount } = createContext({ renderer, fixture });
  await mount();
  await unmount();

  expect(wrapper.unmount).toHaveBeenCalledTimes(1);
});

it('unmounts before 2nd mount by default', async () => {
  const { mount } = createContext({ renderer, fixture });
  await mount();
  await mount();

  expect(wrapper.unmount).toHaveBeenCalledTimes(1);
});

it('resets fixture state before 2nd mount by default', async () => {
  const { mount } = createContext({ renderer, fixture });
  await mount();

  const firstArgs = getElementFromLastRendererCall();
  const { onFixtureUpdate } = firstArgs.props;
  onFixtureUpdate({ state: { count: 6 } });

  await mount();

  const secondArgs = getElementFromLastRendererCall();
  expect(secondArgs.props.fixture.state.count).toBe(5);
});

it('does not unmount before 2nd mount if clearPrevInstance is false', async () => {
  const { mount } = createContext({ renderer, fixture });
  await mount();
  await mount(false);

  expect(wrapper.unmount).not.toHaveBeenCalled();
});

it('does not reset fixture state before 2nd mount by default', async () => {
  const { mount } = createContext({ renderer, fixture });
  await mount();

  const firstArgs = getElementFromLastRendererCall();
  const { onFixtureUpdate } = firstArgs.props;
  onFixtureUpdate({ state: { count: 6 } });

  await mount(false);

  const secondArgs = getElementFromLastRendererCall();
  expect(secondArgs.props.fixture.state.count).toBe(6);
});

it('unmounts before 2nd createContext', async () => {
  await createContext({ renderer, fixture }).mount();
  await createContext({ renderer, fixture }).mount();

  expect(wrapper.unmount).toHaveBeenCalledTimes(1);
});
