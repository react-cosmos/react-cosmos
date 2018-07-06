import React from 'react';
import { mount } from 'enzyme';
import { createRouterProxy } from '..';

// The final responsibility of proxies is to render the user's component at
// the end of the proxy chain. While it goes beyond unit testing, testing a
// complete proxy chain provides a clearer picture than solely dissecting the
// props that the tested proxy passes to the next.
const Component = ({ location }) => {
  if (!location) {
    throw new Error('Expected props.location');
  }
  return <span>__COMPONENT_MOCK__</span>;
};

const NextProxy = props => {
  const { value: P, next } = props.nextProxy;

  return <P {...props} nextProxy={next()} />;
};

const LastProxy = ({ fixture }) => <fixture.component {...fixture.props} />;

// Vars populated from scratch before each test
let onFixtureUpdate;
let wrapper;

beforeEach(() => {
  // Create Proxy with default options
  const RouterProxy = createRouterProxy();

  // Fixture updates from inner proxies need to bubble up to the root proxy
  onFixtureUpdate = jest.fn();

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
      fixture={{
        component: Component,
        // Except for some rare cases, the proxy needs to pass along the
        // fixture without changing it
        foo: 'bar',
        // This tells RouterProxy to add MemoryRouter wrapper
        url: '/route/foo',
        // This tells RouterProxy to add Route wrapper
        route: '/route/:param',
        // This tells RouterProxy to inject routerProps
        provideRouterProps: true
      }}
      onComponentRef={() => {}}
      onFixtureUpdate={onFixtureUpdate}
    />
  );
});

test('renders component with router props', () => {
  expect(wrapper.find(Component).props().location).toBeDefined();
  expect(wrapper.find(Component).props().match).toBeDefined();
  expect(wrapper.find(Component).props().history).toBeDefined();
  expect(wrapper.text()).toEqual('__COMPONENT_MOCK__');
});
