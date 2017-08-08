import React from 'react';
import { MemoryRouter } from 'react-router';
import { shallow } from 'enzyme';
import createRouterProxy from '../';

// Vars populated in beforeEach blocks
let RouterProxy;
let NextProxy;
let nextProxyNext;
let nextProxy;
let Component;
let componentRef;
let onComponentRef;
let onFixtureUpdate;
let routerWrapper;
let nextProxyWrapper;
let routerProps;
let nextProxyProps;

beforeEach(() => {
  RouterProxy = createRouterProxy();

  // Objects to check identity against
  NextProxy = () => {};
  nextProxyNext = {};
  nextProxy = {
    value: NextProxy,
    next: () => nextProxyNext,
  };
  Component = () => {};
  componentRef = {};
  onComponentRef = jest.fn();
  onFixtureUpdate = jest.fn();

  return new Promise(resolve => {
    routerWrapper = shallow(
      <RouterProxy
        nextProxy={nextProxy}
        component={Component}
        fixture={{
          foo: 'bar',
          route: '/foo-route',
        }}
        onComponentRef={ref => {
          onComponentRef(ref);
          resolve();
        }}
        onFixtureUpdate={onFixtureUpdate}
      />
    );

    // These are the props of the next proxy
    routerProps = routerWrapper.props();

    // Reach the inner element of the next proxy through the Router elements
    nextProxyWrapper = routerWrapper.dive().dive();
    nextProxyProps = nextProxyWrapper.props();

    // Simulate rendering
    nextProxyProps.onComponentRef(componentRef);
  });
});

describe('next proxy', () => {
  test('renders next proxy in line', () => {
    expect(nextProxyWrapper.type()).toBe(NextProxy);
  });

  test('sends nextProxy.next() to next proxy', () => {
    expect(nextProxyProps.nextProxy).toBe(nextProxyNext);
  });

  test('sends component to next proxy', () => {
    expect(nextProxyProps.component).toBe(Component);
  });

  test('sends fixture to next proxy', () => {
    expect(nextProxyProps.fixture.foo).toEqual('bar');
  });

  test('bubbles up component ref', () => {
    expect(onComponentRef.mock.calls[0][0]).toBe(componentRef);
  });

  test('bubbles up fixture updates', () => {
    nextProxyProps.onFixtureUpdate({});
    expect(onFixtureUpdate.mock.calls).toHaveLength(1);
  });
});

describe('router provider', () => {
  test('renders MemoryRouter', () => {
    expect(routerWrapper.type()).toBe(MemoryRouter);
  });

  test('sets initialEntries based on current route', () => {
    expect(routerProps.initialEntries).toEqual(['/foo-route']);
  });
});
