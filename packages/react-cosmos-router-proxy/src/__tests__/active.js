import React from 'react';
import { MemoryRouter, Route } from 'react-router';
import { mount } from 'enzyme';
import createRouterProxy from '../';

// Vars populated in beforeEach blocks
let RouterProxy;
let NextProxy;
let nextProxyNext;
let nextProxy;
let Component;
let onComponentRef;
let onFixtureUpdate;
let wrapper;

beforeEach(() => {
  RouterProxy = createRouterProxy();

  // Objects to check identity against
  NextProxy = ({ onComponentRef }) => <span ref={onComponentRef} />;
  nextProxyNext = {};
  nextProxy = {
    value: NextProxy,
    next: () => nextProxyNext,
  };
  Component = () => {};
  onComponentRef = jest.fn();
  onFixtureUpdate = jest.fn();

  return new Promise(resolve => {
    wrapper = mount(
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
  });
});

describe('next proxy', () => {
  test('renders next proxy in line', () => {
    expect(wrapper.find(NextProxy)).toHaveLength(1);
  });

  describe('props', () => {
    let nextProxyWrapper;
    let nextProxyProps;

    beforeEach(() => {
      nextProxyWrapper = wrapper.find(NextProxy);
      nextProxyProps = nextProxyWrapper.props();
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

    test('bubbles up fixture updates', () => {
      nextProxyProps.onFixtureUpdate({});
      expect(onFixtureUpdate.mock.calls).toHaveLength(1);
    });
  });
});

describe('MemoryRouter', () => {
  test('renders MemoryRouter', () => {
    expect(wrapper.find(MemoryRouter)).toHaveLength(1);
  });

  describe('props', () => {
    let routerWrapper;
    let routerProps;

    beforeEach(() => {
      routerWrapper = wrapper.find(MemoryRouter);
      routerProps = routerWrapper.props();
    });

    test('sets initialEntries based on current route', () => {
      expect(routerProps.initialEntries).toEqual(['/foo-route']);
    });
  });
});

describe('Route', () => {
  test('renders Route', () => {
    expect(wrapper.find(Route)).toHaveLength(1);
  });

  describe('props', () => {
    let routeWrapper;
    let routeProps;

    beforeEach(() => {
      routeWrapper = wrapper.find(Route);
      routeProps = routeWrapper.props();
    });

    test('sets path based on current route', () => {
      expect(routeProps.path).toEqual('/foo-route');
    });

    test('renders next proxy element', () => {
      expect(routeProps.render().type).toEqual(NextProxy);
    });
  });
});
