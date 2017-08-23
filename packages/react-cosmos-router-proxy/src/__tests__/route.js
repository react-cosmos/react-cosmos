import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router';
import createRouterProxy from '../';

// The final responsibility of proxies is to render the user's component at
// the end of the proxy chain. While it goes beyond unit testing, testing a
// complete proxy chain provides a clearer picture than solely dissecting the
// props that the tested proxy passes to the next.
const Component = () => <span>__COMPONENT_MOCK__</span>;

const NextProxy = props => {
  const { value: P, next } = props.nextProxy;

  return <P {...props} nextProxy={next()} />;
};

const LastProxy = ({ component: C, onComponentRef }) =>
  <C ref={onComponentRef} />;

// Vars populated from scratch before each test
let onFixtureUpdate;
let wrapper;

beforeEach(() => {
  // Create Proxy with default options
  const RouterProxy = createRouterProxy();

  // Fixture updates from inner proxies need to bubble up to the root proxy
  onFixtureUpdate = jest.fn();

  // Rendering can be asynchronous, so our safest strategy is to wait until the
  // Component `ref` is called. If the entire test suite times out, it's
  // probably because onComponentRef isn't properly propagated.
  return new Promise(resolve => {
    // Mouting is more useful because it calls lifecycle methods and enables
    // DOM interaction
    wrapper = mount(
      <RouterProxy
        nextProxy={{
          // Besides rendering the next proxy, we also need to ensure the 2nd
          // next proxy is passed to the next proxy for further chaining. It
          // might take a few reads to grasp this...
          value: NextProxy,
          next: () => ({
            value: LastProxy,
            next: () => {}
          })
        }}
        component={Component}
        fixture={{
          // Except for some rare cases, the proxy needs to pass along the
          // fixture without changing it
          foo: 'bar',
          // This tells RouterProxy to add MemoryRouter wrapper
          url: '/route/foo',
          // This tells RouterProxy to add Route wrapper
          route: '/route/:param'
        }}
        onComponentRef={resolve}
        onFixtureUpdate={onFixtureUpdate}
      />
    );
  });
});

test('renders next proxy', () => {
  expect(wrapper.find(NextProxy)).toHaveLength(1);
});

test('renders component', () => {
  expect(wrapper.text()).toEqual('__COMPONENT_MOCK__');
});

describe('next proxy props', () => {
  let nextProxyProps;

  beforeEach(() => {
    nextProxyProps = wrapper.find(NextProxy).props();
  });

  test('sends component to next proxy', () => {
    expect(nextProxyProps.component).toBe(Component);
  });

  test('sends fixture to next proxy', () => {
    expect(nextProxyProps.fixture.foo).toEqual('bar');
  });

  test('passes 2nd next proxy to next proxy', () => {
    expect(nextProxyProps.nextProxy.value).toBe(LastProxy);
  });

  test('bubbles up fixture updates', () => {
    nextProxyProps.onFixtureUpdate({});
    expect(onFixtureUpdate.mock.calls).toHaveLength(1);
  });
});

describe('MemoryRouter', () => {
  test('renders MemoryRouter', () => {
    expect(wrapper.find(MemoryRouter)).toHaveLength(1);
  });

  describe('props', () => {
    let routerProps;

    beforeEach(() => {
      routerProps = wrapper.find(MemoryRouter).props();
    });

    test('sets initialEntries based on current route', () => {
      expect(routerProps.initialEntries).toEqual(['/route/foo']);
    });
  });
});

test('renders Route', () => {
  expect(
    wrapper.find(Route).filterWhere(w => w.prop('path') === '/route/:param')
  ).toHaveLength(1);
});
