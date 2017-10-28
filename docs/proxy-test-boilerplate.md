### Proxy test boilerplate

```js
import React from 'react';
import { mount } from 'enzyme';
import createFooProxy from '../';

// The final responsibility of proxies is to render the user's component at
// the end of the proxy chain. While it goes beyond unit testing, testing a
// complete proxy chain provides a clearer picture than solely dissecting the
// props that the tested proxy passes to the next.
const Component = () => <span>__COMPONENT_MOCK__</span>;

const NextProxy = props => {
  const { nextProxy } = props;
  return <nextProxy.value {...props} nextProxy={nextProxy.next()} />;
};

const LastProxy = ({ fixture }) => <fixture.component {...fixture.props} />;

// Vars populated from scratch before each test
let onFixtureUpdate;
let wrapper;

beforeEach(() => {
  // Create Proxy with default options
  const FooProxy = createFooProxy();

  // Fixture updates from inner proxies need to bubble up to the root proxy
  onFixtureUpdate = jest.fn();

  // Mouting is more useful because it calls lifecycle methods and enables
  // DOM interaction
  wrapper = mount(
    <FooProxy
      nextProxy={{
        // Besides rendering the next proxy, we also need to ensure the 2nd
        // next proxy is passed to the next proxy for further chaining. It
        // might take a few reads to grasp this...
        value: NextProxy,
        next: () => ({
          value: LastProxy,
          next: () => {},
        }),
      }}
      fixture={{
        component: Component,
        // Except for some rare cases, the proxy needs to pass along the
        // fixture without changing it
        foo: 'bar'
      }}
      onComponentRef={() => {}}
      onFixtureUpdate={onFixtureUpdate}
    />
  );
});

it('renders next proxy', () => {
  expect(wrapper.find(NextProxy)).toHaveLength(1);
});

it('renders component', () => {
  expect(wrapper.text()).toEqual('__COMPONENT_MOCK__');
});

describe('next proxy props', () => {
  let nextProxyProps;

  beforeEach(() => {
    nextProxyProps = wrapper.find(NextProxy).props();
  });

  it('sends fixture to next proxy', () => {
    expect(nextProxyProps.fixture).toEqual({
      component: Component,
      foo: 'bar'
    });
  });

  it('passes 2nd next proxy to next proxy', () => {
    expect(nextProxyProps.nextProxy.value).toBe(LastProxy);
  });

  it('bubbles up fixture updates', () => {
    nextProxyProps.onFixtureUpdate({});
    expect(onFixtureUpdate.mock.calls).toHaveLength(1);
  });
});
```
